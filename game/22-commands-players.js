      kill: [
        [['targets'], function(data, tank, ws) {
          let targets = data[0]
          for(let i=targets.length-1;i>=0;i--) {
            let target = targets[i]
            if(!target.static || (!target.invincible && !target.inBase && !target.prevInBase)) {
              target.health = 0
              if('regenTime' in target) {
                target.regenTime = 0
              }
            }
          }
        }]
      ],
      maxstats: [
        [[], function(data, tank, ws) {
          let targets = data[0]
          tank.upgrades = [15, 15, 15, 15, 15, 15, 15, 15]
          tank.countUpgrades()
          tank.ws.sendPacket('setStats', tank.upgrades)
        }],
        [['targets'], function(data, tank, ws) {
          let targets = data[0]
          for(let i=targets.length-1;i>=0;i--) {
            let target = targets[i]
            if(!target.static && target.objectType === 'tank') {
              target.upgrades = [15, 15, 15, 15, 15, 15, 15, 15]
              target.countUpgrades()
              target.ws.sendPacket('setStats', target.upgrades)
            }
          }
        }]
      ],
      reset: [
        [[], function(data, tank, ws) {
          tank.health = tank.maxHealth
          tank.upgrades = [0, 0, 0, 0, 0, 0, 0, 0]
          tank.score = 0
          tank.rScore = 0
          tank.countUpgrades()
          tank.removeBullets()
          generator.setTankWeapon(tank, 'node')
          generator.setTankBody(tank, 'base')
          tank.firedBarrels = {}
          tank.update()
          generator.updateTank(tank)
          tank.dim.updatedTanks[tank.id] = tank
          tank.removeBullets()
          tank.ws.sendPacket('setStats', tank.upgrades)
        }],
        [['targets'], function(data, tank, ws) {
          let targets = data[0]
          for(let i=targets.length-1;i>=0;i--) {
            let target = targets[i]
            if(!target.static && target.objectType === 'tank') {
              target.health = target.maxHealth
              target.upgrades = [0, 0, 0, 0, 0, 0, 0, 0]
              target.score = 0
              target.countUpgrades()
              target.removeBullets()
              generator.setTankWeapon(target, 'node')
              generator.setTankBody(target, 'base')
              target.firedBarrels = {}
              target.update()
              generator.updateTank(target)
              target.dim.updatedTanks[target.id] = target
              target.removeBullets()
              target.ws.sendPacket('setStats', target.upgrades)
            }
          }
        }]
      ],
      resetstats: [
        [[], function(data, tank, ws) {
          tank.upgrades = [0, 0, 0, 0, 0, 0, 0, 0]
          tank.countUpgrades()
          tank.ws.sendPacket('setStats', tank.upgrades)
        }],
        [['targets'], function(data, tank, ws) {
          let targets = data[0]
          for(let i=targets.length-1;i>=0;i--) {
            let target = targets[i]
            if(!target.static && target.objectType === 'tank') {
              target.upgrades = [0, 0, 0, 0, 0, 0, 0, 0]
              target.countUpgrades()
              target.ws.sendPacket('setStats', target.upgrades)
            }
          }
        }]
      ],
      ascend: [
        [[], function(data, tank, ws) {
          tank.ascend()
          tank.update()
          tank.dim.updatedTanks[tank.id] = tank
          tank.ws.sendPacket('setStats', tank.upgrades)
        }],
        [['targets'], function(data, tank, ws) {
          let targets = data[0]
          for(let i=targets.length-1;i>=0;i--) {
            let target = targets[i]
            if(target.objectType === 'tank' && !target.static) {
              target.ascend()
              target.update()
              target.dim.updatedTanks[target.id] = target
              if(target.ws) {
                target.ws.sendPacket('setStats', target.upgrades)
              }
            }
          }
        }]
      ],
      localannounce: [
        [['targets', '*'], function(data, tank, ws) {
          let tanks = data[0]
          for(let i=tanks.length-1;i>=0;i--) {
            let tank = tanks[i]
            if(tank.ws) {
              tank.ws.sendPacket('announcement', data[1])
            }
          }
        }]
      ],
      announce: [
        [['*'], function(data, tank, ws) {
          let tanks = tank.dim.tanks
          for(let i=tanks.length-1;i>=0;i--) {
            let tank = tanks[i]
            if(tank.ws) {
              tank.ws.sendPacket('announcement', data[0])
            }
          }
        }]
      ],
      globalannounce: [
        [['*'], function(data, tank, ws) {
          args.parentPort.postMessage(['globalAnnounce', data[0]])
        }]
      ],
      remove: [
        [['targets'], function(data, tank, ws) {
          let targets = data[0]
          for(let i=targets.length-1;i>=0;i--) {
            let target = targets[i]
            if(target.remove && !target.static) {
              target.remove()
              if(target.ws && target.ws.sendPacket) {
                target.ws.data.respawnScore = 0
                target.ws.data.tank = false
                if(target.ws.data.isPlayer && (target.ws.data.uid >= 0 || args.standalone)) {
                  if(args.standalone) {
                    target.ws.sendPacket('death', [['Removed by staff'], 0])
                  } else {
                    target.ws.data.ready = false
                    args.parentPort.postMessage(['death', [target.ws.data.uid, 0, [['Removed by staff'], 0], target.ws.data.lastTeam]])
                  }
                }
              }
            }
          }
        }]
      ],
      wormhole: [
        [['position', 'string'], function(data, tank, ws) {
          generator.wormhole({
            x: data[0][0],
            y: data[0][1],
            size: 40,
            type: 1,
            time: 30,
            dim: tank.dim,
            ruptured: true,
            action: function(tank) {
              dimension.sendTankTo({
                tank: tank,
                dim: data[1],
                override: true,
              })
            }
          })
        }]
      ],
      fling: [
        [['targets', 'float', 'float'], function(data, tank, ws) {
          let targets = data[0]
          let position = tank.mousePosition
          for(let i=targets.length-1;i>=0;i--) {
            let object = targets[i]
            if(!object.static) {
              object.xv += data[1] * dimension.per50
              object.yv += data[2] * dimension.per50
            }
          }
        }]
      ],
      setvelocity: [
        [['targets', 'float', 'float'], function(data, tank, ws) {
          let targets = data[0]
          let position = tank.mousePosition
          for(let i=targets.length-1;i>=0;i--) {
            let object = targets[i]
            if(!object.static) {
              object.xv = data[1] * dimension.per50
              object.yv = data[2] * dimension.per50
            }
          }
        }]
      ],
      tp: [
        [['targets'], function(data, tank, ws) {
          let targets = data[0]
          let position = tank.mousePosition
          for(let i=targets.length-1;i>=0;i--) {
            let object = targets[i]
            if(!object.static) {
              object.x = position[0]
              object.y = position[1]
            }
          }
        }],
        [['targets', 'position'], function(data, tank, ws) {
          let targets = data[0]
          let position = data[1]
          for(let i=targets.length-1;i>=0;i--) {
            let object = targets[i]
            if(!object.static) {
              object.x = position[0]
              object.y = position[1]
            }
          }
        }]
      ],
