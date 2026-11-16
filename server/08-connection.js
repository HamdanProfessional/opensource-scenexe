let locked = false

let uids = {}
const trafficMeter = function() {
  let sec = 0, count = 0, bytes = 0, lastCount = 0, lastBytes = 0
  const roll = function() {
    let s = Math.floor(performance.now() / 1000)
    if(s !== sec) {
      if(s === sec + 1) {
        lastCount = count
        lastBytes = bytes
      } else {
        lastCount = lastBytes = 0
      }
      sec = s
      count = bytes = 0
    }
  }
  return {
    add: function(size) {
      roll()
      count ++
      bytes += size
    },
    update: roll,
    stats: function() {
      roll()
      return [lastCount, lastBytes]
    }
  }
}
server.on("connection", (ws, request) => {
  if(debug) console.log(`Connection`, ws._ip)
  ws.isAlive = true
  ws.on('pong', function() { ws.isAlive = true })
  ws.on('message', function() { ws.isAlive = true })
  ws.data = {
    admin: false,
    open: true,
    ready: false,
    worker: false,
    name: '',
    id: generator.getId(),
    lastPing: performance.now(),
    commands: {},
    receive: trafficMeter(),
    send: trafficMeter()
  }
  const allowed = anticheat.canConnect(ws._ip)
  anticheat.attach(ws)
  clients.push(ws)
  uids[ws.data.id] = ws
  const cPacket = function(arr) {
    let l = Buffer.byteLength(arr)
    ws.data.send.add(l)
    ws.data.send.update()
    return arr
  }
  ws.sendPacket = function(type) {
    if(type in game.codes.receive && ws.send) {
      if(arguments.length > 1) {
        ws.send(cPacket(pack([game.codes.receive[type], arguments[1]])))
      } else {
        ws.send(cPacket(pack([game.codes.receive[type]])))
      }
    }
  }
  if(allowed !== true) {
    ws.anticheat.kicked = true
    ws.sendPacket('flag', allowed)
    ws.sendPacket = function() {}
    setTimeout(function() { try { ws.close() } catch(e) {} }, 50)
  }
  current.add(ws)
  let failed = false
  const connect = function(worker, name, dim, tank, accountData, accountName, mode) {
    if(ws.fsocket && ws.fsocket._ws === ws) {
      let old = ws.fsocket
      ws.fsocket = false
      try { old.close() } catch(e) {}
    }
    let port = worker.port
    ws.data.worker = worker
    if(mode !== undefined) { ws.data.joinMode = mode }
    let joinMode = ws.data.joinMode || ''
    let h = {
      'openscenexe-uid': ws.data.id,
      'openscenexe-lastteam': ws.data.lastTeam >= 0 ? ws.data.lastTeam : -1,
    }
    accountName = accountName || ws.accountNameParsed || false
    if(accountName) {
      h['openscenexe-accountname'] = accountName
      if(accountData) { h['openscenexe-accountdata'] = JSON.stringify(accountData) }
    }
    let fsocket = new WebSocket(`ws://127.0.0.1:${port}/ws-${ws.joinToken}`, {
      perMessageDeflate: false,
      headers: h
    })
    fsocket.tankName = ''
    fsocket.dim = worker.dims[dim]
    fsocket.worker = worker
    fsocket._ws = ws
    ws.fsocket = fsocket
    ws.sending = false
    ws.fsocket.addEventListener('open', function() {
      ws.data.commands = { role: commandData.role(ws.accountName || accountName) }
      if(tank) {
        ws.data.name = fsocket.tankName = tank[0].name
        fsocket.send(pack([game.codes.send.joinGame, [name, dim, [], tank, ws.data.commands, joinMode]]))
      } else {
        ws.data.name = name
        fsocket.tankName = name
        fsocket.send(pack([game.codes.send.joinGame, [name, dim, [], [false, ws.data.respawnScore], ws.data.commands, joinMode]]))
      }
    })
    ws.fsocket.addEventListener('message', function(e) {
      let _ = fsocket._ws
      if(_.fsocket === fsocket) {
        let l = Buffer.byteLength(e.data)
        _.data.send.add(l)
        _.data.send.update()
        _.send(e.data)
      }
    })
    ws.fsocket.addEventListener('close', function(e) {
      let _ = fsocket._ws
      if(_.fsocket === fsocket) {
        _.close()
      }
    })
  }
  ws.connect = connect
  ws.addEventListener('message', function(e) {
    let data, d = e.data
    try {
      data = unpack(d)
      let l = Buffer.byteLength(d)
      ws.data.receive.add(l)
      ws.data.receive.update()
    } catch(e) {
      ws.close()
      ws.sendPacket = function() {}
      return
    }
    if(!anticheat.check(ws, data, Buffer.byteLength(d))) { return }
    if(ws.data.ready) {
      let type = game.codes.send[data[0]]
      if(type === 'ping') {
        ws.data.lastPing = performance.now()
        ws.sendPacket('flag', ['pong'])
        return
      } else if(type === 'createAccount') {
        if(ws.account || ws.accountName) { return }
        console.log('attempt create username:', data[1][0])
        let u = data[1][0], p = data[1][1]
        if(typeof u === 'string' && words.isBad(u)) {
          ws.sendPacket('flag', ['login', 0, 'That username isn\'t allowed'])
          return
        }
        Accounts.create({
          username: u,
          password: p
        }).then(function(d) {
          console.log(d)
          if(d.success) {
            d.account.account.lastOnline = Math.floor(Date.now() / 1000)
            ws.sendPacket('flag', ['login', accountToObject(d.account.account)])
            console.log('Login', d.account.account.username)
            ws.account = d.account
            ws.accountName = d.account.account.username
            ws.accountNameParsed = u
          } else {
            ws.sendPacket('flag', ['login', 0, d.message || 'Could not create account'])
          }
        })
      } else if(type === 'joinGame') {
        let dim = data[1][1]
        let joinMode = data[1][2] === 'arras' ? 'arras' : ''
        for(let q in workers) {
          let w = workers[q]
          if(dim in w.dims) {
            if(!w.dims[dim][0] && !ws.data.admin) { continue }
            let finish = function(achievementList, gallery) {
              connect(w, data[1][0], dim, false, {
                timeAlive: 0,
                celestialKills: 0,
                tankKills: 0,
                polygonKills: 0,
                radiantPolygonKills: 0,
                ascended: false,
                ohNode: true,
                classic: true,
                pristine: true,
                dims: {},
                achievements: achievementList || {},
                gallery: gallery || [],
                accountNameParsed: ws.accountNameParsed,
                accountName: ws.accountName,
		            monarchTime: 0,
		            stars: 0,
              }, ws.accountNameParsed, joinMode)
            }
		  if(ws.account) {
			  finish(achievements.toObject(ws.account.account.achievements), ws.account.account.gallery)
		  } else { finish() }
            return
          }
        }
        return
      } else if(ws.fsocket && ws.fsocket.readyState === 1) {
        if(type === 'chat') {
          let str = data[1]
          if(str[0] === '/') {
            let k = str.slice(1).split(' ')
            let j = k.splice(0, 1)[0]
            k = k.join(' ')
            if(j === 'description') {
              if(ws.account) {
                    ws.account.account.description = (k || '').slice(0, 1000)
                    ws.account.save()
                    ws.sendPacket('announcement', 'Successfully set description!')
              } else {
                ws.sendPacket('announcement', 'You are not signed in!')
              }
              return
            } else if(j === 'account') {
              if(ws.accountName) {
                ws.sendPacket('announcement', 'Signed in to account: ' + ws.accountName)
              } else {
                ws.sendPacket('announcement', 'You are not signed in!')
              }
              return
            } else if(j === 'exit') {
              if(!locked && commandData.role(ws.accountName) === 'owner') {
                locked = true
                let t = 61
                console.log('closing server')
                let f = function() {
                  for(let q in workers) {
                    let w = workers[q]
                    w.worker.postMessage(['exit'])
                  }
                  console.log('exiting')
                  setTimeout(function() {
                    console.log('WARNING: process.exit(0)')
                    process.exit(0)
                  }, 10000)
                }
                let k = setInterval(function() {
                  t = t - 1
                  if(t < 0) {
                    f()
                    clearInterval(k)
                    return
                  }
                  for(let i=clients.length-1;i>=0;i--) {
                    let c = clients[i]
                    if(!c.fsocket && !c.sending) {
                      c.close()
                    } else {
                      c.sendPacket('flag', t)
                    }
                  }
                }, 1000)
              }
              return
            }
          }
        }
        ws.fsocket.send(e.data)
      }
    } else {
      if(data[0] in game.codes.send) {
        try {
          let type = game.codes.send[data[0]]
          if(type === 'login') {
            if(!ws.data.ready) {
              console.log('attempt login username:', data[1][0])
              ws.data.loginWaiting = true
              Accounts.fromUsername(data[1][0]).then(function(a) {
                if(a.success) {
                  let username = Accounts.readUsername(a.account)
                  if(a.account.password === SHA256(data[1][1])) {
                    a.account.lastOnline = Math.floor(Date.now() / 1000)
                    ws.sendPacket('flag', ['login', accountToObject(a.account)])
                    console.log('Login', a.account.username)
			              ws.account = a
                    ws.accountName = a.account.username
                    ws.accountNameParsed = username
                    a.save()
                    ws.data.admin = commandData.level(a.account.username) >= 2
                  } else {
                    ws.sendPacket('flag', ['login', 0, 'Wrong password'])
                  }
                } else {
                  ws.sendPacket('flag', ['login', 0, 'Account not found'])
                }
                ws.data.loginWaiting = false
                if(ws.data.loginCallback) { ws.data.loginCallback() }
              }).catch(function(e) {
                console.log('login error', e && e.stack || e)
                ws.sendPacket('flag', ['login', 0, 'Server error, try again'])
                ws.data.loginWaiting = false
                if(ws.data.loginCallback) { ws.data.loginCallback() }
              })
            } else {
              ws.sendPacket('flag', ['login'])
            }
          } else if(type === 'captcha') {
            let r = data[1]
            let t = r
            if(!r || r === 'openscenexe-nocaptcha' || !r.startsWith('openscenexe-') || !(game.tokens[r] >= 0)) {
              t = game.generateToken()
              game.tokens[t] = performance.now() + 12 * 60 * 60 * 1000
              game.tokenUses[t] = []
            } else {
              for(let i=clients.length-1;i>=0;i--) {
                let p = clients[i]
                if(p.captchaToken === r) {
                  ws.sendPacket('test', false)
                  return
                }
              }
              game.tokenUses[r].push(performance.now())
            }
            ws.captchaToken = t
            ws.sendPacket('test', [t])
            limit.remove(ws._ip, 0)
            if(ws.data.readyStarted) { return }
            ws.data.readyStarted = true
            ws.data.loginCallback = function() {
              ws.data.loginCallback = false
              let servers = []
              if(!locked) {
                for(let q in workers) {
                  let w = workers[q]
                  for(let p in w.dims) {
                    let d = w.dims[p]
                    if(d[0] || ws.data.admin) {
                      servers.push(d[1])
                    }
                  }
                }
              }
              ws.sendPacket('ready', servers)
              ws.data.ready = true
            }
            if(!ws.data.loginWaiting) {
              ws.data.loginCallback()
            }
            return
          } else if(type === 'ping') {
            ws.data.lastPing = performance.now()
            return
          }
        } catch(e) {
          console.log('packet error', e && e.stack || e)
        }
      }
    }
  })
  ws.addEventListener('close', function() {
    ws.data.open = false
    console.log(`Disconnection`, ws._ip)
    current.remove(ws)
    const remove = function() {
      let j = uids[ws.data.id]
      if(j && j === ws) {
        generator.removeId(ws.data.id)
      }
      if(ws.fsocket && ws.fsocket._ws === ws) {
        ws.fsocket.close()
      }
    }
    remove()
    let i = clients.indexOf(ws)
    if(i >= 0) { clients.splice(i, 1) }
    if(ws.account) {
	  ws.account.account.lastOnline = Math.floor(Date.now() / 1000)
	  ws.account.save()
  }
  })
})

