  const generator = {
    idPool: function(dim, name) {
      let pool = dim.ids[name]
      if(!pool || Array.isArray(pool)) {
        pool = dim.ids[name] = { next: 0, used: new Set(), free: [], pending: [], pendingHead: 0 }
      }
      return pool
    },
    idHeapPush: function(heap, v) {
      let i = heap.length
      heap.push(v)
      while(i > 0) {
        let p = (i - 1) >> 1
        if(heap[p] <= v) { break }
        heap[i] = heap[p]
        i = p
      }
      heap[i] = v
    },
    idHeapPop: function(heap) {
      let top = heap[0], last = heap.pop()
      let n = heap.length
      if(n > 0) {
        let i = 0
        while(true) {
          let l = 2 * i + 1
          if(l >= n) { break }
          let r = l + 1
          let c = (r < n && heap[r] < heap[l]) ? r : l
          if(heap[c] >= last) { break }
          heap[i] = heap[c]
          i = c
        }
        heap[i] = last
      }
      return top
    },
    getId: function(name, dim) {
      let pool = generator.idPool(dim, name)
      let now = _performance.now()
      let pending = pool.pending
      while(pool.pendingHead < pending.length && pending[pool.pendingHead][0] <= now) {
        let id = pending[pool.pendingHead][1]
        pool.pendingHead ++
        if(pool.used.has(id)) {
          pool.used.delete(id)
          generator.idHeapPush(pool.free, id)
        }
      }
      if(pool.pendingHead > 1024 && pool.pendingHead * 2 > pending.length) {
        pool.pending = pending.slice(pool.pendingHead)
        pool.pendingHead = 0
      }
      let id = pool.free.length > 0 ? generator.idHeapPop(pool.free) : pool.next ++
      pool.used.add(id)
      return id
    },
    removeId: function(name, id, dim) {
      generator.idPool(dim, name).pending.push([_performance.now() + 5000, id])
    },
    updateTank: function(tank) {
      tank._barrels = []
      let check = function(barrel) {
        tank._barrels.push(barrel)
        if(barrel.data.type === 1 || barrel.data.type === 3) {
          barrel.maxTraps = barrel.data.maxChildren > 0 ? barrel.data.maxChildren - 1 : 24 / barrel.data.reload * barrel.data.time
        }
        let size = barrel.data.relativeSizeS >= 0 ? barrel.data.relativeSizeS * barrel.data.width : barrel.data.width
        if(barrel.data && (barrel.data.type === 3 || barrel.data.type === 4 || barrel.data.bulletWeapon)) {
          let weapon = barrel.data.bulletWeapon
          if(weapon) {
            for(let i=0,l=weapon.barrels.length;i<l;i++) {
              let barrel = weapon.barrels[i]
              barrel.relativeSize = size
              barrel.relativeSizeS = size * ('size' in barrel ? barrel.size || 1 : 1)
              check({
                data: barrel,
                child: true
              })
            }
          }
          let body = barrel.data.bulletBody
          if(body) {
            for(let i=0,l=body.turrets.length;i<l;i++) {
              let source = body.turrets[i]
              let turret = source
              let barrels = source.sectionWeapon ? source.sectionWeapon.barrels : source.barrels || []
              for(let u=0,k=barrels.length;u<k;u++) {
                let barrel = barrels[u]
                barrel.relativeSize = size * turret.size
                barrel.relativeSizeS = barrel.relativeSize * ('size' in barrel ? barrel.size || 1 : 1)
                check({
                  data: barrel,
                  turret: turret,
                  child: true
                })
              }
            }
          }
        }
      }
      for(let i=0,l=tank.barrels.length;i<l;i++) {
        let barrel = tank.barrels[i]
        check(barrel)
      }
      tank._turrets = []
      let checkTurret = function(t) {
        tank._turrets.push(t.count >= 0 ? t : { ...t, count:Math.floor(Math.random() * dimension.detectTicks) })
        let weapon = t.sectionWeapon
        if(weapon && weapon.weaponTurrets) {
          for(let i=0,l=weapon.weaponTurrets.length;i<l;i++) {
            checkTurret(weapon.weaponTurrets[i])
          }
        }
        let body = t.sectionBody
        if(body && body.turrets) {
          for(let i=0,l=body.turrets.length;i<l;i++) {
            checkTurret(body.turrets[i])
          }
        }
      }
      if(tank.weaponTurrets) {
        for(let i=0,l=tank.weaponTurrets.length;i<l;i++) {
          checkTurret(tank.weaponTurrets[i])
        }
      }
      if(tank.turrets) {
        for(let i=0,l=tank.turrets.length;i<l;i++) {
          checkTurret(tank.turrets[i])
        }
      }
      for(let i=0,l=tank._turrets.length;i<l;i++) {
        let turret = tank._turrets[i]
        for(let u=0,k=turret.barrels.length;u<k;u++) {
          check(turret.barrels[u])
        }
      }
      tank.removeBullets()
      codeTanks.attach(tank)
    },
    checkWeaponTurrets: function(weapon, tank, size) {
      let r = []
      for(let i=0,l=weapon.weaponTurrets.length;i<l;i++) {
        let turret = { ...weapon.weaponTurrets[i], count:Math.floor(Math.random() * dimension.detectTicks) }
        turret.gameX = tank.x
        turret.gameY = tank.y
        turret.detector = {}
        turret.d = 0
        turret.position = 'weaponTurret'
        let barrels = turret.sectionWeapon.barrels || []
        turret.barrels = []
        turret.relativeSize = turret.size * size * 0.5
        for(let u=0,k=barrels.length;u<k;u++) {
          let barrel = barrels[u]
          barrel.relativeSize = turret.size * 0.5
          barrel.relativeSizeS = barrel.relativeSize * ('size' in barrel ? barrel.size || 1 : 1)
          turret.barrels.push({
            current: barrel.reload * 0.5 * (1 - tank.upgrades[3] / 30) * (1 - barrel.delay) - 0.1,
            bullets: [],
            data: barrel,
            turret: turret,
            active: false
          })
        }
        if(turret) {
          let weapon = turret.sectionWeapon
          if(weapon) {
            turret.sectionWeapon = { ...weapon }
            turret.sectionWeapon.weaponTurrets = generator.checkWeaponTurrets(weapon, tank, turret.relativeSize * 1)
          }
          let body = turret.sectionBody
          if(body) {
            turret.sectionBody = { ...body }
            turret.sectionBody.turrets = generator.checkTurrets(body, tank, turret.relativeSize * 1)
          }
        }
        r.push(turret)
      }
      return r
    },
    setTankWeapon: function(tank, weapon) {
      if(weapon !== 'node' && tank.ws.accountData) {
        tank.ws.accountData.ohNode = false
      }
      let w = weapon
      weapon = tank.dim.weapons[weapon]
      if(weapon) {
        tank.weapon = w
        tank.weaponData = weapon
        tank.weaponCameraSize = weapon.cameraSizeMultiplier
        tank.barrels = []
        tank.weaponTurrets = []
        for(let i=0,l=weapon.barrels.length;i<l;i++) {
          let barrel = weapon.barrels[i]
          barrel.relativeSize = 1
          barrel.relativeSizeS = ('size' in barrel ? barrel.size || 1 : 1)
          tank.barrels.push({
            current: barrel.reload * 0.5 * (1 - tank.upgrades[3] / 30) * (1 - barrel.delay) - 0.1,
            bullets: [],
            data: barrel
          })
        }
        tank.weaponTurrets = generator.checkWeaponTurrets(weapon, tank, 1)
        generator.updateTank(tank)
        return true
      }
    },
    checkTurrets: function(body, tank, size, sr, a) {
      let r = []
      if(!(sr > 0)) { sr = 1 }
      let hs = size * 0.5
      if(body.turrets) {
        for(let i=0,l=body.turrets.length;i<l;i++) {
          let turret = { ...body.turrets[i], count:Math.floor(Math.random() * dimension.detectTicks) }
          turret.gameX = tank.x
          turret.gameY = tank.y
          turret.detector = {}
          turret.d = 0
          turret.position = 'turret'
          let barrels = turret.sectionWeapon.barrels || []
          turret.barrels = []
          turret.relativeSize = turret.size * hs
          for(let u=0,k=barrels.length;u<k;u++) {
            let barrel = barrels[u]
            barrel.relativeSize = turret.size * 0.5
            barrel.relativeSizeS = barrel.relativeSize * ('size' in barrel ? barrel.size || 1 : 1)
            turret.barrels.push({
              current: barrel.reload * 0.5 * (1 - tank.upgrades[3] / 30) * (1 - barrel.delay) - 0.1,
              bullets: [],
              data: barrel,
              turret: turret,
              active: false
            })
          }
          let rs = sr ? hs : turret.relativeSize
          if(turret) {
            let weapon = turret.sectionWeapon
            if(weapon) {
              turret.sectionWeapon = { ...weapon }
              turret.sectionWeapon.weaponTurrets = generator.checkWeaponTurrets(weapon, tank, rs)
            }
            let body = turret.sectionBody
            if(body) {
              turret.sectionBody = { ...body }
              turret.sectionBody.turrets = generator.checkTurrets(body, tank, rs * 2)
            }
          }
          r.push(turret)
        }
      }
      return r
    },
    setTankBody: function(tank, body) {
      if(body !== 'base' && tank.ws.accountData) {
        tank.ws.accountData.classic = false
      }
      let b = body
      body = tank.dim.bodies[body]
      if(body) {
        tank.celestial = (body.celestial ? true : false)
        tank.body = b
        tank.bodyData = body
        tank.maxHealthMultiplier = body.maxHealth
        tank.movementSpeed = body.movementSpeed * (tank.celestial ? 1.5 : 1)
        tank.bodyDamage = body.bodyDamage
        tank.bodyCameraSize = body.cameraSizeMultiplier
        tank.turrets = []
        tank.auras = []
        tank.noHitBox = body.noHitBox ? true : false
        tank.turrets = generator.checkTurrets(body, tank, 1, 1, 1)
        for(let i=0,l=body.auras.length;i<l;i++) {
          let aura = { ...body.auras[i] }
          aura.gameX = tank.x
          aura.gameY = tank.y
          aura.detector = {}
		aura.counter = Math.floor(Math.random() * dimension.detectTicks)
          tank.auras.push(aura)
        }
        generator.updateTank(tank)
        return true
      }
    },
    updateFinalDamage: function(obj) {
      let updated = {}
      for(let id in obj) {
        let arr = obj[id]
        if(Math.max(...arr) > 0) {
          updated[id] = arr.slice(1).concat(0)
        }
      }
      return updated
    },
    log1: 1 / Math.log(1.2),
    log2: 1 / Math.log(4),
    getLevel: function(score) {
      return Math.floor(Math.round(10e5 * Math.log(score / 500 + 1) * generator.log1) / 10e5) + 1
    },
    getCelestialLevel: function(score) {
      return Math.floor(Math.round(10e5 * Math.log((score - 23477631) / 5e6 + 1) * generator.log1) / 10e5) + 75
    },
    getSides: function(score) {
      return Math.floor(Math.round(10e5 * Math.log(1 + 3 * (score - 250) / 1000) * generator.log2) / 10e5) + 3
    },
    tank: function(data, ws) {
      let w = false
      if(!ws) {
        ws = {
          data: {
            commands: {}
          },
          sendPacket: function() {}
        }
        w = true
      }
      let dim = data.dim
      if(dim.tanks.length > 1000) {
        for(let i=dim.tanks.length-1;i>=0;i--) {
          let t = dim.tanks[i]
          if(!t.static && !t.ws.data.isPlayer) {
            t.remove()
          }
        }
        if(dim.tanks.length > 1000) {
          for(let i=dim.tanks.length-1;i>=0;i--) {
            let t = dim.tanks[i]
            if(!t.static) {
              t.remove()
            }
          }
        }
      }
      let tank = {
        fovMultiplier: 1,
        sReload: 1,
        sBulletDamage: 1,
        sBulletSpeed: 1,
        sPenetration: 1,
        sMaxHealth: 1,
        sHealthRegeneration: 1,
        sBodyDamage: 1,
        SMovementSpeed: 1,
        id: generator.getId('tank', data.dim),
        lastChat: 0,
        chat: function(message) {
          tank.lastChat = _performance.now()
          tank.dim.chatMessages[tank.id] = message
        },
	      loneSurvivorTime: 0,
        hideFromLeaderboard: data.hideFromLeaderboard || false,
        friction: data.friction >= 0 ? data.friction : 1,
        canBePushed: data.canBePushed || (!data.static || false),
        alwaysShowOnMinimap: data.alwaysShowOnMinimap || false,
        polygon: data.polygon || false,
        noKillNotification: data.noKillNotification || false,
        invisible: data.invisible || false,
        dim: data.dim || false,
        ignorePolygonDamage: data.ignorePolygonDamage || false,
        weight: data.weight || 1,
        density: data.density || 1,
        speed: data.speed || 1,
        onDeath: data.onDeath || function() {},
        forceDeathScore: data.forceDeathScore >= 0 ? data.forceDeathScore : -1,
        exactDeathScore: !!data.exactDeathScore,
        x: data.x || 0,
        y: data.y || 0,
        lx: data.x || 0,
        ly: data.y || 0,
        d: data.d || 0,
        fullFov: false,
        _d: [],
        xv: 0,
        yv: 0,
        range: ('range' in data ? data.range : 12),
        static: data.static || false,
        clip: data.clip || false,
        firing: false,
        droneControl: false,
        droneCount: 0,
        firedBarrels: {},
        spawnedAt: Date.now(),
        kills: 0,
        upgrades: data.upgrades || [0, 0, 0, 0, 0, 0, 0, 0],
        maxHealthMultiplier: 1,
        upgradeCount: data.upgradeCount || 0,
        alive: true,
        timeExisted: 0,
        countUpgrades: function() {
          let c = 0
          for(let i=0;i<8;i++) {
            c += tank.upgrades[i]
          }
          tank.upgradeCount = c
        },
        bodyDamageMultiplier: 1,
        radiant: data.radiant || 0,
        controlPosition: [0, 0],
        mousePosition: [0, 0],
        smoothMousePosition: [0, 0],
        name: data.name || '',
        team: data.team || 0,
        score: data.score || 0,
        rScore: data.rScore || 0,
        displayScore: data.score || 0,
        level: 0,
        lastSendLevel: 0,
        levelMultiplier: 1,
        health: 800,
        maxHealth: 800,
        regenTime: 1,
        size: 30,
        detector: false,
        input: {
          movement: [0, 0]
        },
        typing: data.typing || false,
        passive: data.passive || false,
        invincible: ('invincible' in data ? data.invincible : true),
        invincibleTime: _performance.now() + 30000,
        weapon: data.weapon || 'node',
        body: data.body || 'base',
        physics: data.physics === 'arras' ? 'arras' : '',
        turrets: [],
        auras: [],
        bullets: {},
        ascend: function() {
          if(tank.ws.accountData && !tank.ws.accountData.ascended) {
            tank.ws.accountData.ascended = true
            args.parentPort.postMessage(['ascention', [tank.ws.accountName]])
          }
          if(!tank.invincible) {
            tank.invincible = true
            let t = _performance.now() + 10000
            if(tank.invincibleTime < t) { tank.invincibleTime = t }
          }
          tank.upgrades = [0, 0, 0, 0, 0, 0, 0, 0]
          tank.countUpgrades()
          tank.weapon = 'nova'
          tank.body = 'celestial'
          tank.physics = ''
          if(tank.team !== 7) {
            tank.team = 6
          }
          tank.dim.updatedTanks[tank.id] = tank
          tank.update()
          tank.removeBullets()
          generator.setTankWeapon(tank, tank.weapon)
          generator.setTankBody(tank, tank.body)
          tank.firedBarrels = {}
          generator.updateTank(tank)
          ws.data.tank.dim.updatedTanks[ws.data.tank.id] = ws.data.tank
        },
        fov: {
          tanks: [],
          polygons: [],
          bullets: []
        },
        finalDamage: {
          tanks: {},
          polygons: {}
        },
        removeBullets: function() {
          for(let id in tank.bullets) {
            tank.bullets[id].remove()
          }
        },
        setMaxHealth: function(health) {
          let changed = Math.round(health) !== Math.round(tank.maxHealth)
          tank.health = tank.health / tank.maxHealth * health
          tank.maxHealth = health
          if(changed && tank.dim && tank.dim.updatedTanks) {
            tank.dim.updatedTanks[tank.id] = tank
          }
        },
        damage: function(amount, object, type) {
          if(amount > 0) {
            if(tank.ws.accountData) {
              tank.ws.accountData.pristine = false
            }
            tank.health -= amount
            tank.hitThisTick = true
            if(tank.health < 0) {
              tank.health = 0
            }
            tank.regenTime = 0
            let obj = tank.finalDamage[type]
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
          if(tank.dim.lastTank === tank) {
            tank.dim.lastTank = false
          }
          tank.alive = false
          tank.removeBullets()
          let index = tank.dim.tanks.indexOf(tank)
          if(index >= 0) {
            tank.dim.tanks.splice(index, 1)
          }
          generator.removeId('tank', tank.id, tank.dim)
          if(ws && ws.data && ws.data.tank === tank) {
            ws.data.tank = false
          }
        },
        update: function() {
		      let b = tank.dim.bodies[tank.body], s = 1
          if(b && b.celestial) { tank.celestial = true }
          if(b && b.size) { s = b.size }
          if(tank.ws.accountData) {
            let data = tank.ws.accountData
            if(tank.score >= 1e9) {
              if(!data.achievements[16]) {
                let y = data.achievements[16] = createAchievement(16)
                sendAchievement(tank, y)
              }
            }
          }
          if(tank.celestial) {
            if(tank.score < 23477631) { tank.rScore = tank.score = 23477631 }
            tank.level = generator.getCelestialLevel(tank.score)
          } else {
            tank.level = generator.getLevel(tank.score)
            let data = tank.ws.accountData
            if(tank.level >= 75 && data) {
              if(!data.achievements[11]) {
                let y = data.achievements[11] = createAchievement(11)
                sendAchievement(tank, y)
              }
            }
            if(tank.level >= 45 && data) {
              if(tank.ws) {
                if(data.ohNode) {
                  data.ohNode = false
                  if(!data.achievements[13]) {
                    let y = data.achievements[13] = createAchievement(13)
                    sendAchievement(tank, y)
                  }
                } if(data.classic) {
                  data.classic = false
                  if(!data.achievements[10]) {
                    let y = data.achievements[10] = createAchievement(10)
                    sendAchievement(tank, y)
                  }
                }
                if(tank.level >= 60) {
                  if(data.pristine) {
                    data.pristine = false
                    if(!data.achievements[24]) {
                      let y = data.achievements[24] = createAchievement(24)
                      sendAchievement(tank, y)
                    }
                  }
                }
              }
            }
          }

          tank.displayScore = tank.score * dimension.getRadiantMultiplier(tank.radiant)

          tank.levelMultiplier = Math.pow(1.01, tank.level - (tank.celestial ? 15 : 1))

          tank.size = 30 * Math.pow(tank.dim.sizeScale, tank.level - (tank.celestial ? 0 : 1)) * (tank.celestial ? 1.5 : 1) * s

          if(tank.size > 1000) { tank.size = 1000 }
          if(tank.barrels) {
            for(let i=tank.barrels.length-1;i>=0;i--) {
              let bullets = tank.barrels[i].bullets
              for(let u=bullets.length-1;u>=0;u--) {
                bullets[u].size = bullets[u].sparent.size * bullets[u].rawSize
              }
            }
          }
          if(tank.ai === 'fallen' && tank.name.startsWith('Fallen ')) {
            tank.name = `Fallen ${tank.weapon && tank.weapon[0] ? tank.weapon[0].toUpperCase() + tank.weapon.slice(1) : '???'}-${tank.body && tank.body[0] ? tank.body[0].toUpperCase() + tank.body.slice(1) : '???'}`
          }
        },
        ws: ws,
        objectType: 'tank',
        aiInput: data.ai
      }
      dim.lastTank = tank
      ws.data.tank = tank
      if(w) {
        ws.data.tank = tank
      }
      if(data.ai === 'fallen') {
        tank.aiInput = tank.ai = 'fallen'
        tank.aiRam = data.aiRam ? true : false
      } else if(data.ai === 'defender') {
        tank.range = 5
        tank.ai = function() {}
      } else if(tank.ai === 'peacekeeper') {
        tank.ai = 'peacekeeper'
      } else if(data.ai) {
        tank.ai = data.ai
      }
      tank.update()
      if(!generator.setTankWeapon(tank, tank.weapon)) {
        generator.setTankWeapon(tank, 'node')
      }
      if(!generator.setTankBody(tank, tank.body)) {
        generator.setTankBody(tank, 'base')
      }
      if(tank.dim) {
        tank.dim.updatedTanks[tank.id] = tank
        tank.dim.add('tanks', tank)
      }
      return tank
    },
