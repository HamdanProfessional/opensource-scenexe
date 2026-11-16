const main = function(tankData, args) {
  process.on('uncaughtException', function(e) {
    console.log(e)
  })

  let sendAchievement = function(tank, t) {
    if(tank && tank.ws && tank.ws.accountName && !tank.dim.sandbox) {
      args.parentPort.postMessage(['achievement', [tank.ws.accountName, t]])
    }
  }

  const gameEnd = function(tank) {
    if(tank.ws && tank.ws.accountName && tank.ws.accountData && tank.ws.timeStart > 0 && !tank.dim.sandbox) {
      let time = Math.floor((_performance.now() - tank.ws.timeStart) / 1000)
      tank.ws.accountData.timeAlive += time
      tank.ws.accountData.score = tank.rScore
	    if(tank.rScore >= 1) {
		    let c = Math.log(tank.rScore)
		    c = c * c / 10 - 18
		    if(c > 0) { tank.ws.accountData.stars += c }
	    }
	    tank.ws.accountData.stars *= tank.ws.accountData.timeAlive * 1.2 / (tank.ws.accountData.timeAlive + 100)
      args.parentPort.postMessage(['gameEnd', [tank.ws.accountName, tank.ws.accountData, tank.rScore]])
      let d = tank.ws.accountData
	    tank.ws.accountName = false
      tank.ws.accountData = false
	    return d
    }
  }

  const app = function(req, res) {
    const p = url.parse(req.url)
	  const pathname = p.pathname
    switch(pathname) {
      case '/tankData.json':

        res.setHeader('Access-Control-Allow-Origin', '*')
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON_tankData);
        break;
      default:
        res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        res.end('Open-Scenexe game server');
        break;
    }
  }

  const httpServer = (secret.key && secret.cert) ? http.createServer({
    key: fs.readFileSync(secret.key),
    cert: fs.readFileSync(secret.cert)
  }, app) : http.createServer(app)

  if(args.port >= 0) {
    if(args.standalone) {
      httpServer.listen(args.port)
    } else {
      httpServer.listen(args.port, '127.0.0.1')
    }
  } else {
    httpServer.listen()
  }

  const server = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (request, socket, head) => {
    let allow = true
    let h = {}
    for(let p in request.headers) {
      if(p.startsWith('openscenexe')) {
        h[p] = request.headers[p]
      }
    }
    const parsed = url.parse(request.url)
    const params = Object.fromEntries(new url.URLSearchParams(parsed.query))
    const pathname = parsed.pathname;
    let s = true, p
    if(pathname.startsWith('/ws-')) {
      p = pathname.slice(4)
      if(p.length === 6) {
        let j = 0
        for(let i=0;i<5;i++) {
          let q = '0123456789abcdef'.indexOf(p[i])
          if(q < 0) {
            s = false
            break
          }
          j += q
        }
        if('0123456789abcdef'.indexOf(p[5]) !== j % 16) {
          s = false
        }
      } else {
        s = false
      }
    } else {
      s = false
    } if(s) {
      for(let i=clients.length-1;i>=0;i--) {
        let ws = clients[i]
        if(ws.joinToken === p) {
          ws.joinToken = false
          try { ws.terminate() } catch(e) {}
        }
      }
    }
    if(s) {
      server.handleUpgrade(request, socket, head, (ws) => {
        ws._headers = h
        if(!allow) {
          ws.failedHeaderCheck = true
        } else {
          ws.joinToken = p
        }
        server.emit('connection', ws);
      });
    } else {
      socket.destroy();
    }
  });

  const JSON_tankData = JSON.stringify(tankData)

