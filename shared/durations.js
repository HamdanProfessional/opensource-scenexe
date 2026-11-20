const UNITS = { s: 1000, m: 60000, h: 3600000, d: 86400000, w: 604800000 }
const NAMES = {
  sec: 's', secs: 's', second: 's', seconds: 's',
  min: 'm', mins: 'm', minute: 'm', minutes: 'm',
  hr: 'h', hrs: 'h', hour: 'h', hours: 'h',
  day: 'd', days: 'd',
  week: 'w', weeks: 'w'
}
const FOREVER = ['perm', 'permanent', 'forever', 'never']
const LONGEST = 3650 * UNITS.d

const parse = function(text) {
  const s = String(text == null ? '' : text).trim().toLowerCase().replace(/\s+/g, ' ')
  if(FOREVER.indexOf(s) >= 0) { return 0 }
  const match = /^(\d+(?:\.\d+)?) ?([a-z]*)$/.exec(s)
  if(!match) { return null }
  const unit = match[2] === '' ? 'm' : UNITS[match[2]] ? match[2] : NAMES[match[2]]
  if(!unit) { return null }
  const ms = Math.round(parseFloat(match[1]) * UNITS[unit])
  return ms >= 1000 && ms <= LONGEST ? ms : null
}

const format = function(ms) {
  let seconds = Math.max(0, Math.round(ms / 1000))
  if(seconds === 0) { return '0s' }
  const parts = []
  for(const [unit, size] of [['d', 86400], ['h', 3600], ['m', 60], ['s', 1]]) {
    if(seconds >= size) {
      parts.push(Math.floor(seconds / size) + unit)
      seconds %= size
    }
    if(parts.length === 2) { break }
  }
  return parts.join(' ')
}

module.exports = { parse, format }
