const serverList = (function() {
  const settings = Object.assign({ name: '', address: '', hub: 'http://144.91.117.163:22440' }, config.serverList || {})
  const hub = String(settings.hub || '').replace(/\/+$/, '')
  const listed = {}
  const announceTimes = {}
  let cache = null, cacheTime = 0

  const validAddress = function(address) {
    return typeof address === 'string' && /^[a-z0-9.-]{1,100}(:\d{1,5})?$/i.test(address)
  }
  const cleanServerName = function(name) {
    return words.cleanName(String(name || '').replace(/[\u0000-\u001f]/g, '').slice(0, 40)).name.trim() || 'Unnamed server'
  }
  const totalPlayers = function() {
    let total = 0
    try {
      const counts = playerCount()
      for(const k in counts) { total += counts[k] }
    } catch(e) {}
    return total
  }

  const info = function() {
    return { game: 'open-scenexe', name: settings.name ? cleanServerName(settings.name) : '', players: totalPlayers() }
  }

  const verify = async function(address) {
    const response = await fetch(`http://${address}/serverinfo`, { signal: AbortSignal.timeout(4000), headers: { 'User-Agent': 'open-scenexe-server-list' } })
    const data = await response.json()
    if(!data || data.game !== 'open-scenexe') { throw new Error('not an Open-Scenexe server') }
    return data
  }

  const announce = async function(ip, params) {
    const now = Date.now()
    announceTimes[ip] = (announceTimes[ip] || []).filter(function(t) { return now - t < 60000 })
    if(announceTimes[ip].length >= 3) { return { ok: false, error: 'too many announcements, wait a minute' } }
    announceTimes[ip].push(now)
    const address = String(params.address || '').toLowerCase()
    if(!validAddress(address)) { return { ok: false, error: 'address must look like 1.2.3.4:22440 or play.example.com' } }
    if(!listed[address] && Object.keys(listed).length >= 50) { return { ok: false, error: 'the server list is full' } }
    let data
    try {
      data = await verify(address)
    } catch(e) {
      return { ok: false, error: `could not reach http://${address}/serverinfo from the list server` }
    }
    listed[address] = {
      name: cleanServerName(data.name),
      address: address,
      players: Math.max(0, Math.min(9999, data.players | 0)),
      seen: now
    }
    return { ok: true }
  }

  const ownEntry = function(host) {
    return { name: settings.name ? cleanServerName(settings.name) : 'Official server', address: validAddress(host) ? host.toLowerCase() : '', players: totalPlayers(), official: !settings.name }
  }

  const local = function(host) {
    const now = Date.now()
    for(const address in listed) {
      if(now - listed[address].seen > 180000) { delete listed[address] }
    }
    const servers = Object.values(listed).map(function(s) {
      return { name: s.name, address: s.address, players: s.players }
    }).sort(function(a, b) { return b.players - a.players })
    return [ownEntry(host)].concat(servers.filter(function(s) { return s.address !== host }))
  }

  const list = async function(host, direct) {
    if(direct || !hub) { return local(host) }
    const now = Date.now()
    if(cache && now - cacheTime < 20000) { return cache }
    try {
      const response = await fetch(`${hub}/servers?direct=1`, { signal: AbortSignal.timeout(4000), headers: { 'User-Agent': 'open-scenexe-server-list' } })
      const data = await response.json()
      if(!Array.isArray(data)) { throw new Error('bad list') }
      cache = data.filter(function(s) { return s && validAddress(s.address) }).slice(0, 60).map(function(s) {
        return { name: cleanServerName(s.name), address: String(s.address).toLowerCase(), players: Math.max(0, s.players | 0), official: !!s.official }
      })
      cacheTime = now
      return cache
    } catch(e) {
      return local(host)
    }
  }

  let lastAnnounceResult = ''
  const announceSelf = async function() {
    let result
    try {
      const response = await fetch(`${hub}/announce?address=${encodeURIComponent(settings.address)}`, { signal: AbortSignal.timeout(10000), headers: { 'User-Agent': 'open-scenexe-server-list' } })
      const data = await response.json()
      result = data.ok ? `listed on ${hub} as ${settings.address}` : `not listed: ${data.error}`
    } catch(e) {
      result = `not listed: could not reach ${hub}`
    }
    if(result !== lastAnnounceResult) {
      lastAnnounceResult = result
      console.log(`server list: ${result}`)
    }
  }
  if(settings.name && settings.address && hub) {
    if(!validAddress(settings.address)) {
      console.log('server list: serverList.address in config.json must look like 1.2.3.4:22440 or play.example.com')
    } else {
      setTimeout(announceSelf, 10000)
      setInterval(announceSelf, 60000)
    }
  }

  return { info, announce, list }
})()
