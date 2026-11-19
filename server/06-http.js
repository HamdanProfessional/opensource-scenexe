const accountToObject = function(a) {
	let o = Accounts.toObject(a)
	o.lastOnline = Accounts.getLastOnline(clients, a)
	return o
}



const zlib = require('zlib')
const compressible = /^(text\/|application\/(javascript|json)|image\/svg)/
const compressResponse = function(req, res) {
  const accept = String(req.headers['accept-encoding'] || '')
  const encoding = /\bbr\b/.test(accept) ? 'br' : /\bgzip\b/.test(accept) ? 'gzip' : false
  if(!encoding) { return }
  const writeHead = res.writeHead, end = res.end
  let status = 200, headers = {}
  res.writeHead = function(s, h) {
    status = s
    if(h && typeof h === 'object') { headers = Object.assign(headers, h) }
    return res
  }
  res.end = function(body, cb) {
    if(typeof body === 'function') { cb = body; body = undefined }
    const type = String(headers['Content-Type'] || headers['content-type'] || res.getHeader('content-type') || '')
    const buf = body === undefined || body === null ? Buffer.alloc(0) : Buffer.isBuffer(body) ? body : Buffer.from(String(body))
    const finish = function(data, enc) {
      if(enc) {
        headers['Content-Encoding'] = enc
        headers['Vary'] = 'Accept-Encoding'
      }
      headers['Content-Length'] = data.length
      writeHead.call(res, status, headers)
      end.call(res, data, cb)
    }
    if(buf.length < 1024 || !compressible.test(type) || res.headersSent) {
      if(res.headersSent) { return end.call(res, body, cb) }
      return finish(buf, false)
    }
    const done = function(err, out) {
      if(err || out.length >= buf.length) { return finish(buf, false) }
      finish(out, encoding)
    }
    if(encoding === 'br') {
      zlib.brotliCompress(buf, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5, [zlib.constants.BROTLI_PARAM_SIZE_HINT]: buf.length } }, done)
    } else {
      zlib.gzip(buf, { level: 6 }, done)
    }
    return res
  }
}

const tickets = {
  seen: {},
  take: function(ip) {
    const now = performance.now()
    const key = ipGroup(ip)
    const list = (tickets.seen[key] || []).filter(function(t) { return t > now - 60000 })
    list.push(now)
    tickets.seen[key] = list
    return list.length > 30
  }
}

setInterval(function() {
  const cutoff = performance.now() - 60000
  for(const key in tickets.seen) {
    if(!tickets.seen[key].some(function(t) { return t > cutoff })) { delete tickets.seen[key] }
  }
}, 60000)

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()'
}

const app = function(req, res) {
  for(const name in securityHeaders) { res.setHeader(name, securityHeaders[name]) }
  compressResponse(req, res)
  const parsedUrl = url.parse(req.url)
  let params = {}
  let now = performance.now()
  if(now > attackmode) {
    attackmode = 0
  }
  if(!req.headers.host) {
    fail = 1
  } else {
      try {
      let u = new URL(`https://${req.headers.host}`)
      if(req.headers.host.indexOf('.') < 0) {
        fail = 4
      }
    } catch(e) {
      fail = 2
    }
  }
  try {
    params = Object.fromEntries(new URLSearchParams(parsedUrl.query))
  } catch(e) {
    fail = 3
  } if(!req.headers['user-agent']) {
    fail = 5
  }
  let ip = getIp(req)
  let blank = function() {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('');
  }
  const pathname = parsedUrl.pathname;

  let serveRequest = function() {
    filter.add(ip)
    switch (pathname) {
      case '/':
        if(limit.load(ip, 0, res)) { return }
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(mhtml(fs.readFileSync('./index.html').toString()));
        break;
      case '/script2':
        if(debug !== 1) { return blank() }
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(mhtml(fs.readFileSync('./index.html').toString()));
        break;
      case '/privacy-policy':
        if(attackmode) { return blank() }
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(fs.readFileSync('./privacy-policy.html').toString());
        break;
      case '/terms-of-service':
        if(attackmode) { return blank() }
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(fs.readFileSync('./terms-of-service.html').toString());
        break;
      case '/script.js':
        res.writeHead(200, {'Content-Type': 'application/javascript', 'Cache-Control': 'no-cache'});
        res.end(getScript());
        break;
      case '/ticket':
        if(tickets.take(ip)) {
          res.writeHead(429, {'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*', 'Retry-After': '5'});
          res.end('{}');
          return
        }
        res.writeHead(200, {'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*'});
        res.end(JSON.stringify({ t: ticket.issue(ip) }));
        break;
      case '/blank':
        return blank()
      case '/logo.svg':
      case '/favicon.ico':
        res.writeHead(200, {'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400'});
        res.end(cachedFiles.logo);
        break;
      case '/robots.txt':
        if(attackmode) { return blank() }
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(cachedFiles.robots);
        break;
      case '/changelog':
        if(attackmode) { return blank() }
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(cachedFiles.changelog);
        break;
      case '/leaderboard':
        if(attackmode) { return blank() }
        res.writeHead(200, {'Content-Type': 'text/plain'});
        leaderboard.get(params.i, params.m).then(function(a) {
          if(!a) {
            return res.end('[]')
          }
          let obj = []
          for(let i=0,l=a.length;i<l;i++) {
            let o = accountToObject(a[i])
            obj.push(o)
          }
          res.end(JSON.stringify(obj));
        })
        break;
      case '/account':
        if(attackmode) { return blank() }
        res.writeHead(200, {'Content-Type': 'text/plain'});
        let u = params.u
        if(!u || u.length <= 0 || u.length > 30) {
          return res.end('{}')
        }
        u = u.toLowerCase()
        for(let i=u.length-1;i>=0;i--) {
          if('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-=_+[]{}\\|;\':",./<>?`~'.indexOf(u[i]) < 0) {
            return res.end('{}')
          }
        }
        Accounts.fromUsername(u, true).then(function(d) {
          if(d.success) {
            res.end(JSON.stringify(accountToObject(d.account)))
          } else {
            res.end('{}')
          }
        })
        break;
      case '/playercount':
        if(attackmode) { return blank() }
        res.writeHead(200, {'Content-Type': 'text/plain'});
        if(playerCount) {
          let s = { total:0, ...playerCount() }
          let total = 0
          for(let k in s) {
            total += s[k]
          }
          s.total = total
          res.end(JSON.stringify(s))
        } else {
          res.end('{}')
        }
        break;
      case '/serverinfo':
        res.writeHead(200, {'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*'});
        res.end(JSON.stringify(serverList.info()));
        break;
      case '/servers':
        if(attackmode) { return blank() }
        serverList.list(String(req.headers.host || ''), params.direct === '1').then(function(list) {
          res.writeHead(200, {'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*'});
          res.end(JSON.stringify(list));
        });
        break;
      case '/announce':
        if(attackmode) { return blank() }
        serverList.announce(ip, params).then(function(result) {
          res.writeHead(200, {'Content-Type': 'application/json', 'Cache-Control': 'no-store'});
          res.end(JSON.stringify(result));
        });
        break;
      case '/sitemap':
        if(attackmode) { return blank() }
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(cachedFiles.sitemap);
        break;
      default:
        res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
        res.end('<script>location.href="/"</script>');
        break;
    }
    if(debug) console.log('http load:', pathname, ip)
  }
  if(debug) console.log(params)
  if(anticheat.isBanned(ip)) {
    res.writeHead(429, {'Content-Type': 'text/plain; charset=utf-8', 'Retry-After': '600'});
    res.end('Too many requests, try again later')
    return
  }
  if(banned[ip] === true) {
    if(debug) console.log('banned', pathname, ip)
    res.writeHead(403, {'Content-Type': 'text/plain; charset=utf-8'});
    res.end(`Banned! This was probably a mistake`)
    return
  }
  serveRequest()
}

const httpServer = http.createServer({

}, app)

if(args.port >= 0) {
  httpServer.listen(args.port)
} else {
  httpServer.listen()
}

