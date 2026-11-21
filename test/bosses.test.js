const test = require('node:test')
const assert = require('node:assert')
const { engine, wait } = require('./helpers.js')

let game, ffa, admin, player, me

const say = async function(ws, text) {
  ws.clearNotes()
  ws.chat(text)
  await wait(1200)
  return ws.notes().join(' | ')
}

const bosses = function() {
  return ffa.tanks.filter(t => t.boss === true)
}

test('every boss has its own name', () => {
  const tankData = require('../tankData/index.js').load()
  const seen = {}
  for(const id in tankData.bodies) {
    const boss = tankData.bodies[id].boss
    if(!boss) { continue }
    assert.ok(!seen[boss.name], `${boss.name} is used by both ${seen[boss.name]} and ${id}`)
    seen[boss.name] = id
  }
})

test.before(async () => {
  game = engine(9500 + Math.floor(Math.random() * 90))
  ffa = game.ffa
  await wait(1500)
  admin = game.client(811, 'Admin', 'admin')
  player = game.client(812, 'Plain', 'player')
  admin.join()
  player.join()
  await wait(600)
  me = ffa.tanks.find(t => t.name === 'Admin')
  assert.ok(me, 'test admin did not join')
  for(const t of bosses()) { t.remove() }
})

test('/boss takes a two word name', async () => {
  const notes = await say(admin, '/boss frost titan')
  assert.ok(notes.includes('Spawned Frost Titan.'), notes)
  assert.strictEqual(bosses().length, 1)
})

test('/boss takes a count and a position', async () => {
  const notes = await say(admin, '/boss bronze warlord 2 500 600')
  assert.ok(notes.includes('Spawned Bronze Warlord x2.'), notes)
  assert.strictEqual(bosses().filter(t => t.body === 'boss:bronze4').length, 2)
})

test('/boss takes a title, a rank, a family or an id', async () => {
  let notes = await say(admin, '/boss colossus')
  assert.match(notes, /Spawned [A-Z][a-z]+ Colossus\./)
  notes = await say(admin, '/boss rank0 2')
  assert.match(notes, /Spawned .*Scout/)
  assert.doesNotMatch(notes, /Warden|Overlord|Titan|Colossus/)
  notes = await say(admin, '/boss magma')
  assert.match(notes, /Spawned Magma \w+\./)
  notes = await say(admin, '/boss jade3')
  assert.ok(notes.includes('Spawned Jade Titan.'), notes)
})

test('/boss explains bad input', async () => {
  let notes = await say(admin, '/boss nothinglikethis')
  assert.ok(notes.includes("There is no boss called 'nothinglikethis'"), notes)
  notes = await say(admin, '/boss frost 50')
  assert.ok(notes.includes('Count must be 1 to 10.'), notes)
  notes = await say(admin, '/boss frost 1 2 3 4')
  assert.ok(notes.includes('Usage: /boss'), notes)
})

test('/bosses lists the families, and one family in detail', async () => {
  let notes = await say(admin, '/bosses')
  assert.ok(notes.includes('Bronze: Scout, Warden, Overlord, Warlord, Titan, Colossus'), notes)
  notes = await say(admin, '/bosses thorn')
  assert.ok(notes.includes('Thorn bosses:'), notes)
  assert.ok(notes.includes('Thorn Warlord (thorn4), rank 2, 65x health'), notes)
  notes = await say(admin, '/bosses nope')
  assert.ok(notes.includes("There is no boss family called 'nope'"), notes)
})

test('/bosses here lists the live ones and /remove bosses clears them', async () => {
  const count = bosses().length
  assert.ok(count >= 6, String(count))
  let notes = await say(admin, '/bosses here')
  assert.ok(notes.includes(`Bosses alive here: ${count}.`), notes)
  await say(admin, '/remove bosses')
  assert.strictEqual(bosses().length, 0)
  assert.ok(ffa.tanks.includes(me), 'the admin was removed too')
  notes = await say(admin, '/bosses here')
  assert.ok(notes.includes('No bosses are alive in this dimension.'), notes)
})

test('players cannot use the boss commands', async () => {
  let notes = await say(player, '/bosses')
  assert.ok(notes.includes("You can't use /bosses."), notes)
  assert.ok(!notes.includes('Bronze:'), notes)
  notes = await say(player, '/boss frost')
  assert.ok(notes.includes("You can't use /boss."), notes)
  assert.strictEqual(bosses().length, 0)
})

test('/bosses survives names that exist on every object', async () => {
  let notes = await say(admin, '/bosses constructor')
  assert.ok(notes.includes("There is no boss family called 'constructor'"), notes)
  notes = await say(admin, '/bosses __proto__')
  assert.ok(notes.includes("There is no boss family called '__proto__'"), notes)
})
