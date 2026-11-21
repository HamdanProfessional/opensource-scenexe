const test = require('node:test')
const assert = require('node:assert')
const perf = require('../shared/perf.js')
const { engine, wait } = require('./helpers.js')

const report = function(dims, extra) {
  return Object.assign({ uptime: 7500, rss: 400 * 1048576, cpu: 23.4, workers: [{ type: 'ffa', heap: 80 * 1048576, loopP99: 2, loopMax: 9, dims: dims }] }, extra || {})
}

const stats = function(extra) {
  return Object.assign({ players: 0, tps: 60, tanks: 0, bullets: 0, shapes: 0, avg: 0, peak: 0, net: 0, top: [], paused: false }, extra)
}

test('a dimension row fills in what the worker left out', () => {
  const row = perf.dimRow('ffa', stats({ players: 3, tanks: 40, bullets: 300, shapes: 500, avg: 1.3, peak: 3.8, net: 0.4, top: [['Bob', 120]] }), 'Free For All')
  assert.deepStrictEqual(row, { name: 'ffa', label: 'Free For All', players: 3, tps: 60, tanks: 40, bullets: 300, shapes: 500, avg: 1.3, peak: 3.8, net: 0.4, top: [['Bob', 120]], paused: false })
  assert.strictEqual(perf.dimRow('old', { players: 2, tps: 60 }).paused, false)
  assert.strictEqual(perf.dimRow('empty', { tps: 0 }).paused, true)
  assert.strictEqual(perf.dimRow('missing').players, 0)
})

test('the summary covers the server and each busy dimension', () => {
  const out = perf.lines(report([
    perf.dimRow('ffa', stats({ players: 3, tanks: 40, bullets: 300, shapes: 500, avg: 1.3, peak: 3.8, net: 0.4, top: [['Bob', 120], ['Ann', 40]] })),
    perf.dimRow('2teams', stats({ players: 1, tanks: 10, bullets: 5, shapes: 100, avg: 0.5, peak: 1, net: 0.1, top: [['Tiny', 5]] })),
    perf.dimRow('void', stats({ tps: 0, paused: true }), 'The Void')
  ]))
  assert.strictEqual(out[0], 'Server: 4 players, CPU 23% of a core, memory 400 MB, up 2h5m')
  assert.strictEqual(out[1], 'ffa: 60 tps, tick 1.3 ms (peak 3.8 ms, network 0.4 ms), 40 tanks, 300 bullets, 500 shapes, most bullets: Bob 120, Ann 40')
  assert.strictEqual(out[2], '2teams: 60 tps, tick 0.5 ms (peak 1 ms, network 0.1 ms), 10 tanks, 5 bullets, 100 shapes')
  assert.strictEqual(out[3], 'Paused with nobody in them: The Void')
  assert.strictEqual(out.length, 4)
})

test('slow dimensions and stalling workers are called out', () => {
  const busy = perf.dimRow('ffa', stats({ players: 9, tps: 41, tanks: 80, bullets: 2000, shapes: 500, avg: 12, peak: 45, net: 3 }))
  const out = perf.lines(report([busy], { workers: [{ type: 'ffa', heap: 0, loopP99: 30, loopMax: 250, dims: [busy] }] }))
  assert.ok(out[1].startsWith('SLOW ffa: 41 tps, tick 12 ms (peak 45 ms'), out[1])
  assert.ok(out.some(l => l.startsWith('Worker ffa is stalling: event loop delay 30 ms (99%), worst 250 ms')), out.join('\n'))
  assert.strictEqual(perf.slow(perf.dimRow('ok', stats({ players: 1, avg: 2, peak: 10 }))), false)
})

test('uptime reads naturally', () => {
  assert.strictEqual(perf.uptime(59), '0m')
  assert.strictEqual(perf.uptime(3600 * 5 + 60 * 7), '5h7m')
  assert.strictEqual(perf.uptime(86400 * 2 + 3600 * 3), '2d3h')
})

test('the engine reports tick times and /perf asks the server', async () => {
  const game = engine(9900 + Math.floor(Math.random() * 90))
  await wait(1500)
  const mod = game.client(711, 'Moddy', 'mod')
  const plain = game.client(712, 'Plain', 'player')
  mod.join()
  plain.join()
  await wait(3500)
  const stats = game.posted.filter(m => m[0] === 'dimStats').pop()
  assert.ok(stats, 'no dimStats were sent')
  const ffa = stats[1].ffa
  assert.ok(ffa.avg > 0 && ffa.peak >= ffa.avg * 0.5 && ffa.net >= 0, JSON.stringify(ffa))
  assert.ok(ffa.players >= 2 && ffa.tps > 0 && Array.isArray(ffa.top) && ffa.paused === false, JSON.stringify(ffa))
  assert.ok(stats[2].heap > 0 && stats[2].loopP99 >= 0 && stats[2].loopMax >= 0, JSON.stringify(stats[2]))
  game.posted.length = 0
  mod.chat('/perf')
  plain.chat('/perf')
  await wait(1200)
  const asked = game.posted.filter(m => m[0] === 'perf')
  assert.strictEqual(asked.length, 1, JSON.stringify(asked))
  assert.strictEqual(asked[0][1][0], 711)
})

test('durations read plain times and refuse the rest', () => {
  const durations = require('../shared/durations.js')
  assert.strictEqual(durations.parse('perm'), 0)
  assert.strictEqual(durations.parse('30m'), 30 * 60000)
  assert.strictEqual(durations.parse('2 hours'), 2 * 3600000)
  for(const bad of ['7dd', '5', '20000d', 'soon', '']) { assert.strictEqual(durations.parse(bad), null, bad) }
  assert.strictEqual(durations.format(90061000), '1d 1h')
})
