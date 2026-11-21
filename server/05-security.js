const net = require('net')

let banned = {}, banDetails = {}
const bannedPath = './banned.txt'

const readBans = function() {
  try {
    return fs.readFileSync(bannedPath).toString().split('\n').map(l => l.trim()).filter(l => l.length > 0)
  } catch(e) { return [] }
}
const writeBans = function(lines) {
  fs.writeFileSync(bannedPath, lines.join('\n') + (lines.length ? '\n' : ''))
  fetchBanned()
}

const parseBan = function(line) {
  const fields = line.split('\t'), head = fields[0], space = head.indexOf(' ')
  const until = fields[1] ? Date.parse(fields[1]) : NaN
  return {
    ip: space < 0 ? head : head.slice(0, space),
    name: space < 0 ? '' : head.slice(space + 1),
    until: until > 0 ? until : 0,
    reason: fields[2] || '',
    by: fields[3] || ''
  }
}

const formatBan = function(ban) {
  const tidy = function(text, max) {
    return String(text || '').replace(/\s+/g, ' ').trim().slice(0, max)
  }
  const name = tidy(ban.name, 50)
  return [ban.ip + (name ? ' ' + name : ''), ban.until ? new Date(ban.until).toISOString() : 'never', tidy(ban.reason, 200), tidy(ban.by, 60)].join('\t')
}

const banMessage = function(ban) {
  let text = ban && ban.until ? `Banned for ${durations.format(ban.until - Date.now())}` : 'Banned'
  return ban && ban.reason ? `${text}: ${ban.reason}` : text
}

const fetchBanned = function() {
  try {
    const now = Date.now(), lines = readBans(), live = []
    let nbanned = {}, details = {}
    for(const line of lines) {
      const ban = parseBan(line)
      if(ban.until && ban.until <= now) { continue }
      live.push(line)
      nbanned[ban.ip] = true
      details[ban.ip] = ban
    }
    if(live.length < lines.length) {
      fs.writeFileSync(bannedPath, live.join('\n') + (live.length ? '\n' : ''))
    }
    banned = nbanned
    banDetails = details
    for(let i=clients.length-1;i>=0;i--) {
      let c = clients[i]
      if(banned[c._ip] === true) {
        c.sendPacket('flag', ['banned', banMessage(banDetails[c._ip])])
        c.sendPacket = function() {}
        c.send = function() {}
        c.close()
      }
    }
  } catch(e) {}
}
fetchBanned()
setInterval(fetchBanned, 30000)

setInterval(function() {
  for(let i=clients.length-1;i>=0;i--) {
    let c = clients[i]
    if(c.isAlive === false) {
      c.terminate()
      continue
    }
    c.isAlive = false
    try { c.ping() } catch(e) {}
  }
}, 30000)

let limit = {
  data: {
    0: {}
  },
  check: function(arr, time) {
    let l = arr.length, i = 0
    for(i=0;i<l;i++) {
      if(arr[i] >= time) {
        break
      }
    }
    arr.splice(0, i)
    return arr
  },
  load: function(ip, id, res) {
    let now = performance.now()
    let a = limit.data[id]
    let b = a[ip]
    if(!b || (b.expire < now && b.timeout <= 0)) {
      b = a[ip] = {
        requests: [],
        timeout: 0,
        expire: 0
      }
    }
    b.requests.push(now)
    b.expire = now + 60000
    limit.check(b.requests, now - 60000)
    let end = function(s) {
      res.writeHead(429, {'Content-Type': 'text/plain'});
      res.end(`429: Try again in ${s} seconds`)
      return true
    }
    let lastSecond = 0
    for(let i=b.requests.length-2;i>=0;i--) {
      if(b.requests[i] > now - 1000) {
        lastSecond ++
      } else {
        break
      }
    }
    if(lastSecond > 0) {
      if(debug) { console.log('too many per second:', lastSecond, ip) }
      return end(1)
    }
    if(b.requests.length >= 10) {
      if(b.timeout <= now) {
        b.timeout = now + 60000
      } else {
        b.timeout += 3000
      }
      if(b.requests.length >= 30) {
        let v = now + 300000
        if(b.timeout < v) {
          b.timeout = v
        } else {
          b.timeout += 5000
        }
      }
      return end(Math.ceil((b.timeout - now) / 1000))
    } if(b.timeout > now) {
      return end(Math.ceil((b.timeout - now) / 1000))
    }
    b.timeout = 0
    return false
  },
  remove(ip, id) {
    let a = limit.data[id]
    let b = a[ip]
    if(b && b.requests[0]) {
      b.requests.splice(0, 1)
    }
  }
}

const cleanIp = function(ip) {
  ip = String(ip || '').trim()
  if(ip.startsWith('::ffff:') && net.isIPv4(ip.slice(7))) { ip = ip.slice(7) }
  return ip
}

const proxyRanges = (function() {
  const list = new net.BlockList()
  const privateProxies = ['127.0.0.0/8', '10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', '::1/128', 'fc00::/7']
  const cloudflare = [
    '173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22', '141.101.64.0/18', '108.162.192.0/18',
    '190.93.240.0/20', '188.114.96.0/20', '197.234.240.0/22', '198.41.128.0/17', '162.158.0.0/15', '104.16.0.0/13',
    '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22',
    '2400:cb00::/32', '2606:4700::/32', '2803:f800::/32', '2405:b500::/32', '2405:8100::/32', '2a06:98c0::/29', '2c0f:f248::/32'
  ]
  const extra = Array.isArray(config.trustedProxies) ? config.trustedProxies : []
  for(const entry of privateProxies.concat(cloudflare, extra)) {
    const cidr = String(entry)
    const [address, bits] = (cidr.includes('/') ? cidr : cidr + (net.isIPv6(cidr) ? '/128' : '/32')).split('/')
    try {
      list.addSubnet(address, Number(bits), net.isIPv6(address) ? 'ipv6' : 'ipv4')
    } catch(e) {
      console.log('Ignoring bad trusted proxy "' + cidr + '"')
    }
  }
  return list
})()

const getIp = function(req) {
  const peer = cleanIp(req.socket.remoteAddress)
  if(!net.isIP(peer) || !proxyRanges.check(peer, net.isIPv6(peer) ? 'ipv6' : 'ipv4')) { return peer }
  const forwarded = cleanIp(req.headers['cf-connecting-ip'] || String(req.headers['x-forwarded-for'] || '').split(',')[0])
  return net.isIP(forwarded) ? forwarded : peer
}

const ipGroup = function(ip) {
  if(!net.isIPv6(ip)) { return ip }
  const parts = ip.split('::')
  const head = parts[0] ? parts[0].split(':') : []
  const tail = parts.length > 1 && parts[1] ? parts[1].split(':') : []
  const full = parts.length > 1 ? head.concat(new Array(8 - head.length - tail.length).fill('0'), tail) : head
  return full.slice(0, 4).map(function(p) { return (parseInt(p, 16) || 0).toString(16) }).join(':') + '::/64'
}

const hitCounter = function(windowMs) {
  const data = {}
  const list = function(key) {
    const cutoff = Date.now() - windowMs
    const hits = (data[key] || []).filter(function(t) { return t > cutoff })
    if(hits.length) { data[key] = hits } else { delete data[key] }
    return hits
  }
  setInterval(function() {
    for(const key in data) { list(key) }
  }, 60000)
  return {
    list: list,
    add: function(key) {
      const hits = list(key)
      hits.push(Date.now())
      data[key] = hits
      return hits.length
    },
    clear: function(key) {
      delete data[key]
    }
  }
}

let attackmode = 0
const floods = hitCounter(60000)

let filter = {
  requests: [],
  perIpLimit: 240,
  add: function(ip) {
    const now = performance.now()
    const key = ipGroup(ip)
    const count = floods.add(key)
    if(count > filter.perIpLimit && anticheat.ban(ip, 'flooding the website with ' + count + ' requests a minute')) {
      floods.clear(key)
    }
    const arr = filter.requests
    arr.push(now)
    while(arr.length && arr[0] < now - 60000) { arr.shift() }
    if(arr.length > 600 && attackmode <= now) {
      attackmode = now + 120000
      console.log('Attack mode on', arr.length)
      discordBot.send('spam', `Attack mode on: ${arr.length} requests a minute`)
      discordBot.send('gameStatus', 'Attack mode on, the server is getting flooded')
    }
  }
}

