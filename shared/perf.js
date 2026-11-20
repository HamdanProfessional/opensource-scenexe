const TICK_BUDGET = 1000 / 60

const mb = function(bytes) {
  return Math.round((bytes || 0) / 1048576) + ' MB'
}

const ms = function(value) {
  return (value >= 10 ? Math.round(value) : Math.round((value || 0) * 10) / 10) + ' ms'
}

const uptime = function(seconds) {
  seconds = Math.max(0, Math.floor(seconds || 0))
  const d = Math.floor(seconds / 86400), h = Math.floor(seconds / 3600) % 24, m = Math.floor(seconds / 60) % 60
  if(d) { return `${d}d${h}h` }
  if(h) { return `${h}h${m}m` }
  return `${m}m`
}

const dimRow = function(name, s, label) {
  s = s || []
  return {
    name: name,
    label: label || name,
    players: s[0] || 0,
    tps: s[1] || 0,
    tanks: s[5] || 0,
    bullets: s[6] || 0,
    shapes: s[7] || 0,
    avg: s[8] || 0,
    peak: s[9] || 0,
    net: s[10] || 0,
    top: Array.isArray(s[11]) ? s[11] : [],
    paused: s[12] === true || !(s[1] > 0)
  }
}

const slow = function(d) {
  return !d.paused && (d.tps < 50 || d.peak > TICK_BUDGET || d.avg > TICK_BUDGET / 2)
}

const lines = function(report) {
  const out = []
  let players = 0
  const paused = []
  const busy = []
  for(const w of report.workers) {
    for(const d of w.dims) {
      players += d.players
      if(d.paused) { paused.push(d.label) } else { busy.push([w, d]) }
    }
  }
  out.push(`Server: ${players} player${players === 1 ? '' : 's'}, CPU ${Math.round(report.cpu || 0)}% of a core, memory ${mb(report.rss)}, up ${uptime(report.uptime)}`)
  busy.sort((a, b) => b[1].avg - a[1].avg)
  for(const [w, d] of busy) {
    let line = `${slow(d) ? 'SLOW ' : ''}${d.label}: ${d.tps} tps, tick ${ms(d.avg)} (peak ${ms(d.peak)}, network ${ms(d.net)}), ${d.tanks} tanks, ${d.bullets} bullets, ${d.shapes} shapes`
    if(d.top.length && d.top[0][1] >= 20) { line += `, most bullets: ${d.top.map(t => `${t[0]} ${t[1]}`).join(', ')}` }
    out.push(line)
  }
  for(const w of report.workers) {
    if(w.loopMax > 100 || w.loopP99 > TICK_BUDGET) {
      out.push(`Worker ${w.type} is stalling: event loop delay ${ms(w.loopP99)} (99%), worst ${ms(w.loopMax)}, heap ${mb(w.heap)}`)
    }
  }
  if(paused.length) { out.push(`Paused with nobody in them: ${paused.join(', ')}`) }
  return out
}

module.exports = { lines, dimRow, slow, uptime, TICK_BUDGET }
