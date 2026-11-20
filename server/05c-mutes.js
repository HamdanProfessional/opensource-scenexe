const mutes = (function() {
  const file = './mutes.json'
  let list = []
  try {
    const saved = JSON.parse(fs.readFileSync(file).toString())
    if(Array.isArray(saved)) { list = saved }
  } catch(e) {
    if(e.code !== 'ENOENT') { console.log('mutes.json:', e.message) }
  }

  const active = function(mute, now) {
    return !mute.until || mute.until > now
  }

  const save = function() {
    const now = Date.now()
    list = list.filter(m => active(m, now))
    try {
      fs.writeFileSync(file, JSON.stringify(list, null, 1) + '\n')
    } catch(e) {
      console.log('mutes.json: could not save:', e.message)
    }
  }

  const matches = function(mute, c) {
    if(!c) { return false }
    if(mute.ip && c._ip && mute.ip === ipGroup(c._ip)) { return true }
    return !!(mute.account && c.accountName && mute.account === String(c.accountName).toLowerCase())
  }

  const of = function(c) {
    const now = Date.now()
    return list.find(m => active(m, now) && matches(m, c)) || false
  }

  const add = function(c, ms, reason, by, name) {
    list = list.filter(m => !matches(m, c))
    const mute = {
      ip: c._ip ? ipGroup(c._ip) : '',
      account: c.accountName ? String(c.accountName).toLowerCase() : '',
      name: name || (c.data && c.data.name) || '',
      until: ms ? Date.now() + ms : 0,
      reason: reason || '',
      by: by || '',
      at: Date.now()
    }
    list.push(mute)
    save()
    return mute
  }

  const remove = function(test) {
    const gone = list.filter(test)
    if(gone.length) {
      list = list.filter(m => gone.indexOf(m) < 0)
      save()
    }
    return gone
  }

  const describe = function(mute) {
    const time = mute.until ? `for ${durations.format(mute.until - Date.now())}` : 'permanently'
    return `You are muted ${time}${mute.reason ? ': ' + mute.reason : ''}.`
  }

  return {
    of: of,
    add: add,
    remove: remove,
    matches: matches,
    describe: describe,
    list: function() {
      const now = Date.now()
      return list.filter(m => active(m, now))
    }
  }
})()
