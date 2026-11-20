const test = require('node:test')
const assert = require('node:assert')
const perf = require('../shared/perf.js')
const { engine, wait } = require('./helpers.js')

const report = function(dims, extra) {
  return Object.assign({ uptime: 7500, rss: 400 * 1048576, cpu: 23.4, workers: [{ type: 'ffa', heap: 80 * 1048576, loopP99: 2, loopMax: 9, dims: dims }] }, extra || {})
}

test('a dimension row reads the worker stats in order', () => {
  const row = perf.dimRow('ffa', [3, 60, 0, 0, 900, 40, 300, 500, 1.3, 3.8, 0.4, [['Bob', 120]], false], 'Free For All')
  assert.deepStrictEqual(row, { name: 'ffa', label: 'Free For All', players: 3, tps: 60, tanks: 40, bullets: 300, shapes: 500, avg: 1.3, peak: 3.8, net: 0.4, top: [['Bob', 120]], paused: false })
  assert.strictEqual(perf.dimRow('old', [2, 60]).paused, false)
  assert.strictEqual(perf.dimRow('empty', [0, 0]).paused, true)
  assert.strictEqual(perf.dimRow('missing').players, 0)
})

test('the summary covers the server and each busy dimension', () => {
  const out = perf.lines(report([
    perf.dimRow('ffa', [3, 60, 0, 0, 0, 40, 300, 500, 1.3, 3.8, 0.4, [['Bob', 120], ['Ann', 40]], false]),
    perf.dimRow('2teams', [1, 60, 0, 0, 0, 10, 5, 100, 0.5, 1, 0.1, [['Tiny', 5]], false]),
    perf.dimRow('void', [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, [], true], 'The Void')
  ]))
  assert.strictEqual(out[0], 'Server: 4 players, CPU 23% of a core, memory 400 MB, up 2h5m')
  assert.strictEqual(out[1], 'ffa: 60 tps, tick 1.3 ms (peak 3.8 ms, network 0.4 ms), 40 tanks, 300 bullets, 500 shapes, most bullets: Bob 120, Ann 40')
  assert.strictEqual(out[2], '2teams: 60 tps, tick 0.5 ms (peak 1 ms, network 0.1 ms), 10 tanks, 5 bullets, 100 shapes')
  assert.strictEqual(out[3], 'Paused with nobody in them: The Void')
  assert.strictEqual(out.length, 4)
})

test('slow dimensions and stalling workers are called out', () => {
  const out = perf.lines(report([perf.dimRow('ffa', [9, 41, 0, 0, 0, 80, 2000, 500, 12, 45, 3, [], false])], { workers: [{ type: 'ffa', heap: 0, loopP99: 30, loopMax: 250, dims: [perf.dimRow('ffa', [9, 41, 0, 0, 0, 80, 2000, 500, 12, 45, 3, [], false])] }] }))
  assert.ok(out[1].startsWith('SLOW ffa: 41 tps, tick 12 ms (peak 45 ms'), out[1])
  assert.ok(out.some(l => l.startsWith('Worker ffa is stalling: event loop delay 30 ms (99%), worst 250 ms')), out.join('\n'))
  assert.strictEqual(perf.slow(perf.dimRow('ok', [1, 60, 0, 0, 0, 0, 0, 0, 2, 10, 0, [], false])), false)
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
  assert.strictEqual(ffa.length, 13)
  assert.ok(ffa[8] > 0 && ffa[9] >= ffa[8] * 0.5 && ffa[10] >= 0, JSON.stringify(ffa.slice(8, 11)))
  assert.ok(Array.isArray(ffa[11]))
  assert.ok(stats[2].heap > 0 && stats[2].loopP99 >= 0 && stats[2].loopMax >= 0, JSON.stringify(stats[2]))
  game.posted.length = 0
  mod.chat('/perf')
  plain.chat('/perf')
  await wait(1200)
  const asked = game.posted.filter(m => m[0] === 'perf')
  assert.strictEqual(asked.length, 1, JSON.stringify(asked))
  assert.strictEqual(asked[0][1][0], 711)
})
