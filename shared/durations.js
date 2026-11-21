let UNITS = { s: 1000, m: 60000, h: 3600000, d: 86400000, w: 604800000 }
let WORDS = { sec: 's', min: 'm', hr: 'h', hour: 'h', day: 'd', week: 'w' }
let LONGEST = 3650 * UNITS.d

function parse(text) {
  let s = String(text == null ? '' : text).trim().toLowerCase()
  if(s === 'perm' || s === 'permanent') { return 0 }
  let match = /^(\d+(?:\.\d+)?) ?([a-z]+)$/.exec(s)
  if(!match) { return null }
  let word = match[2]
  let unit = UNITS[word] ? word : WORDS[word.replace(/s$/, '')]
  if(!unit) { return null }
  let ms = Math.round(parseFloat(match[1]) * UNITS[unit])
  return ms >= 1000 && ms <= LONGEST ? ms : null
}

function format(ms) {
  let seconds = Math.max(0, Math.round(ms / 1000))
  if(seconds === 0) { return '0s' }
  let parts = []
  let sizes = [['d', 86400], ['h', 3600], ['m', 60], ['s', 1]]
  for(let i=0;i<sizes.length && parts.length < 2;i++) {
    if(seconds >= sizes[i][1]) {
      parts.push(Math.floor(seconds / sizes[i][1]) + sizes[i][0])
      seconds %= sizes[i][1]
    }
  }
  return parts.join(' ')
}

function span(ms) {
  return ms ? `for ${format(ms)}` : 'permanently'
}

module.exports = { parse, format, span }
