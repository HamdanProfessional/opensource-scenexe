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

  const blocked = (function() {
    const list = new net.BlockList()
    const ranges = [
      ['0.0.0.0', 8, 'ipv4'], ['10.0.0.0', 8, 'ipv4'], ['100.64.0.0', 10, 'ipv4'], ['127.0.0.0', 8, 'ipv4'], ['169.254.0.0', 16, 'ipv4'],
      ['172.16.0.0', 12, 'ipv4'], ['192.0.0.0', 24, 'ipv4'], ['192.168.0.0', 16, 'ipv4'], ['198.18.0.0', 15, 'ipv4'], ['224.0.0.0', 3, 'ipv4'],
      ['::', 128, 'ipv6'], ['::1', 128, 'ipv6'], ['fc00::', 7, 'ipv6'], ['fe80::', 10, 'ipv6'], ['ff00::', 8, 'ipv6'], ['::ffff:0:0', 96, 'ipv6']
    ]
    for(const r of ranges) { list.addSubnet(r[0], r[1], r[2]) }
    return list
  })()

  const publicAddress = async function(host) {
    const found = await require('dns').promises.lookup(host, { all: true })
    if(!found.length) { throw new Error('no address') }
    for(const f of found) {
      if(blocked.check(f.address, f.family === 6 ? 'ipv6' : 'ipv4')) { throw new Error('private address') }
    }
    return found[0]
  }

  const getJson = function(target, host, port) {
    return new Promise(function(resolve, reject) {
      const request = http.get({
        host: target.address,
        family: target.family,
        port: port,
        path: '/serverinfo',
        timeout: 4000,
        headers: { 'Host': port === 80 ? host : `${host}:${port}`, 'User-Agent': 'open-scenexe-server-list' }
      }, function(response) {
        let body = ''
        response.setEncoding('utf8')
        response.on('data', function(chunk) {
          body += chunk
          if(body.length > 4096) { request.destroy(new Error('too large')) }
        })
        response.on('end', function() {
          try { resolve(JSON.parse(body)) } catch(e) { reject(e) }
        })
      })
      request.on('timeout', function() { request.destroy(new Error('timeout')) })
      request.on('error', reject)
    })
  }

  const verify = async function(address) {
    const [host, portText] = address.split(':')
    const port = portText ? Number(portText) : 80
    if(!(port > 0 && port < 65536)) { throw new Error('bad port') }
    const target = await publicAddress(host)
    const data = await getJson(target, host, port)
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
