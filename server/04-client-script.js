const mscript = function(s) {
  for(let p in game.codes.receive) {
    let i = parseInt(p)
    if(i >= 0 || i <= 0) { continue }
    s = s.replaceAll(`RCODE_${p}`, game.codes.receive[p])
  }
  for(let p in game.codes.send) {
    let i = parseInt(p)
    if(i >= 0 || i <= 0) { continue }
    s = s.replaceAll(`SCODE_${p}`, game.codes.send[p])
  }
  return `!function(){${s.replace('JSON_tankData', JSON_tankData).replace('JSON_achievements', () => JSON_achievements)}}();`
}

const mhtml = function(s) {
  let style = fs.readFileSync('./style.css').toString()
  s = s.replace('<style></style>', `<style>${style}</style>`)
  s = s.replace('<script></script>', '<script src="/script.js"></script>')
  return s
}

const JSON_tankData = JSON.stringify(tankData)
const JSON_achievements = JSON.stringify(require('./shared/achievements.js'))

const clientSource = function() { return require('./lib/parts.js').join(require('path').join(__dirname, 'client')) }

let scriptCache = false
const getScript = function() {
  if(debug) { return mscript(clientSource()) }
  return scriptCache || (scriptCache = mscript(clientSource()))
}

const ticket = (function() {
  const crypto = require('crypto')
  const key = crypto.randomBytes(32)
  const bits = Math.max(0, Math.min(24, envNum('POW_BITS') ?? config.powBits ?? 16))
  const used = new Map()
  const sign = function(body, ip) {
    return crypto.createHmac('sha256', key).update(body + '|' + ip).digest('base64url').slice(0, 22)
  }
  const zeroBits = function(buf) {
    let n = 0
    for(const b of buf) {
      if(b === 0) { n += 8; continue }
      return n + Math.clz32(b) - 24
    }
    return n
  }
  setInterval(function() {
    const now = Date.now()
    for(const [t, exp] of used) { if(exp < now) { used.delete(t) } }
  }, 30000)
  return {
    issue: function(ip) {
      const body = `${Date.now() + 60000}.${crypto.randomBytes(9).toString('base64url')}.${bits}`
      return body + '.' + sign(body, ip)
    },
    check: function(t, nonce, ip) {
      if(typeof t !== 'string' || typeof nonce !== 'string' || t.length > 120 || nonce.length > 16) { return false }
      const p = t.split('.')
      if(p.length !== 4) { return false }
      const want = Buffer.from(sign(p.slice(0, 3).join('.'), ip)), got = Buffer.from(p[3])
      if(want.length !== got.length || !crypto.timingSafeEqual(want, got)) { return false }
      const exp = Number(p[0])
      if(!(exp > Date.now()) || used.has(t)) { return false }
      if(zeroBits(crypto.createHash('sha256').update(t + ':' + nonce).digest()) < Number(p[2])) { return false }
      used.set(t, exp)
      return true
    }
  }
})()
