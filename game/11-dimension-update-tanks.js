      let fovs = [], celestials = [], players = 0
      for(let i=dim.tanks.length-1;i>=0;i--) {
        let tank = dim.tanks[i]

        tank.timeExisted += dimension.tickTime

        if(!(tank.score >= 0)) {
          tank.score = 0
          tank.rScore = 0
          tank.update()
          tank.dim.updatedTanks[tank.id] = tank
        } if(!tank.xv) {
          tank.xv = 0
        } if(!tank.yv) {
          tank.yv = 0
        } if(!tank.x) {
          tank.x = 0
        } if(!tank.y) {
          tank.y = 0
        } if(!tank.d) {
          tank.d = 0
        }
	      if(tank.celestial) { celestials.push(tank) }
	      if(tank.ws && tank.ws.data && tank.ws.data.isPlayer) { players ++ }

        if(tank.ai && typeof tank.ai === 'function') {
          try {
            tank.ai({
              now: now,
              options: options
            })
          } catch(e) {}
        }
        if(!tank.regen || tank.regen < 1) {
          tank.regen = 1
        }
        if(tank.regenTime < 1) {
          let totalTime = 25 - tank.upgrades[6] / 1.4
          tank.regenTime += dimension.tickMultiplier * 0.01 / totalTime * (tank.regenTime > 0.75 ? 1 : (1 + 0.3 * (tank.regen - 1)))
          if(tank.regenTime > 1) {
            tank.regenTime = 1
          }
        } else {
          if(tank.health < tank.maxHealth) {
            let totalTime = 25 - tank.upgrades[6] / 2
            tank.health += dimension.tickMultiplier * tank.maxHealth * 0.01 / totalTime * (1 +  0.3 * (tank.regen - 1))
            if(tank.health > tank.maxHealth) {
              tank.health = tank.maxHealth
            }
          }
        }
        tank.regen = 1
        tank.bodyDamageMultiplier = (1 + tank.upgrades[5] / 15)
        let maxHealth = 800 * tank.levelMultiplier * tank.maxHealthMultiplier * (tank.celestial ? 4 : 1) * (1 + tank.upgrades[7] / 22.5)
        if(maxHealth != tank.maxHealth) {
          tank.setMaxHealth(maxHealth)
        }

        tank.mousePosition[0] = tank.x + tank.controlPosition[0]
        tank.mousePosition[1] = tank.y + tank.controlPosition[1]
        tank.smoothMousePosition[0] = (tank.smoothMousePosition[0] + tank.mousePosition[0]) / 2
        tank.smoothMousePosition[1] = (tank.smoothMousePosition[1] + tank.mousePosition[1]) / 2
        dimension.collideMatrix(tank)
        if(tank.dragTarget) {
          for(let i=tank.dragTarget.length-1;i>=0;i--) {
            let o = tank.dragTarget[i]
            if(!o.static) {
              o.x = tank.mousePosition[0]
              o.y = tank.mousePosition[1]
            }
          }
        } if(dim.wallEdit) {
          let x = tank.smoothMousePosition[0]
          let y = tank.smoothMousePosition[1]
          if(x > dim.mapSize) { x = dim.mapSize }
          if(x < -dim.mapSize) { x = -dim.mapSize }
          if(y > dim.mapSize) { y = dim.mapSize }
          if(y < -dim.mapSize) { y = -dim.mapSize }
          x = x > 0 ? -Math.floor(1 - x / 50) : Math.floor(x / 50)
          y = y > 0 ? -Math.floor(1 - y / 50) : Math.floor(y / 50)
          if(tank.wallEdit === 1) {
            dim.addWall(x, y)
          } else if(tank.wallEdit === 2) {
            dim.removeWall(x, y)
          }
        } if(tank.dragWall) {
          let w = tank.dragWall
          let x = tank.mousePosition[0], y = tank.mousePosition[1]
          let j = 2
          if(tank.dragWallSnap) {
            x = Math.round(x / 50) * 50
            y = Math.round(y / 50) * 50
            j = 0.8
          }
          if(w[0] !== x || w[1] !== y) {
            w[0] = Math.round((w[0] * j + x) / (j + 1))
            w[1] = Math.round((w[1] * j + y) / (j + 1))
            let i = dim.walls.indexOf(w)
            if(i >= 0) {
              dim.updatedWalls[i] = w
            } else {
              tank.dragWall = false
            }
          }
        }
        if(options.updateFinalDamage) {
          tank.finalDamage.tanks = generator.updateFinalDamage(tank.finalDamage.tanks)
          tank.finalDamage.polygons = generator.updateFinalDamage(tank.finalDamage.polygons)
        }

        tank.x += tank.xv
        tank.y += tank.yv
        if(tank.invincibleTime) {
          if(tank.invincibleTime > now) {
		  if(tank.firing) {
			  if(tank.invincibleTime - now > 3000) {
				  tank.invincibleTime = now + 3000
			  }
		  } else if(tank.input.movement[0] || tank.input.movement[1]) {
              if(tank.invincibleTime - now > 5000) {
                tank.invincibleTime = now + 5000
              }
            }
          } else {
            tank.invincibleTime = false
            tank.invincible = false
          }
        }

        let sm = tank.celestial ? (tank.size > 80 ? 10 / (tank.size * 0.75 - 50) : 1) * 0.7 : (tank.size > 30 ? 10 / (tank.size * 0.75 - 12.5) : 1)
        if(tank.celestial && sm > 0.08) {
          sm = 0.08
        }
        let speed = tank.speed * dimension.tickMultiplier * 0.14 * sm * (1 + tank.upgrades[4] * 0.1) * tank.movementSpeed
        let p = dim.friction ? 0.9409 : 1
        if(tank.friction !== 1) {
          if(tank.friction < 1) {
            p = 1 - (1 - p) * tank.friction
          } else {
            p = p / tank.friction
          }
        }
        p = Math.pow(p, dimension.per50)
        if(dim.sizeScale !== 1.01) {
          speed *= Math.pow(dim.sizeScale / 1.01, tank.level)
        }

        if(tank.physics === 'arras') {
          arrasPhysics.move(tank)
          if(!tank.static) { arrasPhysics.applyRecoil(tank) }
        } else {
          tank.xv = tank.xv * p + dimension.tickMultiplier * tank.input.movement[0] * speed
          tank.yv = tank.yv * p + dimension.tickMultiplier * tank.input.movement[1] * speed
        }
        arrasPhysics.updateStealth(tank)
        if(options.recordDirection) {
          tank._d.push((Math.round(tank.d / Math.PI * 1000) % 2000 + 2000) % 2000)
        }

        let checkFOV = (tank.static ? false : true) && (!tank.fullFov) && !!(tank.ws && tank.ws.data && tank.ws.data.isPlayer)
        let object = tank.collideObject = tank.collideObject || {}
        object.x = tank.x
        object.y = tank.y
        object.size = object.w = object.h = tank.size
        object.object = tank
        object.type = 'tank'
        object.noCollide = tank.noHitBox
        objects.push(object)
        tank.fovMultiplier = Math.sqrt(tank.size / 75) * tank.weaponCameraSize * tank.bodyCameraSize
        let viewObject = tank.viewObject = tank.viewObject || {}
        viewObject.x = tank.x
        viewObject.y = tank.y
        viewObject.size = tank.size * (tank.codeState ? Math.max(1.5, tank.codeState.reach) : 1.5) + 200
        viewObject.object = tank
        viewObject.type = 'bullet'
        viewObject.str = 'tanks'
        viewObjects.push(viewObject)
        if(checkFOV) {
          let fovObject = tank.fovObject = tank.fovObject || {}
          fovObject.x = tank.x
          fovObject.y = tank.y
          let m = tank.fovMultiplier
          fovObject.w = 1920 * m
          fovObject.h = 1080 * m
          fovObject.object = tank
          fovObject.type = 'fov'
          let fov = fovObject.fov = fovObject.fov || {}
          fov.tanks = {}
          fov.polygons = {}
          fov.bullets = {}
          viewObjects.push(fovObject)
          fovs.push(fovObject)
        }
        if(1) {
          let object = tank.detectObject = tank.detectObject || {}
          object.x = tank.x
          object.y = tank.y
          object.size = 300 + tank.size * tank.range
          object.object = tank
          object.type = 'detectEnemies'
          object.parent = tank
          object.objects = []
          object.distances = []
          object.closest = false
          object.closestObject = false
          object.closestTank = false
          object.closestTankDistance = false
          object.closestBullet = false
          object.closestBulletDistance = false
          object.possible = []
          tank.detector = object
          objects.push(object)
        } else {
          tank.detector = false
        }
        let sin = Math.sin(tank.d)
        let cos = Math.cos(tank.d)

        let getPosition = function(_tank, turret, m) {
          let sin = Math.sin(_tank.d), cos = Math.cos(_tank.d)
          let x = m ? _tank.gameX : tank.x
          let y = m ? _tank.gameY : tank.y
          let size = m ? turret.relativeSize * tank.size : tank.size
          return [x + size * (turret.x * cos + turret.y * sin), y - size * (turret.y * cos - turret.x * sin)]
        }
        let checkTurretList = function(tank, list, m) {
          for(let i=0,l=list.length;i<l;i++) {
            let t = list[i]
            let p = getPosition(tank, t, m)
            t.gameX = p[0]
            t.gameY = p[1]
            if(t) {
              let weapon = t.sectionWeapon
              if(weapon) {
                checkTurretList(t, t.sectionWeapon.weaponTurrets, 1)
              }
              let body = t.sectionBody
              if(body) {
                checkTurretList(t, t.sectionBody.turrets, 1)
              }
            }
          }
        }
        checkTurretList(tank, tank.weaponTurrets)
        checkTurretList(tank, tank.turrets)
        for(let u=0,k=tank._turrets.length;u<k;u++) {
          let turret = tank._turrets[u]
          if(!turret.rotationType) {
            stats.detect.turretsTotal ++
            if(!(turret.count >= 0) || turret.count >= dimension.detectTicks - 1) {
              turret.count = 0
            } else {
              turret.count ++
              continue
            }
            let object = {
              x: turret.gameX,
              y: turret.gameY,
              d: tank.d + (turret.angle >= 0 || turret.angle <= 0 ? turret.angle : 0),
              range: turret.angleRange,
              size: (tank.size * 10 * turret.size + 400) * (turret.detectRange >= 0 ? turret.detectRange : 1),
              object: turret,
              type: 'detectEnemies',
              parent: tank,
              objects: [],
              distances: [],
              closest: false,
              closestObject: false,
              closestTank: false,
              closestTankDistance: false,
              closestBullet: false,
              closestBulletDistance: false,
              possible: [],
            }
		        stats.detect.turrets ++
            turret.detector = object
            objects.push(object)
          } else {
            turret.detector = {}
          }
        }
        for(let u=0,k=tank.auras.length;u<k;u++) {
          let aura = tank.auras[u]
          aura.gameSize = tank.size * aura.auraSize
          stats.detect.aurasTotal ++
          let r = false
          if(!(aura.counter >= 0) || aura.counter >= dimension.detectTicks - 1) {
            aura.counter = 0
            r = true
          } else {
            aura.counter ++
            continue
          }
          if(tank.passive === false && ((!aura.detector || !aura.detector.objects) || r)) {
		        stats.detect.auras ++
            let object = {
              x: tank.x + tank.size * (aura.x * cos + aura.y * sin),
              y: tank.y - tank.size * (aura.y * cos - aura.x * sin),
              size: aura.gameSize,
              object: aura,
              type: 'detectEnemies',
              parent: tank,
              objects: [],
              distances: [],
              closest: false,
              closestObject: false,
              closestTank: false,
              closestTankDistance: false,
              closestBullet: false,
              closestBulletDistance: false,
              possible: [],
            }
            if(aura.type === 2) {
              object.bullets = true
            } else if(aura.type === 1) {
              object.type = 'detectFriends'
            } else if(aura.type !== 0) {
              continue
            }
            let viewObject = {
              x: object.x,
              y: object.y,
              size: object.size * 1.5 + 200,
              object: aura,
              type: 'bullet',
              parent: tank,
            }
            aura.detector = object
            aura.gameX = object.x
            aura.gameY = object.y
            objects.push(object)

          }
        }
      }

	    if((dim.type === '2teams' || dim.type === '4teams' && dim.isMain) && celestials.length === 1 && celestials[0] && players.length >= 13) {
		    let c = celestials[0]
		    c.loneSurvivorTime += dimension.tickTime
		    let data = c.ws.accountData
		    if(data) {
			    data.loneSurvivorTime += dimension.tickTime
			    if(!data.achievements[23] && c.loneSurvivorTime >= 600) {
				    let t = data.achievements[23] = createAchievement(23)
				    sendAchievement(c, t)
			    }
		    }
	    }
