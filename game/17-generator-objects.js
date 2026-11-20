    bullet: function(options) {
      let barrel = options.parent._barrels[options.barrelId]
      let b = options.barrel || barrel
	    if(!barrel) {
		    return
	    }
      let bullet = {
        id: generator.getId('bullet', options.dim),
        _netFrame: -1,
        _netRow: 0,
        _netSerial: 0,
        type: barrel.data.type,
        visualType: barrel.data.visualType || barrel.data.type,
        parent: options.parent,
        sparent: options.sparent || options.parent,
        parentId: options.parent.id,
        barrelId: options.barrelId,
        barrel: barrel,
        barrels: [],
        _barrels: [],
        dim: options.dim || false,
        damageMultiplier: options.damage || 1,
        timeExisted: 0,
        target: false,
        lifeTime: options.lifeTime || 1,
        health: options.health || 125,
        maxHealth: options.health || 125,
        damage: function(amount) {
          if(amount > 0) {
            bullet.health -= amount
            if(bullet.health < 0) {
              bullet.health = 0
            }
          }
        },
        d: options.d || 0,
        x: options.x || 0,
        y: options.y || 0,
        lx: options.x || 0,
        ly: options.y || 0,
        xv: dimension.tickMultiplier * (options.xv || 0),
        yv: dimension.tickMultiplier * (options.yv || 0),
        speed: options.speed || 0,
        size: options.size * (options.sparent || options.parent).size,
        rawSize: options.size,
        remove: function() {
          if(bullet._removed) { return }
          bullet._removed = true
          if(bullet === options.parent.bullets[bullet.id]) {
            delete options.parent.bullets[bullet.id]
          }
          if(bullet.type === 2 || bullet.type === 4) {
            options.parent.droneCount --
          }
          for(let i=bullet._barrels.length-1;i>=0;i--) {
            let childArras = bullet._barrels[i].data.arras
            if(childArras && childArras.persists) { continue }
            let bullets = bullet._barrels[i].bullets
            for(let u=bullets.length-1;u>=0;u--) {
              bullets[u].remove()
            }
          }
          let index = bullet.dim.bullets.indexOf(bullet)
          if(index >= 0) {
            bullet.dim.bullets.splice(index, 1)
          }
          generator.removeId('bullet', bullet.id, bullet.dim)
          index = b.bullets.indexOf(bullet)
          if(index >= 0) {
            b.bullets.splice(index, 1)
          }
        },
      }
      if(barrel.data.type === 3 || barrel.data.type === 4 || barrel.data.bulletWeapon) {
        let weapon = barrel.data.bulletWeapon
        if(weapon) {
          bullet.barrels = []
          for(let i=0,l=weapon.barrels.length;i<l;i++) {
            let barrel = weapon.barrels[i]
            let j = -1
            for(j=options.parent._barrels.length-1;j>=0;j--) {
              if(options.parent._barrels[j].data === barrel) {
                break
              }
            }
            bullet.barrels.push({
              current: barrel.reload * 0.5 * (1 - bullet.parent.upgrades[3] / 30) * (1 - barrel.delay) - 0.1,
              bullets: [],
              data: barrel,
              id: j
            })
            if(barrel.shootOnDeath) { bullet.hasDeathBarrels = true }
          }
        }
        bullet._barrels = bullet.barrels.slice(0)
        let body = barrel.data.bulletBody
        if(body) {
          bullet.bodyData = body
          bullet.speed *= body.movementSpeed
          bullet.health *= body.maxHealth
          bullet.damageMultiplier *= body.bodyDamage
          bullet.bodyCameraSize = body.cameraSizeMultiplier
          bullet.turrets = []
          bullet.auras = []
          for(let i=0,l=body.turrets.length;i<l;i++) {
            let turret = { ...body.turrets[i], count:Math.floor(Math.random() * dimension.detectTicks) }
            turret.gameX = bullet.x
            turret.gameY = bullet.y
            turret.detector = {}
            turret.d = bullet.d
            turret.position = 'turret'
            let barrels = turret.sectionWeapon ? turret.sectionWeapon.barrels : turret.barrels || []
            turret.barrels = []
            turret.relativeSize = 1
            for(let u=0,k=barrels.length;u<k;u++) {
              let barrel = barrels[u]
              barrel.relativeSize = turret.size * 0.5
              barrel.relativeSizeS = barrel.relativeSize * ('size' in barrel ? barrel.size || 1 : 1)
              let j = -1
              for(j=options.parent._barrels.length-1;j>=0;j--) {
                if(options.parent._barrels[j].data === barrel) {
                  break
                }
              }
              let obj = {
                current: barrel.reload * 0.5 * (1 - bullet.parent.upgrades[3] / 30) * (1 - barrel.delay) - 0.1,
                bullets: [],
                data: barrel,
                turret: turret,
                active: false,
                id: j
              }
              turret.barrels.push(obj)
              bullet._barrels.push(obj)
            }
            if(turret) {
              let weapon = turret.sectionWeapon
              if(weapon) {
                turret.sectionWeapon = { ...weapon }
                turret.sectionWeapon.weaponTurrets = generator.checkWeaponTurrets(weapon, options.parent, turret.relativeSize)
              }
              let body = turret.sectionBody
              if(body) {
                turret.sectionBody = { ...body }
                turret.sectionBody.turrets = generator.checkTurrets(body, options.parent, turret.relativeSize)
              }
            }
            bullet.turrets.push(turret)
          }
          for(let i=0,l=body.auras.length;i<l;i++) {
            let aura = { ...body.auras[i] }
            aura.gameX = bullet.x
            aura.gameY = bullet.y
            aura.detector = {}
            bullet.auras.push(aura)
          }
        }
      }
      if(options.parent.physics === 'arras' && barrel.data.arras) {
        arrasPhysics.scaleBullet(bullet)
      }
      if(arrasPhysics.appliesToBullet(barrel.data, options.parent) && barrel.data.arras.family !== 'drone') {
        arrasPhysics.initBullet(bullet, barrel.data, options.parent, barrel.turret)
      } else if(options.parent.physics === 'arras' && barrel.data.arras && barrel.data.arras.orbit) {
        arrasPhysics.initOrbit(bullet, barrel.data)
      }
      b.bullets.push(bullet)
      options.parent.bullets[bullet.id] = bullet
      if(bullet.type === 2 || bullet.type === 4) {
        options.parent.droneCount ++
      }
      if(bullet.dim) {
        bullet.dim.bullets.push(bullet)
      }
      return bullet
    },
    polygon: function(data, o) {
      if(!data.dim.sandbox) {
        if(data.sides < 0) {
        } else if(data.radiant > 4) {
        }
      }
      data.sides = Math.floor(data.sides)
	    if(data.sides < -5) { return }
      if(data.radiant > 100) { data.radiant = 100 }
      if(data.sides > 50) { data.sides = 50 }
      let polygon = {
        o: o,
        objectType: 'polygon',
        id: generator.getId('polygon', data.dim),
        _netFrame: -1,
        _netRow: 0,
        _netSerial: 0,
        dim: data.dim || false,
        x: data.x || 0,
        y: data.y || 0,
        lx: data.x || 0,
        ly: data.y || 0,
        d: data.d || 0,
        xv: 0,
        yv: 0,
        alive: true,
        radiant: data.radiant || 0,
        sides: ~~(data.sides || 3),
        score: 0,
        rScore: 0,
        forceDeathScore: data.forceDeathScore >= 0 ? data.forceDeathScore : -1,
        health: 0,
        maxHealth: 0,
        regenTime: 1,
        removeTime: 0,
        size: 0,
        finalDamage: {
          tanks: {}
        },
        onDeath: data.onDeath || false,
        damage: function(amount, object, type) {
          if(amount > 0) {
            polygon.removeTime = 0
            polygon.health -= amount
            if(polygon.health < 0) {
              polygon.health = 0
            }
            polygon.regenTime = 0
            let obj = polygon.finalDamage[type]
            if(obj) {
              if(!obj[object.id]) {
                obj[object.id] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, amount]
              } else {
                obj[object.id][15] += amount
              }
            }
          }
        },
        remove: function() {
          polygon.alive = false
          let index = polygon.dim.polygons.indexOf(polygon)
          if(index >= 0) {
            polygon.dim.polygons.splice(index, 1)
          }
          generator.removeId('polygon', polygon.id, polygon.dim)
        },
        update: function() {
          if(polygon.sides < 0) { return }

          if(polygon.score < 250) { polygon.score = 250 }
          polygon.displayScore = polygon.score * dimension.getRadiantMultiplier(polygon.radiant)
          let sides = generator.getSides(polygon.score)
          let s = Math.floor(polygon.dim.maxPolygonSides)
          if(s < 3) { s = 3 }
          if(sides > s) { sides = s }
          if(sides !== polygon.sides) {
            polygon.sides = sides
            polygon.size = generator.getPolygonSize(polygon.sides);
            let maxHealth = generator.getPolygonHealth(polygon.sides)
            polygon.speed = dimension.tickMultiplier * generator.getPolygonSpeed(polygon.sides)
            polygon.health *= maxHealth / polygon.maxHealth
            polygon.maxHealth = maxHealth
          }
        }
      }
      if(polygon.sides < 0) {
        polygon.score = 1000000000 * Math.pow(3, -polygon.sides - 1)
      } else {
        polygon.score = 250 + 1000 * (Math.pow(4, polygon.sides - 3) - 1) / 3
      }
      polygon.displayScore = polygon.score * dimension.getRadiantMultiplier(polygon.radiant)
      polygon.rScore = polygon.score

      polygon.size = generator.getPolygonSize(polygon.sides)
      polygon.speed = dimension.tickMultiplier * generator.getPolygonSpeed(polygon.sides)
      polygon.health = polygon.maxHealth = generator.getPolygonHealth(polygon.sides)
      if(polygon.dim) {
        polygon.dim.add('polygons', polygon)
      }
      return polygon
    },
    getPolygonSize: function(sides) {
      if(sides >= 3) {
        return 20 * Math.pow(1.5, sides - 3)
      } else {
        return 50 * Math.pow(1.4, -sides - 1)
      }
    },
    getPolygonSpeed: function(sides) {
      if(sides >= 3) {
        return Math.pow(0.6, sides - 3)
      } else {
        return 0.5 * Math.pow(0.4, -sides - 1)
      }
    },
    getPolygonHealth: function(sides) {
      if(sides >= 3) {
        return 15 * Math.pow(3.5, sides - 3)
      } else {
        return 50000 * Math.pow(2, -sides - 1)
      }
    },
    wormholeLifeMs: function(w) {
      if(w.type >= 2) { return -1 }
      let r = dimension.tickMultiplier * 0.01 / (w.tickMs || dimension.tickMs), t = Math.max(0, w.time)
      return Math.round(t >= 10 ? (t - 10) / (r * (1 + (w.number || 1))) + 10 / r : t / r)
    },
    wormhole: function(data) {
      let s = (data.size || 75)
      let wormhole = {
        id: data.dim ? (data.dim.nextWormholeId = (data.dim.nextWormholeId || 0) + 1) - 1 : 0,
        static: data.static ? true : false,
        dim: data.dim || false,
        type: data.type || 0,
        color: data.color >= 0 ? data.color : 8,
        radiant: data.radiant >= 0 || data.radiant <= 0 ? data.radiant : (data.type === 0 ? 0 : 1),
        x: data.x || 0,
        y: data.y || 0,
        objects: {},
        _objects: {},
        time: data.time || 30,
        fadeTime: 0,
        action: data.action || function() {},
        onRupture: data.onRupture,
        ruptured: data.ruptured || false,
        entries: 0,
        contents: 0,
        size: s,
        defaultSize: s * s,
        removed: false,
        remove: function() {
          wormhole.removed = true
          if(wormhole.dim.wormholes[wormhole.id] === wormhole) {
            delete wormhole.dim.wormholes[wormhole.id]
          }
          wormhole.dim.removedWormholes[wormhole.id] = wormhole
        },
        rupture: function() {
          if(!wormhole.ruptured) {
            wormhole.ruptured = true
            wormhole.time = 30 + 20 * Math.random(),
            wormhole.fadeTime = 0
            wormhole.dim.rupturedWormholes[wormhole.id] = wormhole
            wormhole.dim.resizedWormholes[wormhole.id] = wormhole
            if(wormhole.onRupture) {
              wormhole.onRupture(wormhole)
            }
          }
        }
      }
      if(wormhole.dim) {
        wormhole.dim.wormholes[wormhole.id] = wormhole
        wormhole.dim.addedWormholes[wormhole.id] = wormhole
      }
      return wormhole
    },
    bossIds: function() {
      return Object.keys(tankData.bodies).filter(k => tankData.bodies[k].boss && tankData.weapons[k])
    },
    findBoss: function(name) {
      let ids = generator.bossIds(), n = String(name || 'random').toLowerCase().replace(/^boss:/, '')
      if(n === 'random') { return generator.randomBoss(ids) }
      if(ids.indexOf('boss:' + n) >= 0) { return 'boss:' + n }
      let family = ids.filter(k => tankData.bodies[k].boss.family === n)
      if(family.length) { return family[Math.floor(Math.random() * family.length)] }
      let named = ids.filter(k => tankData.bodies[k].boss.name.toLowerCase().replace(/ /g, '') === n)
      return named[0] || false
    },
    randomBoss: function(ids) {
      ids = ids || generator.bossIds()
      let weights = [5, 4, 3, 2, 1], total = 0
      for(let id of ids) { total += weights[tankData.bodies[id].boss.rank] }
      let r = Math.random() * total
      for(let id of ids) {
        r -= weights[tankData.bodies[id].boss.rank]
        if(r < 0) { return id }
      }
      return ids[0] || false
    },
    boss: function(dim, id, x, y) {
      let info = tankData.bodies[id].boss
      let boss = generator.tank({
        dim: dim,
        x: x,
        y: y,
        name: info.name,
        weapon: id,
        body: id,
        score: info.score,
        radiant: 0,
        team: 8,
        invincible: false,
        ai: function() {
          let target = false, best = 2500 * 2500
          for(let i=dim.tanks.length-1;i>=0;i--) {
            let t = dim.tanks[i]
            if(t === boss || t.team === boss.team || t.static || !t.alive) { continue }
            let dx = t.x - boss.x, dy = t.y - boss.y
            let d = dx * dx + dy * dy
            if(d < best) {
              best = d
              target = t
            }
          }
          let hx = boss.x - x, hy = boss.y - y
          let home = hx * hx + hy * hy > 3000 * 3000
          let gx = target && !home ? target.x : x
          let gy = target && !home ? target.y : y
          let dx = gx - boss.x, dy = gy - boss.y
          let dist = Math.sqrt(dx * dx + dy * dy)
          if(target) {
            boss.d = dimension.averageAngles(boss.d, Math.atan2(-(target.x - boss.x), target.y - boss.y), dimension.smooth(2))
          }
          boss.firing = target ? true : false
          if(dist > (target && !home ? 500 : 150)) {
            boss.input.movement = [dx / dist, dy / dist]
          } else {
            boss.input.movement = [0, 0]
          }
        }
      })
      boss.boss = true
      return boss
    },
  }

