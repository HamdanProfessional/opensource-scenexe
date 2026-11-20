      const peacekeeperAvoid = function(tank) {
        let ax = 0, ay = 0
        const reach = tank.size + 700
        const push = function(dx, dy, gap) {
          if(gap >= reach) { return }
          const r = Math.sqrt(dx * dx + dy * dy) || 1, k = (reach - gap) / reach
          ax += dx / r * k * k * 3
          ay += dy / r * k * k * 3
        }
        const box = function(x, y, w, h) {
          const cx = Math.max(x - w, Math.min(x + w, tank.x)), cy = Math.max(y - h, Math.min(y + h, tank.y))
          let dx = tank.x - cx, dy = tank.y - cy
          if(dx === 0 && dy === 0) { dx = tank.x - x; dy = tank.y - y }
          push(dx, dy, Math.sqrt(dx * dx + dy * dy) - tank.size)
        }
        for(let i=dim.walls.length-1;i>=0;i--) {
          const w = dim.walls[i]
          if(w && w[4] > 0 && w[4] !== tank.team && !(w[5] && w[5].noHitBox)) { box(w[0], w[1], w[2], w[3]) }
        }
        for(let i=dim.gates.length-1;i>=0;i--) {
          const g = dim.gates[i], side = g[3] === 0 || g[3] === 2
          box(g[1], g[2], side ? 30 : g[4], side ? g[4] : 30)
        }
        for(const id in dim.wormholes) {
          const w = dim.wormholes[id]
          const dx = tank.x - w.x, dy = tank.y - w.y
          push(dx, dy, Math.sqrt(dx * dx + dy * dy) - (w.size || 0) - tank.size)
        }
        return [ax, ay]
      }
      for(let i=dim.tanks.length-1;i>=0;i--) {
        let tank = dim.tanks[i]

        if(dim.wrap) {
          dimension.wrap(tank, dim.mapSize)
        } else dimension.confine(tank, dim.mapSize - (tank.size < 2 * dimension.clipSize ? tank.size / 2 : tank.size - dimension.clipSize), (dim.mapSizeSpeed > 0) ? (dim.mapSize > dim._mapSize ? dim.mapSizeSpeed : -dim.mapSizeSpeed) : 0)
        tank.prevInBase = tank.inBase
        tank.inBase = false
        let closestObject = false
        if(tank.detector && tank.detector.closestObject) {
          closestObject = tank.detector.closestObject
        }
        if(tank.ai === 'peacekeeper') {
          let closestObject = tank.detector.closestTank
          if(closestObject && (closestObject.x >= 0 || closestObject.x <= 0) && (closestObject.y >= 0 || closestObject.y <= 0)) {
            tank.mousePosition = [closestObject.x, closestObject.y]
            let d = [closestObject.x - tank.x, closestObject.y - tank.y]
            tank.controlPosition = [d[0], d[1]]
            let r = Math.sqrt(d[0] * d[0] + d[1] * d[1]) || 1
            if((r < closestObject.size + tank.size + 100) && !tank.aiRam) {
              r = -r
            }
            tank.input.movement = [d[0] / r, d[1] / r]
            tank.firing = true
            let _b = tank.dim.bodies[tank.body]
            if(_b && _b.celestial) {
              _b = Math.PI
            } else {
              _b = 0
            }
            tank.d = Math.atan2(-d[0], d[1]) + _b
          } else {
            let dx = -Math.sin(tank.d)
            let dy = Math.cos(tank.d)
            tank.mousePosition = [0, 0]
            tank.controlPosition = [0, 0]
            tank.input.movement = [dx, dy]
            tank.firing = false
            if(options.gameUpdate && Math.random() < 0.01) {
              tank.d = Math.random() * 2 * Math.PI
            }
          }
          const avoid = peacekeeperAvoid(tank)
          if(avoid[0] || avoid[1]) {
            let mx = tank.input.movement[0] + avoid[0], my = tank.input.movement[1] + avoid[1]
            const r = Math.sqrt(mx * mx + my * my) || 1
            tank.input.movement = [mx / r, my / r]
            if(!tank.firing) { tank.d = Math.atan2(-mx, my) }
          }
          tank.droneControl = false
          if(tank.aiRam) {
            tank.firing = true
          }
        } else if(tank.ai === 'fallen') {
          tank.passive = false
          let bodyUpgrades = tankData.bodyUpgradeMap[tank.body], weaponUpgrades = tankData.weaponUpgradeMap[tank.weapon]

          if(weaponUpgrades && tank.level >= weaponUpgrades.level) {
            let weapon = weaponUpgrades.upgrades[Math.floor(Math.random() * weaponUpgrades.upgrades.length)]
            tank.removeBullets()
            generator.setTankWeapon(tank, weapon)
            tank.firedBarrels = {}
            generator.updateTank(tank)
            tank.update()
            tank.dim.updatedTanks[tank.id] = tank
          } if(bodyUpgrades && tank.level >= bodyUpgrades.level) {
            let body = bodyUpgrades.upgrades[Math.floor(Math.random() * bodyUpgrades.upgrades.length)]
            tank.removeBullets()
            generator.setTankBody(tank, body)
            tank.firedBarrels = {}
            generator.updateTank(tank)
            tank.update()
            tank.dim.updatedTanks[tank.id] = tank
          }

          if(tank.upgradeCount < 120 && tank.upgradeCount < tank.level - 1) {
            tank.upgradeCount ++
            let k = []
            for(let i=0;i<8;i++) {
              if(tank.upgrades[i] < 15) {
                k.push(i)
              }
            }
            tank.upgrades[k[Math.floor(Math.random() * k.length)]] ++
          }
          let running = false
          if(tank.health < tank.maxHealth * 0.5 && tank.detector.closestTank) {
            closestObject = tank.detector.closestTank
            running = true
          } if(!tank.aiRam && (tank.health < tank.maxHealth * 0.75 || (tank.detector.closestBullet && tank.detector.closestBullet.parent.score > tank.score * 100)) && tank.detector.closestBulletDistance < 200 && tank.detector.closestBullet) {
            closestObject = tank.detector.closestBullet
            running = true
          }
          if(!closestObject) {
            if(tank.fallenWormhole && !tank.fallenWormhole.removed && !(options.gameUpdate && Math.random() < 0.01)) {
              closestObject = {
                x: tank.fallenWormhole.x,
                y: tank.fallenWormhole.y,
                size: -50,
              }
            } else {
              let w = Object.keys(dim.wormholes)
              let l = w.length
              if(l) {
                let r = dim.wormholes[w[Math.floor(Math.random() * l)]]
                tank.fallenWormhole = r
              }
            }
          }
          if(closestObject && (closestObject.x >= 0 || closestObject.x <= 0) && (closestObject.y >= 0 || closestObject.y <= 0)) {
            tank.mousePosition = [closestObject.x, closestObject.y]
            let d = [closestObject.x - tank.x, closestObject.y - tank.y]
            tank.controlPosition = [d[0], d[1]]
            let r = Math.sqrt(d[0] * d[0] + d[1] * d[1]) || 1
            if((r < closestObject.size + tank.size + 150 || running) && !tank.aiRam) {
              r = -r
              if(!running && r < closestObject.size + tank.size + 50) {
                r = 0
              }
            }
            tank.input.movement = r ? [d[0] / r, d[1] / r] : [0, 0]
            tank.firing = true
            let _b = tank.dim.bodies[tank.body]
            if(_b && _b.celestial) {
              _b = Math.PI
            } else {
              _b = 0
            }
            tank.d = dimension.averageAngles(tank.d, Math.atan2(-d[0], d[1]) + _b, dimension.smooth(3))
            tank.fallenHasNoTarget = false
          } else {
            let dx = -Math.sin(tank.d)
            let dy = Math.cos(tank.d)
            tank.mousePosition = [0, 0]
            tank.controlPosition = [0, 0]
            if(tank.aiRam) {
              tank.input.movement = [dx * 0.3, dy * 0.3]
              tank.d += 0.005 * dimension.tickMultiplier
              if(tank.d > 2 * Math.PI) {
                tank.d -= 2 * Math.PI
              }
            } else {
              dx = -Math.sin(tank.randomD)
              dy = Math.cos(tank.randomD)
              tank.input.movement = [dx, dy]
              tank.firing = false
              let ms = dim.mapSize - tank.size
              if(!tank.fallenHasNoTarget || (options.gameUpdate && Math.random() < 0.01) || (options.gameUpdate && (tank.x > ms || tank.x < -ms || tank.y > ms || tank.y < -ms) && Math.random() < 0.1)) {
                tank.fallenHasNoTarget = true
                tank.randomD = Math.floor(Math.random() * 8) * 0.25 * Math.PI
                let q = 0.7 * (Math.random() - 0.5)
                tank.pointD = tank.randomD + q
              }
              tank.d = dimension.averageAngles(tank.d, tank.pointD, dimension.smooth(3))
            }
          }
          tank.droneControl = false
          if(tank.aiRam) {
            tank.firing = true
          }
        }
        for(let u=0,k=tank._turrets.length;u<k;u++) {
          let turret = tank._turrets[u]
          dimension.updateTurret(turret, tank, tank)
        }
        codeTanks.update(tank)
        for(let u=0,k=tank.auras.length;u<k;u++) {
          let aura = tank.auras[u]
          let m = (1 + tank.upgrades[3] / 15) * tank.sReload * (1 + tank.upgrades[2] / 15) * tank.sBulletDamage * (1 + tank.upgrades[0] / 15)
          if(aura.detector && tank.passive === false && aura.detector && aura.detector.objects) {
            if(aura.type === 0) {
              for(let i=aura.detector.objects.length-1;i>=0;i--) {
                let c = aura.detector.objects[i]
                if(!(c.invincible || c.inBase || c.prevInBase)) {
                  let max = c.size * 2
                  let distance = aura.detector.distances[i] + max
                  let im = distance < 0 ? 1 : ((1 - distance / max) * 0.5 + 0.5)
                  c.damage(dimension.tickMultiplier * im * m * aura.auraDamage * 5 * tank.levelMultiplier, tank, 'tanks')
                }
              }
            } else if(aura.type === 1 && aura.healing) {
              for(let i=aura.detector.objects.length-1;i>=0;i--) {
                aura.detector.objects[i].regen += (aura.healing * (1 + tank.upgrades[3] / 20) * tank.sReload * 0.7 * (1 + tank.upgrades[6] / 15) - 0.5)
              }
            } else if(aura.type === 2 && aura.auraPull) {
              for(let i=aura.detector.objects.length-1;i>=0;i--) {
                let c = aura.detector.objects[i]
                if(!(c.invincible || c.inBase || c.prevInBase)) {
                  let dx = c.x - aura.gameX
                  let dy = c.y - aura.gameY
                  let d = Math.sqrt(dx * dx + dy * dy)
                  let m = aura.auraPull * 0.3 * (tank.size * tank.weight) / (c.size * (c.weight || 1))
                  if(d < 1) { d = m }
                  else { d = m / d }
                  c.xv -= dx * d * dimension.per50 * dimension.per50
                  c.yv -= dy * d * dimension.per50 * dimension.per50
                }
              }
            }
          }
        }
        for(let i=0,l=tank._barrels.length;i<l;i++) {
          let barrel = tank._barrels[i]

          if(barrel.data.type === 6 || barrel.data.type === 7 || barrel.data.type > 9) { continue }
          if(barrel.child) { continue }
          barrel.current += dimension.tickMultiplier * 0.01
          let reload = barrel.data.reload * 0.5 * (1 - tank.upgrades[3] / 30) / tank.sReload
          let active = tank.firing
          if(barrel.data.altFire) {
            active = tank.droneControl
          } else if(barrel.data.autoFire) {
            active = true
          }
          if(barrel.turret) {
            active = ((barrel.turret.followingMouse || barrel.turret.detector.closest) ? barrel.turret.active : false)
          }
          if(barrel.data.type === 2 || barrel.data.type === 4) {
            if(tank.droneCount >= dimension.maxDronesPerTank || barrel.bullets.length >= barrel.data.drones * (1 + tank.upgrades[0] / 30)) {
              active = false
            } else {
              active = tank.passive ? tank.firing : true
            }
          } else if(barrel.data.maxChildren > 0 && !barrel.data.destroyOldest && barrel.bullets.length >= barrel.data.maxChildren) {
            active = false
          }
          if(active) {
            if(barrel.current >= reload) {
              if(reload) {
                barrel.current -= reload
                if(barrel.current >= reload) {
                  barrel.current = (barrel.current % reload)
                }
              } else {
                barrel.current = 0
              }
              if(barrel.data.type === 1 || barrel.data.type === 3) {
                if(barrel.bullets.length > barrel.maxTraps) {
                  barrel.bullets[0].remove()
                }
              }
              let d = (barrel.turret ? barrel.turret.d : tank.d) + barrel.data.d
              let x = (barrel.turret ? barrel.turret.gameX : tank.x)
              let y = (barrel.turret ? barrel.turret.gameY : tank.y)
              let sin = Math.sin(d)
              let cos = Math.cos(d)
              let offsetX = -barrel.data.x
              let offsetY = -barrel.data.y + barrel.data.height * 2
              let speed = dimension.getBulletSpeed(barrel.data, tank) * tank.sBulletSpeed
              let [time, health] = dimension.getBulletData(barrel.data.type, tank)
              let rsize = barrel.data.relativeSize * tank.size
              tank.firedBarrels[i] = i
              let size = (barrel.data.relativeSizeS || barrel.data.relativeSize) * barrel.data.width
              if(barrel.data.type === 8) {
                let p = generator.polygon({
                  x: x + rsize * (cos * offsetX - sin * offsetY),
                  y: y + rsize * (cos * offsetY + sin * offsetX),
                  d: d,
                  sides: barrel.data.polygonSides,
                  dim: tank.dim,
                  radiant: 1 + tank.radiant,
                })
                p.xv = -sin * speed * 5 * dimension.per50
                p.yv = cos * speed * 5 * dimension.per50
              } else if(barrel.data.type < 9) {
                let rsin = sin, rcos = cos
                if(barrel.data.spread) {
                  d += ((Math.random() - 0.5) * barrel.data.spread * Math.PI) % (2 * Math.PI)
                  rsin = Math.sin(d)
                  rcos = Math.cos(d)
                }
                generator.bullet({
                  dim: dim,
                  parent: tank,
                  barrelId: i,
                  size: size,
                  d: d,
                  damage: (1 + tank.upgrades[2] / 22.5) * tank.sBulletDamage * (1 + tank.upgrades[1] / 60),
                  health: barrel.data.penetration * health * (1 + tank.upgrades[0] / 17.6),
                  lifeTime: barrel.data.time * time,
                  x: x + rsize * (cos * offsetX - sin * offsetY),
                  y: y + rsize * (cos * offsetY + sin * offsetX),
                  xv: -rsin * speed,
                  yv: rcos * speed,
                  speed: speed,
                  barrel: barrel,
                })
              }
              if(barrel.data.recoil && !tank.static && tank.physics === 'arras' && barrel.data.arras) {
                arrasPhysics.recoil(tank, barrel, sin, cos)
              } else if(barrel.data.recoil && !tank.static) {
                let recoil = 0.6 * barrel.data.recoil * size * (1 + tank.upgrades[1] / 30)
                tank.xv += recoil * sin * dimension.per50
                tank.yv -= recoil * cos * dimension.per50
              }
            }
          } else {
            let max = reload * (1 - barrel.data.delay)
            if(barrel.current > max) {
              barrel.current = max
            }
          }
        }
        if(tank.health <= 0) {
          let v = true, r = true
          let dimTanks = {}, dimPolygons = {}
          for(let i=tank.dim.tanks.length-1;i>=0;i--) {
            let obj = tank.dim.tanks[i]
            dimTanks[obj.id] = obj
          } for(let i=tank.dim.polygons.length-1;i>=0;i--) {
            let obj = tank.dim.polygons[i]
            dimPolygons[obj.id] = obj
          }
          if(tank.onDeath) {
            tank.onDeath({
              tank: tank,
              preventDefault: function() {
                v = false
              },
              preventRemove: function() {
                r = false
              },
              dimTanks: dimTanks,
              dimPolygons: dimPolygons
            })
          }
          if(tank.dim.onDeath) {
            tank.dim.onDeath({
              tank: tank,
              preventDefault: function() {
                v = false
              },
              preventRemove: function() {
                r = false
              },
              dimTanks: dimTanks,
              dimPolygons: dimPolygons
            })
          }
          if(v) {
            if(r) { tank.remove() }
            if(!tank.noKillNotification) {
              console.log('killedTank', `name:${tank.name} score:${tank.score} dim:${tank.dim.name}`)
            }
            let s = tank.score, s1 = tank.rScore
            if(tank.forceDeathScore >= 0) {
              s = s1 = tank.forceDeathScore
            }
            const exact = !!tank.exactDeathScore
            if(exact) { s = s1 = tank.score }
            let totalDamage = 0
            let rTotalScore = s1 * (exact ? 1 : 0.9)
            let radiant = exact ? 1 : dimension.getRadiantMultiplier(tank.radiant)
            let totalScore = s * (exact ? 1 : 0.9) * radiant
            let s2 = totalScore > 0 ? rTotalScore / totalScore : 0
            let tanks = {}, polygons = {}
            let tankNames = []
            let tankOrder = {}
            let count = 0

            for(let id in tank.finalDamage.tanks) {
              let _tank = dimTanks[id]
              if(_tank && !_tank.static) {
                let finalDamage = tank.finalDamage.tanks[id]
                let damage = 0
                for(let i=0;i<16;i++) { damage += finalDamage[i] }
                tanks[id] = damage
                tankNames.push(_tank.name)
                tankOrder[id] = count
                count ++
                totalDamage += damage
              }
            } for(let id in tank.finalDamage.polygons) {
              let _polygon = dimPolygons[id]
              if(_polygon) {
                let finalDamage = tank.finalDamage.polygons[id]
                let damage = 0
                for(let i=0;i<16;i++) { damage += finalDamage[i] }
                polygons[id] = damage
                tankNames.push(dimension.getFullPolygonName(_polygon))
                totalDamage += damage
              }
            }
            let accountData = gameEnd(tank)
            let timeAlive = accountData ? accountData.timeAlive : 250
            let highest = [false, 0], topKiller = [false, 0]
            for(let id in tanks) {
              let part = tanks[id] / totalDamage
              let obj = dimTanks[id]
              if(part > topKiller[1]) {
                topKiller[1] = part
                topKiller[0] = obj
              }
              let frac = obj.score > 1 ? tank.score / obj.score : tank.score
              if(frac <= 0) { frac = 0.25 }
              else { frac = Math.atan(Math.log(frac) * 0.75 + 1) / (2 * Math.PI) + 0.5 }
              let p = part * totalScore * frac
              if(!p) { continue }
              if(part > highest[1]) {
                highest[1] = part
                highest[0] = obj
              }
		          totalScore -= p
              obj.score += p
              obj.rScore += part * rTotalScore * frac
              if(obj.ws.accountData && tank.score >= 1) {
                let s = Math.log(tank.score)
                s = s * s / 10 - 10 - (obj.score >= 1 ? Math.log(obj.score) / 2 : 0)
                s *= part * 1.2 * timeAlive / (timeAlive + 100)
                if(s > 0) { obj.ws.accountData.stars += s }
              }
              if(dim.skinwalkers) {
                obj.removeBullets()
                generator.setTankWeapon(obj, tank.weapon)
                generator.setTankBody(obj, tank.body)
                obj.firedBarrels = {}
                generator.updateTank(obj)
                obj.dim.updatedTanks[obj.id] = obj
              }
              obj.update()
              if(obj.ws.sendPacket && !tank.noKillNotification) {
                let slice = tankOrder[id]
                let names = tankNames.slice(0, slice).concat(tankNames.slice(slice + 1))
                let length = names.length
                if(length === 0) {
                  obj.ws.sendPacket('announcement', `You killed ${tank.name}.`)
                } else if(length === 1) {
                  obj.ws.sendPacket('announcement', `You and ${names[0]} killed ${tank.name}.`)
                } else {
                  obj.ws.sendPacket('announcement', `You, ${names.slice(0, length - 1).join(', ')}, and ${names[length - 1]} killed ${tank.name}.`)
                }
              }
            }
            if(topKiller[0]) {
              topKiller[0].kills = (topKiller[0].kills || 0) + 1
            }
            if(highest[0] && highest[0].ws && highest[0].ws.accountData && !dim.sandbox) {
              let data = highest[0].ws.accountData
              if(tank) {
                if(tank.celestial) {
                  data.celestialKills ++
                  args.parentPort.postMessage(['kill', [highest[0].ws.accountName, 'celestialKills']])
                } else {
                  data.tankKills ++
			            args.parentPort.postMessage(['kill', [highest[0].ws.accountName, 'tankKills']])
                } if(!data.achievements[0]) {
                  let t = data.achievements[0] = createAchievement(0)
                  sendAchievement(highest[0], t)
                } if(tank.ws.accountNameParsed && tank.ws.accountNameParsed === 'beel' && !data.achievements[25]) {
                  let t = data.achievements[25] = createAchievement(25)
                  sendAchievement(highest[0], t)
                }
              }
            }
            for(let id in polygons) {
              let part = polygons[id] / totalDamage
              let obj = dimPolygons[id]
              let r = 1.5 * (obj.radiant < 1 ? 1 : (12 * Math.pow(4, obj.radiant - 1)))
              let p = part * totalScore * 0.75
              if(!p) { continue }
		          totalScore -= p
              let s = p / r
              obj.score += s
              obj.rScore += s
              obj.update()
            }
            if(tank.ws && tank.ws.data.isPlayer && tank.name) {
            }
            if(tank.ws.sendPacket && r) {
              let respawnScore = Math.round(totalScore * s2)
              if(tank.dim.forceRespawnScore >= 0) { respawnScore = tank.dim.forceRespawnScore }
              tank.ws.data.respawnScore = respawnScore
              if(tank.ws.data.isPlayer && (tank.ws.data.uid >= 0 || args.standalone)) {
                let killer = topKiller[0], most = 0
                if(!killer) {
                  for(let id in polygons) {
                    if(polygons[id] > most && dimPolygons[id]) {
                      most = polygons[id]
                      killer = dimPolygons[id]
                    }
                  }
                }
                let stats = [Math.round(tank.score), tank.level, Math.round((Date.now() - (tank.spawnedAt || Date.now())) / 1000), tank.kills || 0]
                spectate.add(tank.ws, dim, tank, killer)
                if(args.standalone) {
                  console.log('death', [tankNames, respawnScore])
                  tank.ws.sendPacket('death', [tankNames, respawnScore, stats])
                } else {
                  tank.ws.data.ready = false
                  args.parentPort.postMessage(['death', [tank.ws.data.uid, respawnScore, [tankNames, respawnScore, stats], tank.ws.data.lastTeam]])
                }
              }
            }
          }
        }
        tank.lx = tank.x
        tank.ly = tank.y
      }

