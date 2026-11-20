      team: [
        [['targets', 'string'], function(data, tank, ws) {
          let n = {
            ffa: 0,
            blue: 1,
            red: 2,
            green: 3,
            purple: 4,
            polygon: 5,
            celestial: 6,
            cele: 6,
            pink: 6,
            fallen: 7,
            gray: 7,
            yellow: 8,
            black: 9
          }
          if(data[1] && data[1].toLowerCase) {
            let p = data[1].toLowerCase()
            n = n[p]
            let targets = data[0]
            if(n >= 0 || p === 'random') {
              for(let i=targets.length-1;i>=0;i--) {
                let object = targets[i]
                if('team' in object && object.objectType === 'tank' && !object.static) {
                  object.team = (p === 'random' ? (1 + Math.floor(Math.random() * 4)) : n)
                  object.dim.updatedTanks[object.id] = object
                }
              }
            }
          }
        }],
        [['string'], function(data, tank, ws) {
          let n = {
            ffa: 0,
            blue: 1,
            red: 2,
            green: 3,
            purple: 4,
            polygon: 5,
            celestial: 6,
            cele: 6,
            pink: 6,
            fallen: 7,
            gray: 7,
            yellow: 8
          }
          if(data[0]) {
            let p = data[0].toLowerCase()
            n = n[p]
            if(n >= 0 || p === 'random') {
              tank.team = (p === 'random' ? (1 + Math.floor(Math.random() * 4)) : n)
              tank.dim.updatedTanks[tank.id] = tank
            }
          }
        }]
      ],
      weapon: [
        [['string'], function(data, tank, ws) {
          let weapon = data[0] || ''
          if(!(weapon in tank.dim.weapons)) { return ws.sendPacket('announcement', `There is no weapon called '${weapon}' here.`) }
          if(weapon !== tank.weapon && weapon in tank.dim.weapons) {
            tank.removeBullets()
            generator.setTankWeapon(tank, weapon)
            tank.firedBarrels = {}
            tank.update()
            generator.updateTank(tank)
            tank.dim.updatedTanks[tank.id] = tank
          }
        }],
        [['targets', 'string'], function(data, tank, ws) {
          let targets = data[0]
          let weapon = data[1]
          if(!(weapon in tank.dim.weapons)) { return ws.sendPacket('announcement', `There is no weapon called '${weapon}' here.`) }
          if(weapon in tank.dim.weapons) {
            for(let i=targets.length-1;i>=0;i--) {
              let tank = targets[i]
              if(tank && tank.objectType === 'tank') {
                if(weapon !== tank.weapon) {
                  tank.removeBullets()
                  generator.setTankWeapon(tank, weapon)
                  tank.firedBarrels = {}
                  tank.update()
                  generator.updateTank(tank)
                  tank.dim.updatedTanks[tank.id] = tank
                }
              }
            }
          }
        }]
      ],
      body: [
        [['string'], function(data, tank, ws) {
          let body = data[0] || ''
          if(!(body in tank.dim.bodies)) { return ws.sendPacket('announcement', `There is no body called '${body}' here.`) }
          if(body !== tank.body && body in tank.dim.bodies) {
            tank.removeBullets()
            generator.setTankBody(tank, body)
            tank.firedBarrels = {}
            tank.update()
            generator.updateTank(tank)
            tank.dim.updatedTanks[tank.id] = tank
          }
        }],
        [['targets', 'string'], function(data, tank, ws) {
          let targets = data[0]
          let body = data[1]
          if(!(body in tank.dim.bodies)) { return ws.sendPacket('announcement', `There is no body called '${body}' here.`) }
          if(body in tank.dim.bodies) {
            for(let i=targets.length-1;i>=0;i--) {
              let tank = targets[i]
              if(tank && tank.objectType === 'tank') {
                if(body !== tank.body) {
                  tank.removeBullets()
                  generator.setTankBody(tank, body)
                  tank.firedBarrels = {}
                  tank.update()
                  generator.updateTank(tank)
                  tank.dim.updatedTanks[tank.id] = tank
                }
              }
            }
          }
        }]
      ],
      send: [
        [['string'], function(data, tank, ws) {
          let dim = commands.findDim(data[0])
          if(!dim) {
            return ws.sendPacket('announcement', `No dimension called '${data[0]}'. Dimensions: ${commands.dimNames().join(', ')}`)
          }
          dimension.sendTankTo({
            dim: dim,
            tank: tank
          })
        }],
        [['targets', 'string'], function(data, tank, ws) {
          let targets = data[0]
          let dim = commands.findDim(data[1])
          if(!dim) {
            return ws.sendPacket('announcement', `No dimension called '${data[1]}'. Dimensions: ${commands.dimNames().join(', ')}`)
          }
          let count = 0
          for(let i=targets.length-1;i>=0;i--) {
            let t = targets[i]
            if(t && t.objectType === 'tank' && !t.static && t.alive) {
              dimension.sendTankTo({
                dim: dim,
                tank: t
              })
              count ++
            }
          }
          if(count && !(targets.length === 1 && targets[0] === tank)) {
            ws.sendPacket('announcement', `Sent ${count} tank${count > 1 ? 's' : ''} to ${commands.dimLabel(dim)}.`)
          }
        }]
      ],
      vanish: [
        [[], function(data, tank, ws) {
          tank.invisible = true
          tank.ws.sendPacket('announcement', 'Vanished into thin air.')
        }],
        [['string'], function(data, tank, ws) {
          let str = data[0]
          if(['true', 'yes', 'me'].indexOf(str) >= 0) {
            tank.invisible = true
            tank.ws.sendPacket('announcement', 'Vanished into thin air.')
          } else if(['false', 'no'].indexOf(str) >= 0) {
            tank.invisible = false
            tank.ws.sendPacket('announcement', 'Popped into existence.')
          }
        }],
        [['targets', 'string'], function(data, tank, ws) {
          let targets = data[0]
          let str = data[1]
          let v = false
          if(['true', 'yes', 'me'].indexOf(str) >= 0) {
            v = true
          } else if(['false', 'no'].indexOf(str) >= 0) {
            v = false
          } else {
            return
          }
          for(let i=targets.length-1;i>=0;i--) {
            let object = targets[i]
            if(object && object.objectType === 'tank' && !object.static) {
              object.invisible = v
              object.ws.sendPacket('announcement', v ? 'Vanished into thin air.' : 'Popped into existence.')
            }
          }
        }]
      ],
      god: [
        [[], function(data, tank, ws) {
          tank.invincible = true
          tank.invincibleTime = false
          tank.ws.sendPacket('announcement', 'You are now invincible.')
        }],
        [['string'], function(data, tank, ws) {
          let str = data[0]
          if(['true', 'yes', 'me'].indexOf(str) >= 0) {
            tank.invincible = true
            tank.invincibleTime = false
            tank.ws.sendPacket('announcement', 'You are now invincible.')
          } else if(['false', 'no'].indexOf(str) >= 0) {
            tank.invincible = false
            tank.invincibleTime = false
            tank.ws.sendPacket('announcement', 'You are now not invincible.')
          }
        }],
        [['targets', 'string'], function(data, tank, ws) {
          let targets = data[0]
          let str = data[1]
          let v = false
          if(['true', 'yes', 'me'].indexOf(str) >= 0) {
            v = true
          } else if(['false', 'no'].indexOf(str) >= 0) {
            v = false
          } else {
            return
          }
          for(let i=targets.length-1;i>=0;i--) {
            let object = targets[i]
            if(object && object.objectType === 'tank' && !object.static) {
              object.invincible = v
              object.invincibleTime = false
              object.ws.sendPacket('announcement', v ? 'You are now invincible.' : 'You are now not invincible.')
            }
          }
        }]
      ],
      restart: [
        [[], function(data, tank, ws) {
          args.parentPort.postMessage(['restart'])
        }]
      ],
      fullfov: [
        [[], function(data, tank, ws) {
          tank.fullFov = true
        }],
        [['string'], function(data, tank, ws) {
          let str = data[0]
          if(['true', 'yes', 'me'].indexOf(str) >= 0) {
            tank.fullFov = true
          } else if(['false', 'no'].indexOf(str) >= 0) {
            tank.fullFov = false
          }
        }]
      ],
      kick: [
        [['targets'], function(data, tank, ws) {
          commands.kick(data[0], tank, ws, '')
        }],
        [['targets', '*'], function(data, tank, ws) {
          commands.kick(data[0], tank, ws, data[1])
        }]
      ],
      ban: [
        [['targets'], function(data, tank, ws) {
          commands.ban(data[0], tank, ws, '')
        }],
        [['targets', '*'], function(data, tank, ws) {
          commands.ban(data[0], tank, ws, data[1])
        }]
      ],
      unban: [
        [['string'], function(data, tank, ws) {
          commands.toServer(ws, 'unban', [data[0], ws.data.uid])
        }]
      ],
      bans: [
        [[], function(data, tank, ws) {
          commands.toServer(ws, 'bans', [ws.data.uid])
        }]
      ],
      mute: [
        [['targets'], function(data, tank, ws) {
          commands.mute(data[0], tank, ws, '')
        }],
        [['targets', '*'], function(data, tank, ws) {
          commands.mute(data[0], tank, ws, data[1])
        }]
      ],
      unmute: [
        [['*'], function(data, tank, ws) {
          let found = commands.getTargets(data[0], tank) || [], t = found.length === 1 ? found[0] : false
          let uid = t && t.ws && t.ws.data && t.ws.data.isPlayer && t.ws.data.uid >= 0 ? t.ws.data.uid : -1
          commands.toServer(ws, 'unmute', [data[0], ws.data.uid, uid])
        }]
      ],
      mutes: [
        [[], function(data, tank, ws) {
          commands.toServer(ws, 'mutes', [ws.data.uid, commands.level(ws.data.role) >= commands.level('admin')])
        }]
      ],
      perf: [
        [[], function(data, tank, ws) {
          commands.toServer(ws, 'perf', [ws.data.uid])
        }]
      ],
      whois: [
        [['targets'], function(data, tank, ws) {
          commands.whois(data[0], tank, ws)
        }]
      ],
      spectate: [
        [['targets'], function(data, tank, ws) {
          commands.spectate(data[0], tank, ws)
        }]
      ],
      report: [
        [['string', '*'], function(data, tank, ws) {
          commands.report(data[0], data[1], tank, ws)
        }]
      ],
      role: [
        [['string'], function(data, tank, ws) {
          args.parentPort.postMessage(['setRole', [data[0].toLowerCase(), null, ws.data.uid]])
        }],
        [['string', 'string'], function(data, tank, ws) {
          let account = data[0].toLowerCase(), role = data[1].toLowerCase()
          if(commands.roles.indexOf(role) < 0) {
            ws.sendPacket('announcement', `Roles are: ${commands.roles.join(', ')}.`)
            return
          }
          if(ws.accountNameParsed && ws.accountNameParsed.toLowerCase() === account) {
            ws.sendPacket('announcement', `You can't change your own role.`)
            return
          }
          args.parentPort.postMessage(['setRole', [account, role, ws.data.uid]])
        }]
      ]
    },
