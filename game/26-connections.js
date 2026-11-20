  const SPAWN_LEVEL = 60
  const SPAWN_SCORE = Math.ceil(500 * (Math.pow(1.2, SPAWN_LEVEL - 1) - 1))
  server.on("connection", (ws, request) => {
    ws.data = {
      ready: false,
      tank: false,
      waiting: false,
      lastChat: 0,
      respawnScore: 0,
      lastTeam: 0,
      admin: false,
      isPlayer: true,
      closed: false,
      commands: {},
      timeStart: false,
    }

    if(ws._headers) {
      if(ws._headers['openscenexe-uid'] >= 0) {
        ws.data.uid = parseInt(ws._headers['openscenexe-uid'])
      } if(ws._headers['openscenexe-lastteam'] >= 0) {
        ws.data.lastTeam = parseInt(ws._headers['openscenexe-lastteam'])
      } if(ws._headers['openscenexe-accountname']) {
        ws.accountNameParsed = ws._headers['openscenexe-accountname']
        if(ws._headers['openscenexe-accountdata']) {
          ws.accountData = JSON.parse(ws._headers['openscenexe-accountdata'])
          ws.accountName = ws._headers['openscenexe-accountname'].toLowerCase()
        }
      }
    }
    const cPacket = function(arr) {
      return arr
    }
    ws.sendPacket = function(type) {
      if(type in game.codes.receive && ws.send) {
        if(arguments.length > 1) {
          const data = arguments[1]
          ws.send(cPacket(data && data.raw === true ? net.encode(game.codes.receive[type], data) : pack([game.codes.receive[type], data])))
        } else {
          ws.send(cPacket(pack([game.codes.receive[type]])))
        }
      }
    }
    let servers = []
    for(let n in dimension.dims) {
      let d = dimension.dims[n]
      if(d.freeJoin) {
        servers.push([n, d.displayName, d.displayColor, d.displayRadiant])
      }
    }
    clients.push(ws)
    if(ws.failedHeaderCheck) {
      failed = true
    }
    ws.data.ready = 1
    if(args.standalone) { setTimeout(function() { ws.sendPacket('ready', servers) }) }
    ws.on("message", (d) => {
      let data
      try {
        data = unpack(d)
      } catch(e) {
        ws.close()
        ws.sendPacket = function() {}
        return
      }
      if(data[0] in game.codes.send) {
        try {
          let type = game.codes.send[data[0]]
          if(type === 'captcha') {
            return
          } else if(type === 'ping') {
            return
          } else if(type === 'token') {
            return
          } else if(!ws.data.ready && !(type === 'chat' && ws.data.spectator && ws.data.spectator.staff)) {
            return
          } if(type === 'joinGame') {
            spectate.remove(ws)
            ws.timeStart = _performance.now()
            if(ws.data.tank === false && ws.data.waiting === false && data[1]) {
              ws.sendPacket('waiting', [false])
              let radiant = 0
              const roll = Math.random()
              const odds = [1 / 750, 1 / 250, 1 / 125, 1 / 75, 1 / 25]
              let sum = 0
              for(let i = 0; i < odds.length; i++) {
                sum += odds[i]
                if(roll < sum) {
                  radiant = 5 - i
                  break
                }
              }
              let dim = dimension.dims[data[1][1]]
              if(!dim) { return }
              let role = args.standalone ? 'owner' : data[1][4] && data[1][4].role
              ws.data.role = commands.roles.indexOf(role) > 0 ? role : 'player'
              ws.sendPacket('flag', ['staff', commands.level(ws.data.role) >= commands.level('admin')])
              commands.sendList(ws, dim)
              if(ws.data.role !== 'player') {
                setTimeout(function() {
                  ws.sendPacket('announcement', `Signed in as ${ws.data.role}. Type /help for your commands.`)
                }, 500)
              }
              if(dim.sandbox) {
                ws.accountName = false
                ws.accountData = false
                setTimeout(function() {
                  ws.sendPacket('announcement', 'Alert: You can no longer earn achievements and this run won\'t be saved!')
                }, 500)
              }
              let name = data[1][0]
              if(name) {
                const clean = words.cleanName(String(name).slice(0, 50))
                name = clean.name
                if(clean.bad) {
                  discordReport('profanity', 'tried to join with a blocked name', String(data[1][0]).slice(0, 50), ws)
                  setTimeout(function() {
                    ws.sendPacket('announcement', 'That name isn\'t allowed, so you are playing without one.')
                  }, 500)
                }
              }
              if(data[1][3]) {
                let tank = data[1][3]
                if(tank[0] === false) {
                  ws.data.respawnScore = tank[1] || 0
                } else {
                  tank[0].dim = dim
                  dim.newTanks.push([tank[0], ws, tank[1]])
                  ws.data.commands = { ...ws.data.commands, ...tank[0].commands }
                  ws.data.lastTeam = tank[0].team
                  return
                }
              }
              const joinMode = data[1][5] === 'arras' && 'arras:basic' in dim.weapons && 'arras:basic' in dim.bodies && !dim.noArras ? 'arras' : ''
              let team = 0
              if(dim.type === '2teams') {
                let teamCodeA = dim.teamCodeA, teamCodeB = dim.teamCodeB
                if(ws.data.lastTeam === teamCodeA || ws.data.lastTeam === teamCodeB) {
                  team = ws.data.lastTeam
                } else {
                  team = Math.random() < 0.5 ? teamCodeA : teamCodeB
                }
              } else if(dim.type === 'ffa') {
                team = 0
              } else {
                if(ws.data.lastTeam > 0 && ws.data.lastTeam < 5) {
                  team = ws.data.lastTeam
                } else {
                  team = 1 + Math.floor(4 * Math.random())
                }
              }
              ws.data.lastTeam = team;
              let score = Math.max(ws.data.respawnScore || 0, SPAWN_SCORE)
              if(ws.accountData) {
                if(score < 100) {
                  ws.accountData.ohNode = true
                  ws.accountData.classic = true
                  ws.accountData.pristine = true
                } else {
                  ws.accountData.ohNode = false
                  ws.accountData.classic = false
                  ws.accountData.pristine = false
                }
              }
              let tank = {
                dim: dim,
                x: 0,
                y: 0,
                name: name || '',
                weapon: joinMode ? 'arras:basic' : 'node',
                body: joinMode ? 'arras:basic' : 'base',
                physics: joinMode,
                score: score,
                rScore: score,
                radiant: radiant,
                team: team
              }
              console.log('joinGame', `name:${name} score:${Math.round(score)} dim:${dim.name}`)
              ws.data.waiting = true
              dim.newTanks.push([tank, ws])
              ws.data.respawnScore = 0
            }
          } else if(type === 'direction') {
            if(ws.data.tank) {
              if(data[1] === false) {
                ws.data.tank.input.movement = [0, 0]
              } else if(data[1] >= 0 && data[1] <= 200) {
                let rad = data[1] / 100 * Math.PI
                ws.data.tank.input.movement = [Math.cos(rad), Math.sin(rad)]
              }
            }
          } else if(type === 'd') {
            if(ws.data.tank && Number.isFinite(data[1])) {
              ws.data.tank.d = ((data[1] % 200 + 200) % 200) / 100 * Math.PI
            }
          } else if(type === 'chat') {
            if(!ws.data.tank && ws.data.spectator && ws.data.spectator.staff) {
              if(typeof data[1] === 'string' && data[1][0] === '/') {
                const message = data[1].slice(0, 2000)
                if(commands.asSpectator(ws, message) === true) {
                  discordReport('commandLogs', `used a command while spectating (${ws.data.role})`, message.slice(0, 300), ws)
                  commandLogs.write(['command used', ws.data.spectator.dim.name, ws.accountNameParsed, ws.data.role, message].join(' ') + '\n')
                }
              }
              return
            }
            if(!ws.data.tank || ws.data.tank.ws !== ws || typeof data[1] !== 'string') {
              return
            }
            let message = data[1]
            if(ws.data.tank.dim.onChat) {
              let b = false
              let a = ws.data.tank.dim.onChat(message, ws.data.tank, function() {
                b = true
              })
              if(a) { message = a }
              if(b) { return }
            }
            if(message[0] === '/') {
              if(ws.data.tank) {
                let a = commands.execute(message.slice(0, 2000), ws.data.tank, ws)
                if(a) {
                  if(a === true) { discordReport('commandLogs', `used a command (${ws.data.role})`, message.slice(0, 300), ws) }
                  commandLogs.write(['command used', ws.data.tank.dim ? ws.data.tank.dim.name : 'undefined', ws.accountNameParsed, ws.data.role, message].join(' ') + '\n')
                }
                if(a === true && ws.accountName) {
                  ws.accountName = false
                  ws.accountData = false
                  ws.sendPacket('announcement', 'Alert: You can no longer earn achievements and this run won\'t be saved!')
                }
              }
            } else {
              const original = message ? String(message).slice(0, 100) : ''
              if(message) {
                message = words.mask(original)
                if(words.isBad(message)) {
                  discordReport('profanity', 'tried to send a blocked message', original, ws)
                  ws.sendPacket('announcement', 'That message has words that aren\'t allowed.')
                  return
                }
              }
              if(message && message !== original) {
                discordReport('profanity', 'said (filtered in game)', original, ws)
              }
              let now = _performance.now()
              if(now - ws.data.lastChat < 750) {
                discordReport('spam', 'is sending chat messages too quickly', '', ws, 30000)
                ws.sendPacket('announcement', 'You are sending chat messages too quickly. Please slow down.')
              } else if(ws.data.tank && message && message.length > 0) {
                ws.data.lastChat = now
                let dim = ws.data.tank.dim
                if(ws.data.tank.id in dim.chatMessages) {
                  ws.sendPacket('announcement', 'You are sending chat messages too quickly. Please slow down.')
                } else {
                  const checked = words.spam(ws.data.spam || (ws.data.spam = {}), message, now)
                  if(checked.error) {
                    if(checked.error.startsWith('Muted')) { discordReport('spam', 'was muted for chat spam', message, ws) }
                    ws.sendPacket('announcement', checked.error)
                  } else {
                    ws.data.tank.chat(checked.message)
                  }
                }
              }
            }
          } else if(type === 'typing') {
            if(ws.data.tank) {
              ws.data.tank.typing = data[1] ? true : false
            }
          } else if(type === 'passive') {
            if(ws.data.tank) {
              ws.data.tank.passive = data[1] ? true : false
            }
          } else if(type === 'firing') {
            if(ws.data.tank) {
              ws.data.tank.firing = (data[1] % 2 === 1) ? true : false
              ws.data.tank.droneControl = (data[1] < 2) ? false : true
            }
          } else if(type === 'controlPosition') {
            if(ws.data.tank) {
              let x = Number(data[1] && data[1][0])
              let y = Number(data[1] && data[1][1])
              if(Number.isFinite(x) && Number.isFinite(y)) {
                ws.data.tank.controlPosition = [Math.max(-100000, Math.min(100000, x)), Math.max(-100000, Math.min(100000, y))]
              }
            }
          } else if(type === 'upgradeStat') {
            if(ws.data.tank) {
              ws.data.tank.countUpgrades()
              let i = data[1][0]
              if(i >= 0 && i <= 7) {
                let amount = data[1][1]
                if(!Number.isInteger(amount)) { return }
                let required = amount - ws.data.tank.upgrades[i]
                let _b = ws.data.tank.dim.bodies[ws.data.tank.body]
                if(_b && _b.celestial) {
                  _b = 14
                } else {
                  _b = 0
                }
                if(required > 0 && ws.data.tank.upgradeCount + required + _b < ws.data.tank.level && amount <= 15) {
                  ws.data.tank.upgradeCount += required
                  ws.data.tank.upgrades[i] = amount
                } else {
                  ws.sendPacket('setStats', ws.data.tank.upgrades)
                }
              }
            }
          } else if(type === 'upgradeWeapon') {
            if(ws.data.tank) {
              let weapon = data[1] || ''
              let map = tankData.weaponUpgradeMap[ws.data.tank.weapon]
              if(ws.data.tank.overrideWeapons) {
                map = {
                  upgrades: [weapon],
                  level: 0,
                }
              }
              const upgradeIndex = map ? map.upgrades.indexOf(weapon) : -1
              const neededLevel = map && map.levels ? map.levels[upgradeIndex] : map && map.level
              if(map && weapon in ws.data.tank.dim.weapons && upgradeIndex >= 0 && ws.data.tank.level >= neededLevel) {
                ws.data.tank.removeBullets()
                generator.setTankWeapon(ws.data.tank, weapon)
                const pairedBody = ws.data.tank.dim.weapons[weapon].pairedBody
                if(pairedBody && pairedBody in ws.data.tank.dim.bodies) {
                  generator.setTankBody(ws.data.tank, pairedBody)
                }
                ws.data.tank.firedBarrels = {}
                generator.updateTank(ws.data.tank)
                ws.data.tank.dim.updatedTanks[ws.data.tank.id] = ws.data.tank
                if(ws.data.tank.overrideWeapons) {
                  ws.data.tank.overrideWeapons = false
                  ws.sendPacket('flag', ['upgrades', 0])
                }
              }
            }
          } else if(type === 'upgradeBody') {
            if(ws.data.tank) {
              let body = data[1] || ''
              let map = String(ws.data.tank.body).startsWith('arras:') ? undefined : tankData.bodyUpgradeMap[ws.data.tank.body]
              if(ws.data.tank.overrideBodies) {
                map = {
                  upgrades: [body],
                  level: 0,
                }
              }
              if(map && body in ws.data.tank.dim.bodies && map.upgrades.indexOf(body) >= 0 && ws.data.tank.level >= map.level) {
                ws.data.tank.removeBullets()
                generator.setTankBody(ws.data.tank, body)
                ws.data.tank.firedBarrels = {}
                generator.updateTank(ws.data.tank)
                ws.data.tank.dim.updatedTanks[ws.data.tank.id] = ws.data.tank
                if(ws.data.tank.overrideBodies) {
                  ws.data.tank.overrideBodies = false
                  ws.sendPacket('flag', ['upgrades', 1])
                }
              }
            }
          } else if(type === 'editTank') {
            let t = ws.data.tank
            if(t && t.dim && t.dim.applyEdit) {
              t.dim.applyEdit(t, data[1])
            }
          } else {
            ws.close()
            ws.sendPacket = function() {}
          }
        } catch(e) {
          console.log(e)
        }
      } else {
        ws.close()
        ws.sendPacket = function() {}
      }
    })
    ws.on("close", () => {
      ws.closed = true
      spectate.remove(ws)
      let i = clients.indexOf(ws)
      if(i >= 0) {
        clients.splice(i, 1)
      }
      game.clients = clients = Array.from(server.clients)
      const remove = function() {
        if(ws.data.tank) {
          let tank = ws.data.tank
          gameEnd(tank)
          tank.ws.send = false
          delete ws.data.uid
          tank.team = 7
          tank.aiInput = tank.ai = 'fallen'
          if(tank.invisible || tank.noHitBox || tank.dim.removeFallens) {
            tank.remove()
          }
          tank.invincible = false
          tank.invincibleTime = 0
          tank.ws.data.isPlayer = false
          tank.ws.accountName = false
          tank.ws.accountData = false
          tank.name = `Fallen ${tank.weapon && tank.weapon[0] ? tank.weapon[0].toUpperCase() + tank.weapon.slice(1) : '???'}-${tank.body && tank.body[0] ? tank.body[0].toUpperCase() + tank.body.slice(1) : '???'}`
          tank.dim.updatedTanks[tank.id] = tank
          let c = 0
          for(let i=tank.dim.tanks.length-1;i>=0;i--) {
            if(tank.dim.tanks[i].ai === 'fallen' && !tank.ws.data.isPlayer) {
              c ++
            }
          }
          if(c >= 10) {
            tank.remove()
          } else if(tank.dim.name === 'sanctuary' || tank.dim.name === 'abyss') {
            dimension.sendTankTo({
              tank: tank,
              dim: ['ffa', '2teams', '4teams'][Math.floor(Math.random() * 3)]
            })
          }
          console.log('removeTank', `name:${tank.name} score:${tank.score} dim:${tank.dim.name}`)
        }
      }
      remove()
    })
  })

