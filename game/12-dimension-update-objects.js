      for(let i=dim.bullets.length-1;i>=0;i--) {
        let bullet = dim.bullets[i], tank = bullet.parent
        bullet.x += bullet.xv
        bullet.y += bullet.yv
        let sin = Math.sin(bullet.d)
        let cos = Math.cos(bullet.d)
        if(bullet.arrasTop >= 0) {
          arrasPhysics.glide(bullet)
        } else if((bullet.type === 1 || bullet.type === 2 || bullet.type === 3 || bullet.type === 4) && dim.friction) {
          if(!dim.noFriction) {
            bullet.xv *= dimension.power97
            bullet.yv *= dimension.power97
          }
        }
        dimension.collideMatrix(bullet)
        let object = bullet.collideObject = bullet.collideObject || {}
        object.x = bullet.x
        object.y = bullet.y
        object.size = object.w = object.h = bullet.size
        object.object = bullet
        object.type = 'bullet'
	      objects.push(object)
        let viewObject = bullet.viewObject = bullet.viewObject || {}
        viewObject.x = bullet.x
        viewObject.y = bullet.y
        viewObject.size = bullet.size * 1.5 + 200
        viewObject.object = bullet
        viewObject.type = 'bullet'
        viewObject.str = 'bullets'
        viewObjects.push(viewObject)
        if(bullet.auras) {
          for(let u=0,k=bullet.auras.length;u<k;u++) {
            let aura = bullet.auras[u]
            aura.gameSize = bullet.size * aura.auraSize
		  let r = false
		  stats.detect.aurasTotal ++
		  if(!(aura.counter >= 0) || aura.counter >= dimension.detectTicks - 1) {
			  r = true
			  aura.counter = 0
		  } else {
			  aura.counter ++
			  continue
		  }
            if(tank.passive === false && ((!aura.detector || !aura.detector.objects) || r)) {
		    stats.detect.auras ++
              let object = {
                x: bullet.x + bullet.size * (aura.x * cos + aura.y * sin),
                y: bullet.y - bullet.size * (aura.y * cos - aura.x * sin),
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
        bullet.timeExisted += dimension.tickMultiplier * 0.01
        if(!bullet.dying && ((bullet.timeExisted > bullet.lifeTime && bullet.type !== 2 && bullet.type !== 4) || !(bullet.health > 0))) {
          if(bullet.hasDeathBarrels) {
            bullet.dying = true
          } else {
            bullet.remove()
          }
        }
        if(bullet.turrets && bullet.turrets[0]) {
          for(let u=0,k=bullet.turrets.length;u<k;u++) {
            let turret = bullet.turrets[u]
		  stats.detect.turretsTotal ++
		  if(!(turret.count >= 0) || turret.count >= dimension.detectTicks - 1) {
			  turret.count = 0
		  } else {
			  turret.count ++
			  continue
		  }

            let object = {
              x: bullet.x - bullet.size * (turret.x * cos + turret.y * sin),
              y: bullet.y + bullet.size * (turret.y * cos - turret.x * sin),
              size: bullet.size * 10 * turret.size + 400,
              object: turret,
              type: 'detectEnemies',
              parent: bullet.parent,
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
            turret.detector = object
            turret.gameX = object.x
            turret.gameY = object.y
            objects.push(object)
          }
        }
      }
      const wake = dim.wakeBoxes || (dim.wakeBoxes = [])
      wake.length = 0
      const freeze = !dim.noFreeze
      if(freeze) {
        const FREEZE_MARGIN = 800
        for(let i=dim.tanks.length-1;i>=0;i--) {
          const t = dim.tanks[i]
          if(t.ws && t.ws.data && t.ws.data.isPlayer) {
            const m = t.fovMultiplier > 0 ? t.fovMultiplier : 1
            wake.push(t.x, t.y, 1920 * m + FREEZE_MARGIN, 1080 * m + FREEZE_MARGIN)
          }
        }
        const specs = dim.spectators || []
        for(let i=specs.length-1;i>=0;i--) {
          const m = specs[i].fovMultiplier > 0 ? specs[i].fovMultiplier : 1
          wake.push(specs[i].x, specs[i].y, 1920 * m + FREEZE_MARGIN, 1080 * m + FREEZE_MARGIN)
        }
      }
      let frozenCount = 0
      const awakeFlags = freeze ? View.awake(dim.polygons, wake) : null
      for(let i=dim.polygons.length-1;i>=0;i--) {
        let polygon = dim.polygons[i]
        if(options.gameUpdate) {
          polygon.finalDamage.tanks = generator.updateFinalDamage(polygon.finalDamage.tanks)
        }
        if(freeze) {
          let awake = false
          if(awakeFlags) {
            awake = awakeFlags[i] === 1
          } else {
            for(let k=0,l=wake.length;k<l;k+=4) {
              if(Math.abs(polygon.x - wake[k]) < wake[k + 2] + polygon.size && Math.abs(polygon.y - wake[k + 1]) < wake[k + 3] + polygon.size) { awake = true; break }
            }
          }
          polygon.frozen = !awake
          if(!awake) {
            frozenCount ++
            polygon.removeTime ++
            if(polygon.removeTime >= dimension.tickRate * 600 && polygon.health >= polygon.maxHealth) {
              polygon.remove()
            }
            continue
          }
        }
        if(polygon.regenTime < 1) {
          polygon.regenTime += dimension.tickMultiplier * 0.02 / (9 + Math.abs(polygon.sides) * 2)
          if(polygon.regenTime > 1) {
            polygon.regenTime = 1
          }
        } else {
          if(polygon.health < polygon.maxHealth) {
            let sides = polygon.sides >= 3 ? polygon.sides : 10 - polygon.sides
            polygon.health += dimension.tickMultiplier * polygon.maxHealth * 0.004 / (sides * sides * 0.1 - 0.15)
            if(polygon.health > polygon.maxHealth) {
              polygon.health = polygon.maxHealth
            }
          }
        }
        polygon.x += polygon.xv
        polygon.y += polygon.yv
        if(dim.friction) {
          polygon.xv *= dimension.power97
          polygon.yv *= dimension.power97
        }
        let speed = dimension.tickMultiplier * 0.005 * polygon.speed
        polygon.d += speed * dimension.per50
        if(polygon.d >= 2 * Math.PI) {
          polygon.d -= 2 * Math.PI
        }
        speed *= 8
        polygon.xv += Math.sin(polygon.d) * speed
        polygon.yv -= Math.cos(polygon.d) * speed
        dimension.collideMatrix(polygon)
        let object = polygon.collideObject = polygon.collideObject || { object: polygon, type: 'polygon' }
        object.x = polygon.x
        object.y = polygon.y
        object.size = object.w = object.h = polygon.size
        let viewObject = polygon.viewObject = polygon.viewObject || { object: polygon, type: 'bullet', str: 'polygons' }
        viewObject.x = polygon.x
        viewObject.y = polygon.y
        viewObject.size = polygon.size * 1.5 * (1 + (polygon.radiant > 0 ? polygon.radiant * 0.2 : 0)) + 200
        objects.push(object)
        viewObjects.push(viewObject)
        polygon.removeTime ++

        if(polygon.removeTime >= dimension.tickRate * 600 && polygon.health >= polygon.maxHealth) {
          polygon.remove()
        }
      }
      dim.frozenPolygons = frozenCount
      let wallList = [], wallSig = 0, wallNew = false
      for(let i=dim.walls.length-1;i>=0;i--) {
        let wall = dim.walls[i]
        if(!wall) { continue }
        if(wall[5]) {
          let options = wall[5]
          if(options.noHitBox) {
            continue
          }
        }
        let object = wallCollideObjects.get(wall)
        if(!object) {
          object = { type: 'wall', rectangular: true, object: {} }
          wallCollideObjects.set(wall, object)
          wallNew = true
        }
        object.x = wall[0]
        object.y = wall[1]
        object.w = wall[2]
        object.h = wall[3]
        object.object.team = wall[4] || -1
        object.noInvincibility = wall[5] ? wall[5].noInvincibility : false
        objects.push(object)
        wallList.push(object)
        wallSig = (wallSig * 31 + wall[0] * 3 + wall[1] * 5 + wall[2] * 7 + wall[3] * 11 + object.object.team) % 1000000007
      }
      wallSig = wallSig * 1000 + wallList.length
      if(wallNew || wallSig !== dim.wallCornerSig) {
        dim.wallCornerSig = wallSig
        dimension.wallCorners(wallList)
      }
      for(let i=dim.gates.length-1;i>=0;i--) {
        let gate = dim.gates[i], w, h

        if(gate[3] === 0 || gate[3] === 2) {
          w = 30
          h = gate[4]
        } else {
          w = gate[4]
          h = 30
        }
        let object = {
          gateType: gate[0],
          x: gate[1],
          y: gate[2],
          d: gate[3],
          noClip: true,
          object: gate,
          w: w,
          h: h,
          type: 'gate',
          rectangular: true
        }
        objects.push(object)
      }
      for(let i in dim.wormholes) {
        let wormhole = dim.wormholes[i]
        if(wormhole.type < 2) {
          let number = Object.keys(wormhole._objects).length + 1
          let now = _performance.now()
          if(wormhole.lastTick > 0) {
            let dt = now - wormhole.lastTick
            if(dt > 0 && dt < 1000) { wormhole.tickMs = wormhole.tickMs ? wormhole.tickMs * 0.97 + dt * 0.03 : dimension.tickMs }
          }
          wormhole.lastTick = now
          if(number !== wormhole.number || !(now - wormhole.lifeSent < 1000)) {
            wormhole.number = number
            wormhole.lifeSent = now
            dim.resizedWormholes[wormhole.id] = wormhole
          }

          if(wormhole.time < 10) {
            wormhole.time -= dimension.tickMultiplier * 0.01
          } else {
            wormhole.time -= dimension.tickMultiplier * 0.01 * (1 + number)
          }
          if(wormhole.time < 0) {
		        let celestials = []
            for(let i in wormhole._objects) {
		          let tank = wormhole._objects[i]
              wormhole.action(tank)
		          if(tank.celestial) { celestials.push(tank) }
            }
            if(dim.type === 'sanctuary' && celestials.length >= 6) {
              for(let i=celestials.length-1;i>=0;i--) {
                let tank = celestials[i]
                let data = tank.ws.accountData
                if(data) {
                  setTimeout(function() {
                    let t = data.achievements[14] = createAchievement(14)
                    sendAchievement({
                      ws: {
                        accountName: tank.ws.accountName
                      },
                      dim: tank.dim
                    }, t)
                  }, 5000)
                }
              }
            }
            wormhole.remove()
            continue
          }
          if(wormhole.time < 10) {
            wormhole.fadeTime = (10 - wormhole.time) / 10
            dim.fadeTimeChanges[wormhole.id] = wormhole
          }
        } else {
          wormhole.time = 0
        }
        let object = {
          x: wormhole.x,
          y: wormhole.y,
          object: wormhole,
          objects: {},
          size: wormhole.size,
          type: 'wormhole',
        }
        wormhole._objects = {}
        objects.push(object)
      }
      for(let i=objects.length-1;i>=0;i--) {
        let object = objects[i]
        let target = object.object
        if(object.type === 'tank') {
          target.fov.tanks = dim.tanks
          target.fov.bullets = dim.bullets
          target.fov.polygons = dim.polygons
          target.fovVisible = null
        }
      }
      dim.objectLength = objects.length
      try {
        Detector.detectCollisions(objects, function(objectA, objectB, data) {
          dimension.collide(objectA, objectB, data)
        }, dim.mapSize)
      } catch(e) { return dimension.collisionFailed(dim, e) }
      if(options.netUpdate && dim.spectators && dim.spectators.length) {
        for(let i=dim.spectators.length-1;i>=0;i--) {
          const s = dim.spectators[i]
          spectate.follow(s)
          const f = s.fovObject || (s.fovObject = { type: 'fov', object: s, fov: {} })
          f.x = s.x
          f.y = s.y
          f.w = 1920 * s.fovMultiplier
          f.h = 1080 * s.fovMultiplier
          f.fov.tanks = {}
          f.fov.polygons = {}
          f.fov.bullets = {}
          s.fov.tanks = dim.tanks
          viewObjects.push(f)
          fovs.push(f)
        }
      }
      if(options.netUpdate && fovs.length > 0 && !View.collect(viewObjects, dim.mapSize)) {
        View.detectCollisions(viewObjects, function(objectA, objectB, data) {
          if(objectB.type === 'fov') {
            [objectA, objectB] = [objectB, objectA]
          } if(objectA.type === 'fov') {
            let fov = objectA.fov
            let c = objectB.object
            if(objectB.type === 'bullet') {
              fov[objectB.str][c.id] = c
            }
          }
        }, dim.mapSize)
        for(let i=fovs.length-1;i>=0;i--) {
          let f = fovs[i]
          let o = f.object

          o.fov.bullets = Object.values(f.fov.bullets)
          o.fov.polygons = Object.values(f.fov.polygons)
          o.fovVisible = f.fov.tanks
        }
      }
      for(let i in dim.wormholes) {
        let wormhole = dim.wormholes[i]
        let objects = wormhole._objects
        if(wormhole.type < 2) {
          let contents = 0
          for(let i in objects) {
            let s = objects[i].size
            contents += s * s * 2
            if(!(i in wormhole.objects)) {
              if(!wormhole.ruptured && Math.random() < 0.03 + wormhole.entries * 0.07) {
                wormhole.rupture()
                dim.fadeTimeChanges[wormhole.id] = wormhole
              }
              wormhole.entries ++
            }
          }
          wormhole.objects = wormhole._objects
          if(contents !== wormhole.contents) {
            wormhole.contents = contents

            wormhole.size = Math.sqrt(wormhole.defaultSize + contents)
            dim.resizedWormholes[wormhole.id] = wormhole
          }
        } else {
          for(let i in objects) {
            let t = objects[i]

            if(!(i in wormhole.objects)) {
              if(t.team >= 0) {
                wormhole.action(t)
                wormhole.color = t.team
                wormhole.radiant = t.radiant || 0
                dim.updatedPortals[wormhole.id] = wormhole
              }
            }
          }
          wormhole.objects = wormhole._objects
        }
      }
