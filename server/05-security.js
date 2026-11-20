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

let fetchBanned = function() {
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

const net = require('net')

const cleanIp = function(ip) {
  ip = String(ip || '').trim()
  if(ip.startsWith('::ffff:') && net.isIPv4(ip.slice(7))) { ip = ip.slice(7) }
  return ip
}

const proxyRanges = (function() {
  const list = new net.BlockList()
  const add = function(cidr) {
    const [address, bits] = cidr.split('/')
    const type = net.isIPv6(address) ? 'ipv6' : 'ipv4'
    try { list.addSubnet(address, Number(bits), type) } catch(e) {}
  }
  const local = ['127.0.0.0/8', '10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', '::1/128', 'fc00::/7']
  const cloudflare = [
    '173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22', '141.101.64.0/18', '108.162.192.0/18',
    '190.93.240.0/20', '188.114.96.0/20', '197.234.240.0/22', '198.41.128.0/17', '162.158.0.0/15', '104.16.0.0/13',
    '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22',
    '2400:cb00::/32', '2606:4700::/32', '2803:f800::/32', '2405:b500::/32', '2405:8100::/32', '2a06:98c0::/29', '2c0f:f248::/32'
  ]
  const extra = Array.isArray(config.trustedProxies) ? config.trustedProxies : []
  for(const cidr of local.concat(cloudflare, extra)) { add(String(cidr).includes('/') ? String(cidr) : String(cidr) + (net.isIPv6(String(cidr)) ? '/128' : '/32')) }
  return list
})()

const isTrustedProxy = function(ip) {
  if(!net.isIP(ip)) { return false }
  return proxyRanges.check(ip, net.isIPv6(ip) ? 'ipv6' : 'ipv4')
}

const getIp = function(req) {
  const peer = cleanIp(req.socket.remoteAddress)
  if(!isTrustedProxy(peer)) { return peer }
  const forwarded = cleanIp(String(req.headers['cf-connecting-ip'] || String(req.headers['x-forwarded-for'] || '').split(',')[0] || ''))
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

let attackmode = 0, interactions = {}

setInterval(function() {
  const cutoff = performance.now() - 60000
  for(const ip in interactions) {
    const list = interactions[ip].filter(function(t) { return t >= cutoff })
    if(list.length) { interactions[ip] = list } else { delete interactions[ip] }
  }
}, 60000)

let filter = {
  requests: [],
  perIpLimit: 240,
  add: function(ip) {
    const now = performance.now()
    const mine = interactions[ip] || (interactions[ip] = [])
    mine.push(now)
    while(mine.length && mine[0] < now - 60000) { mine.shift() }
    if(mine.length > filter.perIpLimit && typeof anticheat !== 'undefined' && anticheat.ban(ip, 'flooding the website with ' + mine.length + ' requests a minute')) {
      delete interactions[ip]
    }
    const arr = filter.requests
    arr.push(now)
    while(arr.length && arr[0] < now - 60000) { arr.shift() }
    if(arr.length > 600 && attackmode <= now) {
      attackmode = now + 120000
      console.log('Attack Mode', arr.length)
      discordBot.send('spam', `Attack mode on: ${arr.length} requests in a minute, connections now need harder proof of work`)
      discordBot.send('gameStatus', 'Attack mode on, the server is getting flooded with connections')
    } else if(arr.length > 600) {
      attackmode = Math.max(attackmode, now + 30000)
    }
  }
}
