const test = require('node:test')
const assert = require('node:assert')
const fs = require('fs')
const os = require('os')
const path = require('path')
const zlib = require('zlib')
const { root, tankCode, encode, realCode, barrel, section, polygon } = require('./helpers.js')

test('decodes msgpack and JSON codes', () => {
  const tank = { name: 'Small', render: [polygon()] }
  assert.deepStrictEqual(tankCode.decode(encode(tank)), tank)
  assert.deepStrictEqual(tankCode.decode(encode(tank, true)), tank)
})

test('accepts url-safe base64 and line breaks', () => {
  const text = encode({ name: 'Wrapped', render: [polygon(), polygon({ x: 0.5 })] })
  const safe = text.replace(/\+/g, '-').replace(/\//g, '_').replace(/(.{20})/g, '$1\n')
  assert.strictEqual(tankCode.decode(safe).name, 'Wrapped')
})

test('refuses things that are not tank codes', () => {
  assert.throws(() => tankCode.decode(''), /empty/)
  assert.throws(() => tankCode.decode('not a code at all'), /not a tank code/)
  assert.throws(() => tankCode.decode(encode({ name: 'No render' })), /not a tank code/)
  assert.throws(() => tankCode.decode(encode({ type: 'tank', barrels: [] }, true)), /older Scenexe code/)
  assert.throws(() => tankCode.load(encode([1, 2, 3])), /not a tank code/)
})

test('refuses codes that inflate past the size limit', () => {
  const huge = zlib.deflateSync(Buffer.alloc(tankCode.LIMITS.inflated + 1024, 32)).toString('base64')
  assert.throws(() => tankCode.decode(huge), /too big/)
})

test('loads the Unknow Remaster code', () => {
  const tank = tankCode.load(realCode())
  assert.strictEqual(tank.name, 'Unknow remaster ( fix )')
  assert.deepStrictEqual(tank.counts, { parts: 1361, firing: 92, synced: 13, looks: 5 })
  assert.strictEqual(tank.shots.length, 92)
  assert.deepStrictEqual(tank.changed, [])
  assert.ok(tank.reach > 2.7 && tank.reach < 2.8, String(tank.reach))
  const kinds = {}
  for(const s of tank.shots) { kinds[s.kind] = (kinds[s.kind] || 0) + 1 }
  assert.deepStrictEqual(kinds, { custom: 62, trap: 11, bullet: 9, drone: 10 })
})

test('converts each part type', () => {
  const tank = tankCode.load({
    name: 'Parts',
    data: { maxHealth: 500, color: 0x112233 },
    render: [
      polygon({ polygonData: { sides: -5, size: 1, inner: 0.4 }, fixedLineWidth: 0, occlude: 'scenexeBaseBase' }),
      { type: 'path', joints: [{ type: 'moveTo', x: 0, y: 0 }, { type: 'lineTo', x: 1, y: 0 }, { type: 'lineTo', x: 1, y: 1 }] },
      section('auto', [barrel(0)], { rotationData: { behavior: 'auto', detectRange: 10, forgetRange: 4, rangeRelative: 'top' } }),
      { type: 'scenexe-aura', auraSize: 3, auraInnerSize: 1, auraDamage: 2, auraHealthSteal: 0.5, hideAura: 1 },
      { type: 'mystery' }
    ]
  })
  const byType = t => tank.render.filter(n => n.t === t)
  assert.strictEqual(byType('polygon')[0].sides, -5)
  assert.strictEqual(byType('polygon')[0].inner, 0.4)
  assert.strictEqual(byType('polygon')[0].lineWidth, 0)
  assert.strictEqual(byType('polygon')[0].body, true)
  assert.strictEqual(byType('path')[0].points.length, 3)
  const auto = byType('section')[0]
  assert.strictEqual(auto.turn, 'auto')
  assert.strictEqual(auto.detect, 10)
  assert.strictEqual(auto.forget, 10)
  assert.strictEqual(auto.fromTop, true)
  assert.strictEqual(auto.sync, 0)
  assert.strictEqual(byType('aura')[0].damage, 2)
  assert.strictEqual(byType('aura')[0].hideAura, true)
  assert.strictEqual(tank.stats.maxHealth, 500)
  assert.strictEqual(tank.color, 0x112233)
  assert.ok(tank.changed.some(c => c.includes('unknown parts')), tank.changed.join())
  assert.strictEqual(tank.render.length, 4)
})

test('a missing outline width means the default and 0 means none', () => {
  const tank = tankCode.load({ render: [polygon(), polygon({ fixedLineWidth: 0 }), polygon({ fixedLineWidth: 3 })] })
  assert.deepStrictEqual(tank.render.map(n => n.lineWidth), [-1, 0, 3])
})

test('only spinning and auto sections with firing barrels are synced', () => {
  const tank = tankCode.load({
    render: [
      section('constant', [barrel(0)]),
      section('constant', [barrel(0, { data: { visualOnly: 1 } })]),
      section('mouse', [barrel(0)]),
      section('fixed', [section('auto', [barrel(5)])])
    ]
  })
  const sections = tank.render.filter(n => n.t === 'section')
  assert.strictEqual(sections[0].sync, 0)
  assert.strictEqual(sections[1].sync, undefined)
  assert.strictEqual(sections[2].sync, undefined)
  assert.strictEqual(sections[3].sync, undefined)
  assert.strictEqual(sections[3].children[0].sync, 1)
  assert.strictEqual(tank.counts.synced, 2)
  assert.deepStrictEqual(tank.shots.map(s => s.kind), ['bullet', 'bullet', 'drone'])
})

test('barrels after the body are drawn just under it', () => {
  const tank = tankCode.load({
    render: [
      barrel(0, { x: 1 }),
      polygon({ occlude: 'scenexeBaseBase' }),
      barrel(0, { x: 2 }),
      polygon({ polygonData: { sides: 0, size: 1, x: 3 } }),
      { type: 'path', reverseOrder: true, joints: [{ type: 'moveTo', x: 0, y: 0 }, { type: 'lineTo', x: 1, y: 1 }] }
    ]
  })
  assert.deepStrictEqual(tank.render.map(n => n.t + (n.x || 0)), ['path0', 'barrel1', 'barrel2', 'polygon0', 'polygon3'])
})

test('firing barrels past the limit are kept as drawings', () => {
  const many = []
  for(let i = 0; i < tankCode.LIMITS.firing + 5; i++) { many.push(barrel(0)) }
  const tank = tankCode.load({ render: many })
  assert.strictEqual(tank.counts.firing, tankCode.LIMITS.firing)
  assert.strictEqual(tank.render.filter(n => n.visual).length, 5)
  assert.ok(tank.changed.some(c => c.includes('firing barrels past')), tank.changed.join())
})

test('deep nesting and huge part counts are cut off', () => {
  let deep = [polygon()]
  for(let i = 0; i < tankCode.LIMITS.depth + 3; i++) { deep = [section('fixed', deep)] }
  const nested = tankCode.load({ render: deep })
  assert.ok(nested.changed.some(c => c.includes('nested deeper')), nested.changed.join())
  const flood = []
  for(let i = 0; i < tankCode.LIMITS.nodes + 50; i++) { flood.push(polygon()) }
  const big = tankCode.load({ render: flood })
  assert.strictEqual(big.counts.parts, tankCode.LIMITS.nodes)
  assert.ok(big.changed.some(c => c.includes('parts past')), big.changed.join())
})

test('drones per barrel and odd numbers are clamped', () => {
  const tank = tankCode.load({ render: [barrel(5, { maxDrones: 500, x: 1e9, data: { reload: -3, bulletTime: 'x' } })] })
  const b = tank.render[0]
  assert.strictEqual(b.maxDrones, tankCode.LIMITS.dronesPerBarrel)
  assert.strictEqual(b.x, 100)
  assert.strictEqual(b.reload, 0.05)
  assert.strictEqual(b.time, 2)
})

test('bullet looks are shared and never fire', () => {
  const look = { render: [polygon(), barrel(0), { type: 'scenexe-aura', auraSize: 2, auraDamage: 1 }] }
  const tank = tankCode.load({ render: [barrel(3, { data: { bulletCode: look } }), barrel(5, { data: { bulletCode: look } })] })
  assert.strictEqual(tank.counts.looks, 1)
  assert.deepStrictEqual(tank.shots.map(s => s.look), [0, 0])
  assert.ok(tank.looks[0].filter(n => n.t === 'barrel').every(n => n.visual))
  assert.strictEqual(tank.counts.firing, 2)
})

test('the client copy has no gameplay numbers', () => {
  const tank = tankCode.load(realCode())
  const sent = JSON.parse(JSON.stringify(tankCode.forClient(tank)))
  const hidden = { barrel: ['reload', 'damage', 'health', 'speed', 'time', 'maxDrones'], section: ['detect', 'forget'], aura: ['damage', 'steal'] }
  const walk = function(list) {
    for(const n of list) {
      for(const k of hidden[n.t] || []) { assert.ok(!(k in n), `${n.t} still has ${k}`) }
      if(n.children) { walk(n.children) }
    }
  }
  walk(sent.render)
  sent.looks.forEach(walk)
  assert.strictEqual(sent.shots.length, 92)
  assert.ok(sent.render.length > 0)
})

test('the folder loader skips bad files and object keys', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tank-codes-'))
  const log = console.log
  try {
    fs.writeFileSync(path.join(dir, 'Good.txt'), encode({ name: 'Good', render: [polygon()] }))
    fs.writeFileSync(path.join(dir, 'broken.txt'), 'nonsense')
    fs.writeFileSync(path.join(dir, 'ignored.json'), '{}')
    const lines = []
    console.log = line => lines.push(line)
    const codes = tankCode.folder(dir)
    console.log = log
    assert.deepStrictEqual(Object.keys(codes), ['good'])
    assert.strictEqual(JSON.parse(codes.good.json).name, 'Good')
    assert.ok(lines.some(l => l.includes('broken could not load')), lines.join())
    assert.strictEqual(codes.constructor, undefined)
    assert.strictEqual(codes.__proto__, undefined)
    assert.deepStrictEqual(Object.keys(tankCode.folder(path.join(dir, 'missing'))), [])
  } finally {
    console.log = log
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('every code file becomes a body and weapon', () => {
  const tankData = require(path.join(root, 'tankData/index.js')).load()
  const body = tankData.bodies['code:unknow-remaster']
  assert.ok(body, 'no code:unknow-remaster body')
  assert.strictEqual(body.code, 'unknow-remaster')
  assert.strictEqual(body.name, 'Unknow remaster ( fix )')
  assert.strictEqual(body.maxHealth, 10)
  assert.ok(tankData.weapons['code:unknow-remaster'])
  assert.strictEqual(tankData.bodies['boss:unknow'].code, 'unknow-remaster')
  const codes = tankCode.folder(path.join(root, 'tankData/codes'))
  for(const k in tankData.bodies) {
    if(tankData.bodies[k].code) { assert.ok(tankData.bodies[k].code in codes, k) }
  }
})
