const test = require('node:test')
const assert = require('node:assert')
const { tankCode, encode, realCode, barrel, section, polygon, renderer } = require('./helpers.js')

const real = JSON.stringify(tankCode.forClient(tankCode.load(realCode())))
const pointer = JSON.stringify(tankCode.forClient(tankCode.load({ name: 'Pointer', render: [polygon({ polygonData: { sides: 0, size: 0.2 } }), barrel(0, { w: 0.1, h: 1 })] })))
const looked = JSON.stringify(tankCode.forClient(tankCode.load({ name: 'Looked', render: [polygon(), barrel(3, { data: { bulletCode: { render: [polygon({ polygonData: { sides: 4, size: 1 } })] } } })] })))

const fade = function(r) {
  r.render.scaleFade = function(f) {
    const alpha = f <= 1 ? f : 2 - f
    r.ctx.globalAlpha = alpha < 1 ? alpha * r.render.drawAlpha : r.render.drawAlpha
  }
}

const drawOnce = function(r, tank, at) {
  r.ops.length = 0
  r.ctx.setTransform(1, 0, 0, 1, at, at)
  r.ctx.rotate(tank.d)
  const before = r.matrix()
  const drawn = r.render.drawCodeTank(tank, { r: 56, g: 56, b: 56 })
  return { drawn, before, after: r.matrix(), box: r.bounds(r.ops) }
}

test('waits for the code, then draws it', async () => {
  const r = renderer({ 'unknow-remaster': real })
  const tank = { code: 'unknow-remaster', size: 60, d: 0 }
  assert.strictEqual(r.render.drawCodeTank(tank), false)
  await r.load('unknow-remaster')
  const once = drawOnce(r, tank, 500)
  assert.strictEqual(once.drawn, true)
  assert.ok(r.ops.length > 1000, String(r.ops.length))
})

test('an unknown code is never drawn', async () => {
  const r = renderer({})
  const tank = { code: 'missing', size: 60, d: 0 }
  await r.load('missing')
  assert.strictEqual(r.render.drawCodeTank(tank), false)
  assert.strictEqual(r.ops.length, 0)
})

test('the drawing stays inside its reach and the canvas is restored', async () => {
  const r = renderer({ 'unknow-remaster': real })
  await r.load('unknow-remaster')
  const tank = { code: 'unknow-remaster', size: 60, d: 0.7 }
  const once = drawOnce(r, tank, 500)
  const limit = r.render.codeTanks['unknow-remaster'].reach * tank.size + 10
  for(const v of [once.box.minX, once.box.minY, once.box.maxX, once.box.maxY]) {
    assert.ok(Math.abs(v - 500) <= limit, `${v - 500} is past ${limit}`)
  }
  assert.ok(once.box.maxX - once.box.minX > limit, 'drawing is much smaller than its reach')
  assert.deepStrictEqual(once.after, once.before)
})

test('the barrel points where the tank faces', async () => {
  const r = renderer({ pointer: pointer })
  await r.load('pointer')
  const facing = function(d) {
    const once = drawOnce(r, { code: 'pointer', size: 50, d: d }, 0)
    const far = r.ops.flatMap(o => o.points).reduce((a, p) => Math.hypot(p[0], p[1]) > Math.hypot(a[0], a[1]) ? p : a, [0, 0])
    return [far[0] / Math.hypot(far[0], far[1]), far[1] / Math.hypot(far[0], far[1])]
  }
  for(const d of [0, Math.PI / 2, 2]) {
    const v = facing(d)
    assert.ok(Math.abs(v[0] + Math.sin(d)) < 0.1 && Math.abs(v[1] - Math.cos(d)) < 0.1, `d ${d} drew toward ${v}`)
  }
})

test('spinning parts move over time', async () => {
  const r = renderer({ 'unknow-remaster': real })
  await r.load('unknow-remaster')
  const tank = { code: 'unknow-remaster', size: 60, d: 0 }
  r.render.now = 0
  drawOnce(r, tank, 500)
  const first = JSON.stringify(r.ops)
  drawOnce(r, tank, 500)
  assert.strictEqual(JSON.stringify(r.ops), first)
  r.render.now = 4000
  drawOnce(r, tank, 500)
  assert.notStrictEqual(JSON.stringify(r.ops), first)
})

test('shots are found after the normal barrels and drawn with their look', async () => {
  const r = renderer({ looked: looked })
  await r.load('looked')
  fade(r)
  const tank = { code: 'looked', size: 40, d: 0, _barrels: [{}, {}] }
  assert.strictEqual(r.render.codeShot(tank, 1), null)
  const shot = r.render.codeShot(tank, 2)
  assert.strictEqual(shot.kind, 'custom')
  assert.strictEqual(shot.look, 0)
  assert.strictEqual(r.render.codeShot({ size: 40 }, 2), null)
  r.ops.length = 0
  r.ctx.setTransform(1, 0, 0, 1, 0, 0)
  const before = r.matrix()
  assert.strictEqual(r.render.drawCodeBullet({ code: 'looked', codeLook: 0, x: 100, y: 50, d: 0, size: 10, fadeTime: 1 }), true)
  assert.ok(r.ops.length > 0)
  const box = r.bounds(r.ops)
  assert.ok(box.minX >= 85 && box.maxX <= 115 && box.minY >= 35 && box.maxY <= 65, JSON.stringify(box))
  assert.deepStrictEqual(r.matrix(), before)
  assert.strictEqual(r.render.drawCodeBullet({ code: 'looked', codeLook: 5, x: 0, y: 0, d: 0, size: 10 }), false)
})

test('a full frame of the boss draws quickly', async () => {
  const r = renderer({ 'unknow-remaster': real })
  await r.load('unknow-remaster')
  const tank = { code: 'unknow-remaster', size: 60, d: 0 }
  drawOnce(r, tank, 500)
  const start = process.hrtime.bigint()
  for(let i = 0; i < 20; i++) { drawOnce(r, tank, 500) }
  const ms = Number(process.hrtime.bigint() - start) / 1e6 / 20
  assert.ok(ms < 50, `${ms.toFixed(1)} ms per frame`)
})

test('sections draw by layer', async () => {
  const code = JSON.stringify(tankCode.forClient(tankCode.load({
    render: [section('fixed', [polygon({ polygonData: { sides: 0, size: 1, x: 5 } })], { layer: 2 }), section('fixed', [polygon({ polygonData: { sides: 0, size: 1, x: -5 } })], { layer: 1 })]
  })))
  const r = renderer({ layered: code })
  await r.load('layered')
  drawOnce(r, { code: 'layered', size: 10, d: -Math.PI / 2 }, 0)
  const fills = r.ops.filter(o => o.op === 'fill').map(o => Math.sign(r.bounds([o]).minX + r.bounds([o]).maxX))
  assert.deepStrictEqual(fills, [-1, 1])
})

test('a code made by encode() round trips to the same drawing', async () => {
  const text = encode({ name: 'Round', render: [polygon(), barrel(0)] })
  const fromText = JSON.stringify(tankCode.forClient(tankCode.load(text)))
  const fromObject = JSON.stringify(tankCode.forClient(tankCode.load({ name: 'Round', render: [polygon(), barrel(0)] })))
  assert.strictEqual(fromText, fromObject)
})
