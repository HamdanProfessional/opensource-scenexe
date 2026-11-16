let banned = {}
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

let fetchBanned = function() {
  try {
    let nbanned = {}
    for(const line of readBans()) {
      nbanned[line.split(' ')[0]] = true
    }
    banned = nbanned
    for(let i=clients.length-1;i>=0;i--) {
      let c = clients[i]
      if(banned[c._ip] === true) {
        c.sendPacket('flag', 'banned')
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
      console.log('too many per second:', lastSecond, ip)
      return true
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

const getIp = function(req) {
  let ip = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress).split(',')[0].trim();
  if(ip.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '')
  }
  return ip
}

let attackmode = 0, lastTrigger = -60000, cleanInteractions = function() {
  let cutoff = performance.now() - 1000
  for(let i in interactions) {
    let t = interactions[i]
    if(t < cutoff) {
      delete interactions[i]
    }
  }
}

setInterval(cleanInteractions, 60000)

let filter = {
  requests: [],
  add: function() {
    let now = performance.now()
    let arr = filter.requests
    arr.push(now)
    let l = arr.length, i = 0
    if(l > 300 && attackmode - now < 110000) {
      setTimeout(function() {
        console.log('Attack Mode', l)
        discordBot.send('spam', `Attack mode on: ${l} connection requests in a short time`)
        discordBot.send('gameStatus', 'Attack mode on, the server is getting flooded with connections')
        attackmode = now + 120000
        if(now - lastTrigger > 20000) {
          lastTrigger = now
          console.log('Cloudflare bans triggered')
          cleanInteractions()
          let ips = []
          cloudflare.read()
          for(let ip in interactions) {
            let r = cloudflare.addSusIp(ip)
            if(r > 0) {
              console.log('Suspicious ip', ip, r)
              if(r >= 3) {
                console.log('Cloudflare ban', ip, r)
                discordBot.send('spam', `Cloudflare ban for ${discordBot.code(ip)}`)
                ips.push(ip)
              }
            }
          }
          cloudflare.write()
          if(ips.length > 0) {
            console.log('Cloudflare banning', ips)
            cloudflare.addIps(ips)
          }
        }
      }, 1000)
    }
    for(i=0;i<l;i++) {
      if(arr[i] >= now - 60000) {
        break
      }
    }
    arr.splice(0, i)
  }
}

