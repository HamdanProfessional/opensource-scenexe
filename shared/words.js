const fs = require('fs')
const path = require('path')

const FILE = path.join(__dirname, '..', 'banned-words.txt')
const LEET = { '0': 'o', '1': 'i', '!': 'i', '|': 'i', '3': 'e', '4': 'a', '@': 'a', '5': 's', '$': 's', '7': 't', '+': 't', '8': 'b', '9': 'g' }

let words = [], anywhere = [], loadedAt = 0, mtime = 0

const squash = function(s) {
  return s.replace(/(.)\1+/g, '$1')
}
const load = function() {
  const now = Date.now()
  if(now - loadedAt < 30000 && loadedAt) { return }
  loadedAt = now
  try {
    const st = fs.statSync(FILE)
    if(st.mtimeMs === mtime) { return }
    mtime = st.mtimeMs
    const lines = fs.readFileSync(FILE, 'utf8').split(/\r?\n/).map(l => l.trim().toLowerCase()).filter(l => l && l[0] !== '#')
    words = []
    anywhere = []
    for(const l of lines) {
      if(l[0] === '*') {
        const w = squash(l.slice(1).replace(/[^a-z]/g, ''))
        if(w) { anywhere.push(w) }
      } else {
        const w = l.replace(/[^a-z]/g, '')
        if(w) { words.push(w, squash(w)) }
      }
    }
  } catch(e) {
    words = []
    anywhere = []
  }
}

const EMOJI = /[\p{Extended_Pictographic}\p{Regional_Indicator}\u{1F3FB}-\u{1F3FF}\u{FE00}-\u{FE0F}\u{E0020}-\u{E007F}‍⃣]/gu
const stripEmoji = function(s) {
  return String(s || '').replace(EMOJI, '').replace(/\s+/g, ' ').trim()
}

const normalize = function(s) {
  let out = ''
  for(const c of String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')) { out += LEET[c] || c }
  return out
}

const findBad = function(s) {
  load()
  if(!words.length && !anywhere.length) { return [] }
  const n = normalize(s)
  const found = []
  const tokens = n.match(/[a-z]+/g) || []
  for(const t of tokens) {
    if(words.indexOf(t) >= 0 || words.indexOf(squash(t)) >= 0) { found.push(t) }
  }
  const parts = n.split(/\s+/).map(p => p.replace(/[^a-z]/g, '')).filter(p => p)
  const merged = []
  for(let i = 0; i < parts.length; i++) {
    if(parts[i].length === 1 && merged.length && merged[merged.length - 1].single) {
      merged[merged.length - 1].text += parts[i]
    } else {
      merged.push({ text: parts[i], single: parts[i].length === 1 })
    }
  }
  for(const m of merged) {
    const flat = squash(m.text)
    for(const w of anywhere) {
      if(flat.includes(w)) { found.push(w) }
    }
  }
  return found
}

const isBad = function(s) {
  return findBad(s).length > 0
}

const mask = function(s) {
  load()
  if(!words.length && !anywhere.length) { return s }
  return String(s).replace(/[^\s]+/g, function(part) {
    return isBad(part) ? '*'.repeat(part.length) : part
  })
}

const cleanName = function(s) {
  const name = stripEmoji(s)
  if(isBad(name)) { return { name: '', bad: true } }
  return { name: name, bad: false }
}

const SPAM_WINDOW = 30000, SPAM_MUTE = 15000, SPAM_STRIKES = 3

const spam = function(state, message, now) {
  if(state.muteUntil > now) {
    return { error: `You are muted for spamming. Try again in ${Math.ceil((state.muteUntil - now) / 1000)}s.` }
  }
  const text = String(message).replace(/(.)\1{3,}/gu, '$1$1$1')
  const key = text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '')
  const recent = state.recent || (state.recent = [])
  while(recent.length && now - recent[0][1] > SPAM_WINDOW) { recent.shift() }
  let error = false
  if(key && recent.some(r => r[0] === key)) {
    error = 'You already said that.'
  } else {
    const list = text.toLowerCase().split(/\s+/).map(w => w.replace(/[^\p{L}\p{N}]+/gu, '')).filter(w => w)
    if(list.length >= 4) {
      const count = {}
      let most = 0
      for(const w of list) { count[w] = (count[w] || 0) + 1; if(count[w] > most) { most = count[w] } }
      if(most / list.length >= 0.6) { error = 'Too much repetition in that message.' }
    }
  }
  if(error) {
    state.strikes = (state.strikes || []).filter(t => now - t < SPAM_WINDOW)
    state.strikes.push(now)
    if(state.strikes.length >= SPAM_STRIKES) {
      state.strikes = []
      state.muteUntil = now + SPAM_MUTE
      error = `Muted for ${SPAM_MUTE / 1000} seconds for spamming.`
    }
    return { error: error }
  }
  recent.push([key, now])
  if(recent.length > 5) { recent.shift() }
  return { message: text }
}

module.exports = { stripEmoji, isBad, findBad, mask, cleanName, spam }
