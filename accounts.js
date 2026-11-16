const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const FILE = path.join(__dirname, 'accounts.json')

const SHA256 = function(s) {
  return crypto.createHash('sha256').update(String(s)).digest('hex')
}

let store = {}
try {
  store = JSON.parse(fs.readFileSync(FILE).toString()) || {}
} catch(e) {
  if(e.code !== 'ENOENT') { console.log('accounts: could not read accounts.json', e.message) }
  store = {}
}

let saveTimer = false
const flush = function() {
  saveTimer = false
  try {
    const tmp = FILE + '.tmp'
    fs.writeFileSync(tmp, JSON.stringify(store))
    fs.renameSync(tmp, FILE)
  } catch(e) {
    console.log('accounts: could not save accounts.json', e.message)
  }
}
const scheduleSave = function() {
  if(!saveTimer) { saveTimer = setTimeout(flush, 2000) }
}
const flushNow = function() {
  if(saveTimer) { clearTimeout(saveTimer) }
  flush()
}
process.on('exit', function() { if(saveTimer) { flushNow() } })
for(const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(sig, function() {
    if(saveTimer) { flushNow() }
    process.exit(0)
  })
}

const normalize = function(a) {
  const now = Math.floor(Date.now() / 1000)
  const defaults = {
    description: '', maxScore: 0, stars: 0, ascensions: 0, crossroads: 0, abyss: 0,
    celestialKills: 0, tankKills: 0, polygonKills: 0, radiantPolygonKills: 0,
    timePlayed: 0, lastOnline: now, join: now
  }
  for(const k in defaults) {
    if(typeof a[k] !== typeof defaults[k]) { a[k] = defaults[k] }
  }
  if(!Array.isArray(a.achievements)) { a.achievements = [] }
  if(!Array.isArray(a.gallery)) { a.gallery = [] }
  return a
}

const wrap = function(a) {
  return {
    success: true,
    account: a,
    save: scheduleSave
  }
}

const validUsername = function(u) {
  return typeof u === 'string' && u.length > 0 && u.length <= 30 && /^[\x21-\x7e]+$/.test(u)
}

const Accounts = {
  fromUsername: function(username) {
    return new Promise(function(resolve) {
      const u = typeof username === 'string' ? username.toLowerCase() : ''
      const a = store[u]
      if(!a) { return resolve({ success: false, message: 'Account not found' }) }
      resolve(wrap(normalize(a)))
    })
  },
  create: function(o) {
    return new Promise(function(resolve) {
      const u = typeof o.username === 'string' ? o.username.toLowerCase() : ''
      if(!validUsername(u)) { return resolve({ success: false, message: 'Invalid username' }) }
      if(typeof o.password !== 'string' || o.password.length <= 0 || o.password.length > 30) {
        return resolve({ success: false, message: 'Invalid password' })
      }
      if(store[u]) { return resolve({ success: false, message: 'That username is taken' }) }
      const a = normalize({ username: u, password: SHA256(o.password) })
      store[u] = a
      flushNow()
      resolve({ success: true, account: wrap(a) })
    })
  },
  readUsername: function(a) {
    return a.username
  },
  toObject: function(a) {
    return {
      username: a.username,
      description: a.description || '',
      maxScore: a.maxScore || 0,
      stars: a.stars || 0,
      ascentions: a.ascensions || 0,
      crossroads: a.crossroads || 0,
      abyss: a.abyss || 0,
      celestialKills: a.celestialKills || 0,
      tankKills: a.tankKills || 0,
      polygonKills: a.polygonKills || 0,
      radiantPolygonKills: a.radiantPolygonKills || 0,
      timePlayed: a.timePlayed || 0,
      lastOnline: a.lastOnline || 0,
      join: a.join || 0,
      achievements: (a.achievements || []).slice(0),
      gallery: (a.gallery || []).slice(0)
    }
  },
  getLastOnline: function(clients, a) {
    for(let i=clients.length-1;i>=0;i--) {
      if(clients[i].accountName === a.username) {
        return Math.floor(Date.now() / 1000) + 1
      }
    }
    return a.lastOnline || 0
  },
  top: function(q, max) {
    const key = Object.keys(q)[0], dir = q[key]
    const list = Object.values(store).map(normalize)
    list.sort(function(a, b) { return dir < 0 ? (b[key] || 0) - (a[key] || 0) : (a[key] || 0) - (b[key] || 0) })
    return list.slice(0, Math.min(max, 100))
  }
}

const achievementList = require('./shared/achievements.js')

const achievements = {
  list: achievementList,
  toObject: function(arr) {
    const o = {}
    if(Array.isArray(arr)) {
      for(let i=0;i<arr.length;i++) {
        if(arr[i] && arr[i].id >= 0) { o[arr[i].id] = arr[i] }
      }
    }
    return o
  }
}

const createAchievement = function(id, time) {
  return { id: id, time: time > 0 ? time : Math.floor(Date.now() / 1000) }
}

const updateGallery = function(gallery, sides, radiant) {
  if(!(sides === ~~sides && radiant === ~~radiant && radiant >= 0 && radiant <= 20)) { return false }
  if(!((sides <= -1 && sides >= -5) || (sides >= 3 && sides <= 17))) { return false }
  const index = sides < 0 ? -sides - 1 : sides + 2
  const m = 1 << radiant
  const i = gallery[index] || 0
  if(i & m) { return false }
  while(gallery.length < index) { gallery.push(0) }
  gallery[index] = i | m
  return true
}

module.exports = { Accounts, achievements, SHA256, createAchievement, updateGallery }
