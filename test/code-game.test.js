const test = require('node:test')
const assert = require('node:assert')
const { tankCode, realCode, renderer, engine, wait } = require('./helpers.js')

const errors = []
process.on('uncaughtException', e => errors.push(String(e && e.stack || e)))

const game = engine(9600 + Math.floor(Math.random() * 300))
const { ffa, dimension, commands } = game
let admin, player, me, other, boss

const say = async function(ws, text) {
  ws.clearNotes()
  ws.chat(text)
  await wait(1200)
  return ws.notes().join(' | ')
}

const clearAround = function(x, y, keep) {
  for(const t of ffa.tanks) {
    if(keep.indexOf(t) < 0 && Math.abs(t.x - x) < 6000 && Math.abs(t.y - y) < 6000) { t.x = x - 40000 }
  }
}

test.before(async () => {
  await wait(1500)
  admin = game.client(611, 'Admin', 'admin')
  player = game.client(612, 'Plain', 'player')
  admin.join()
  player.join()
  await wait(600)
  me = ffa.tanks.find(t => t.name === 'Admin')
  other = ffa.tanks.find(t => t.name === 'Plain')
  assert.ok(me && other, 'test players did not join')
})

test('the boss spawns with its barrels and synced turrets', async () => {
  me.x = 0; me.y = 0
  commands.spawnBoss(me, admin, 'unknow', [0, 900])
  await wait(300)
  boss = ffa.tanks.find(t => t.body === 'boss:unknow')
  assert.ok(boss, 'no boss')
  assert.ok(boss.codeState, 'no code state')
  assert.strictEqual(boss.codeState.barrels.length, 92)
  assert.strictEqual(boss._barrels.length, 92)
  assert.strictEqual(boss._turrets.length, 13)
  assert.strictEqual(boss.codeState.auras.length, 1)
  assert.strictEqual(boss.codeState.barrels.filter(b => b.auras.length).length, 11)
})

test('players see the whole drawing before it reaches the screen edge', async () => {
  await wait(100)
  assert.ok(boss.viewObject.size >= boss.size * boss.codeState.reach, `${boss.viewObject.size} < ${boss.size * boss.codeState.reach}`)
})

test('it fires within the projectile limits and aims at the player', async () => {
  const state = boss.codeState
  const peak = { bullets: 0, drones: 0, traps: 0 }
  for(let i = 0; i < 20; i++) {
    clearAround(0, 900, [boss, me, other])
    other.x = 30000
    me.health = me.maxHealth
    me.invincible = false
    me.x = 0; me.y = 0
    await wait(250)
    const mine = Object.values(boss.bullets)
    peak.bullets = Math.max(peak.bullets, mine.filter(b => b.type === 0).length)
    peak.drones = Math.max(peak.drones, mine.filter(b => b.type === 2).length)
    peak.traps = Math.max(peak.traps, mine.filter(b => b.type === 1).length)
    for(const b of state.barrels) { assert.ok(b.barrel.bullets.length <= tankCode.LIMITS.bulletsPerBarrel, 'a barrel passed its bullet limit') }
  }
  assert.ok(peak.bullets > 0, JSON.stringify(peak))
  assert.ok(peak.drones > 0 && peak.drones <= 10 * tankCode.LIMITS.dronesPerBarrel, JSON.stringify(peak))
  const autos = state.sections.filter(s => s.node.turn === 'auto')
  assert.strictEqual(autos.length, 5)
  assert.ok(autos.every(s => s.target === me), autos.map(s => s.target && s.target.name).join())
})

test('server barrels sit exactly where the client draws them', async () => {
  const state = boss.codeState
  const holders = state.barrels.map((b, i) => ({ fire: i, x: b.barrel.turret.gameX, y: b.barrel.turret.gameY, d: b.barrel.turret.d }))
  const snap = { x: boss.x, y: boss.y, d: boss.d, size: boss.size, time: state.time, turrets: boss._turrets.map(t => t.d) }
  const r = renderer({ 'unknow-remaster': JSON.stringify(tankCode.forClient(tankCode.load(realCode()))) })
  await r.load('unknow-remaster')
  const seen = {}
  const fires = new Map()
  const order = []
  const flat = function(list) { for(const n of list) { order.push(n); if(n.children) { flat(n.children) } } }
  flat(tankCode.load(realCode()).render)
  const items = r.render.codeTanks['unknow-remaster'].main.items
  let next = 0
  for(let i = 0; i < items.length; i++) { if(order[i].t === 'barrel' && !order[i].visual) { fires.set(items[i].node, next++) } }
  const original = r.render.drawCodeBarrel
  r.render.drawCodeBarrel = function(node, k) {
    if(fires.has(node)) {
      const m = r.matrix(), s = Math.sin(node.d), c = Math.cos(node.d)
      const bx = (node.x * c - node.y * s) * k, by = (node.x * s + node.y * c) * k
      seen[fires.get(node)] = { x: m[0] * bx + m[2] * by + m[4], y: m[1] * bx + m[3] * by + m[5], d: Math.atan2(m[1] * c + m[3] * s, m[0] * c + m[2] * s) - Math.PI / 2 }
    }
    return original.apply(r.render, arguments)
  }
  const turretData = {}
  snap.turrets.forEach((d, i) => { turretData[i] = { _d: d } })
  r.render.now = snap.time * 1000
  r.ctx.setTransform(1, 0, 0, 1, snap.x, snap.y)
  r.ctx.rotate(snap.d)
  r.render.drawCodeTank({ code: 'unknow-remaster', size: snap.size, d: snap.d, turretData, _turrets: [], _barrels: [] })
  const wrap = a => Math.atan2(Math.sin(a), Math.cos(a))
  assert.strictEqual(Object.keys(seen).length, 92)
  for(const h of holders) {
    const c = seen[h.fire]
    assert.ok(Math.hypot(c.x - h.x, c.y - h.y) < 0.5, `barrel ${h.fire} is ${Math.hypot(c.x - h.x, c.y - h.y).toFixed(1)} away`)
    assert.ok(Math.abs(wrap(c.d - h.d)) < 0.01, `barrel ${h.fire} is off by ${wrap(c.d - h.d).toFixed(3)} radians`)
  }
})

test('the hidden aura hurts tanks inside it and heals the boss', async () => {
  const aura = boss.codeState.auras[0]
  const reach = aura.node.size * aura.k * boss.size
  boss.ai = function() { boss.firing = false; boss.input.movement = [0, 0] }
  for(const b of Object.values(boss.bullets)) { b.remove() }
  let hits = 0
  const real = other.damage
  other.damage = function(amount, source) { if(source === boss) { hits ++ } return real.apply(this, arguments) }
  boss.health = boss.maxHealth * 0.5
  const low = boss.health
  for(let i = 0; i < 10; i++) {
    clearAround(boss.x, boss.y, [boss, other])
    other.invincible = false
    other.health = other.maxHealth
    other.x = boss.x + reach * 0.7
    other.y = boss.y
    await wait(50)
  }
  other.damage = real
  assert.ok(hits > 0, 'the aura never hit')
  assert.ok(boss.health > low, 'the boss did not heal')
  boss.remove()
})

test('/tankcode lists the codes', async () => {
  const notes = await say(admin, '/tankcode')
  assert.ok(notes.includes('Tank codes: unknow-remaster'), notes)
})

test('/tankcode refuses a code that does not exist', async () => {
  const notes = await say(admin, '/tankcode nothing-like-this')
  assert.ok(notes.includes('There is no single tank code'), notes)
  assert.notStrictEqual(me.body, 'code:unknow-remaster')
})

test('/tankcode turns you into the code and you can fire it', async () => {
  const notes = await say(admin, '/tankcode unknow')
  assert.ok(notes.includes('Now Unknow remaster'), notes)
  assert.strictEqual(me.body, 'code:unknow-remaster')
  assert.strictEqual(me.weapon, 'code:unknow-remaster')
  assert.strictEqual(me.codeState.barrels.length, 92)
  assert.strictEqual(me.maxHealthMultiplier, 10)
  let most = 0
  for(let i = 0; i < 20; i++) {
    me.firing = true
    me.invincible = true
    me.mousePosition = [me.x + 500, me.y]
    await wait(50)
    most = Math.max(most, Object.keys(me.bullets).length)
  }
  assert.ok(most > 0, 'nothing was fired')
})

test('/tankcode is for admins only', async () => {
  await say(player, '/tankcode unknow')
  assert.notStrictEqual(other.body, 'code:unknow-remaster')
})

test('/tankcode can change another tank', async () => {
  await say(admin, '/tankcode Plain unknow-remaster')
  assert.strictEqual(other.body, 'code:unknow-remaster')
  assert.ok(other.codeState)
})

test('leaving a code removes its barrels', async () => {
  await say(admin, '/body base')
  assert.strictEqual(me.body, 'base')
  assert.strictEqual(me.codeState, null)
  assert.ok(me._barrels.length <= 1, String(me._barrels.length))
})

test('nothing threw while the tests ran', () => {
  assert.deepStrictEqual(errors, [])
})
