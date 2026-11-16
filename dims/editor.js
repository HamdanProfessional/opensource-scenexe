!function() {
  const SPAWN_SCORE = 23477631
  const MAX_BARRELS = 30, MAX_DRONES = 40, MAX_AURAS = 4

  const dim = dimension.create({
    mapSize: 2500,
    name: 'editor',
    type: 'ffa',
    sandbox: true,
    freeJoin: true,
    displayName: 'Tank Editor',
    entryMessage: 'Opening the Tank Editor...',
    displayColor: 0,
    walls: [],
    gates: [],
    ...mainModeLook,
    maxPolygonSides: 6,
    maxPolygonCount: 40,
    customWeapons: {},
    customBodies: {},
    spawnPlayer: function(team, tank) {
      setTimeout(function() {
        if(tank.dim !== dim) { return }
        tank.rScore = tank.score = SPAWN_SCORE
        if(tank.update) { tank.update() }
        dim.updatedTanks[tank.id] = tank
        if(tank.ws && tank.ws.sendPacket) {
          tank.ws.sendPacket('flag', ['editor', true])
          tank.ws.sendPacket('announcement', 'Tank Editor: press P or the button in the bottom-left corner to show or hide the editor.')
        }
      }, 300)
      return randomSpawnAwayFromTanks(dim, dim.mapSize * 0.8, 600)
    }
  })

  let seq = 0
  const num = function(v, min, max, def) {
    v = Number(v)
    if(!isFinite(v)) { return def }
    return v < min ? min : v > max ? max : v
  }
  const int = function(v, min, max, def) { return Math.round(num(v, min, max, def)) }
  const clone = function(o) { return JSON.parse(JSON.stringify(o)) }
  const label = function(v) {
    if(typeof v !== 'string') { return '' }
    return v.replace(/[^\w \-'!?.]/g, '').trim().slice(0, 24)
  }
  const TEAMS = [0, 1, 2, 3, 4, 6]

  const cleanBarrel = function(b) {
    b = b || {}
    const type = [0, 1, 2].indexOf(b.type) >= 0 ? b.type : 0
    const r = {
      type: type,
      width: num(b.width, 0.05, 3, 0.5),
      height: num(b.height, 0.05, 4, 1),
      d: num(b.d, -Math.PI, Math.PI, 0),
      x: num(b.x, -3, 3, 0),
      y: num(b.y, -3, 3, 0),
      delay: num(b.delay, 0, 1, 0),
      reload: num(b.reload, 0.1, 20, 1),
      damage: num(b.damage, 0, 20, 1),
      speed: num(b.speed, 0.1, 5, 1),
      penetration: num(b.penetration, 0, 20, 1),
      recoil: num(b.recoil, 0, 10, 1),
      time: num(b.time, 0.1, 10, 1)
    }
    if(type === 2) { r.drones = int(b.drones, 1, 20, 3) }
    return r
  }
  const cleanWeapon = function(w) {
    w = w || {}
    const barrels = Array.isArray(w.barrels) ? w.barrels.slice(0, MAX_BARRELS).map(cleanBarrel) : []
    const maxDrones = w.maxDrones === undefined ? 0 : int(w.maxDrones, 1, 20, 3)
    let drones = 0
    for(const b of barrels) {
      if(b.type === 2) {
        if(maxDrones) { b.drones = maxDrones }
        if(drones + b.drones > MAX_DRONES) { b.drones = Math.max(1, MAX_DRONES - drones) }
        drones += b.drones
      }
    }
    const r = { cameraSizeMultiplier: num(w.cameraSizeMultiplier, 0.5, 3, 1), barrels: barrels, weaponTurrets: [] }
    if(label(w.name)) { r.name = label(w.name) }
    const base = typeof w.keepFrom === 'string' ? tankData.weapons[w.keepFrom] : null
    if(base) {
      if(base.weaponTurrets && base.weaponTurrets.length) { r.weaponTurrets = clone(base.weaponTurrets) }
      if(base.weaponVisualElements) { r.weaponVisualElements = clone(base.weaponVisualElements) }
    }
    return r
  }
  const cleanAura = function(a) {
    a = a || {}
    const type = [0, 1, 2].indexOf(a.type) >= 0 ? a.type : 0
    const colors = [{ r: 252, g: 118, b: 118 }, { r: 57, g: 185, b: 102 }, { r: 72, g: 150, b: 255 }]
    const r = {
      x: 0, y: 0, type: type, sides: 0, innerSides: 0, innerSize: 0.5, alpha: 0.3,
      size: num(a.size, 0.1, 1.5, 0.6),
      auraSize: num(a.auraSize, 1, 10, 4),
      color: colors[type]
    }
    if(type === 0) { r.auraDamage = num(a.auraDamage, 0, 1, 0.1) }
    else if(type === 1) { r.healing = num(a.healing, 0, 5, 1) }
    else { r.auraPull = num(a.auraPull, -5, 5, 2) }
    return r
  }
  const cleanBody = function(b) {
    b = b || {}
    let sides = int(b.sides, 0, 12, 0)
    if(sides > 0 && sides < 3) { sides = 3 }
    const r = {
      sides: sides,
      size: num(b.size, 0.5, 2.5, 1),
      maxHealth: num(b.maxHealth, 0.2, 10, 1),
      movementSpeed: num(b.movementSpeed, 0.2, 3, 1),
      bodyDamage: num(b.bodyDamage, 0, 10, 1),
      cameraSizeMultiplier: num(b.cameraSizeMultiplier, 0.5, 3, 1),
      turrets: [],
      auras: Array.isArray(b.auras) ? b.auras.slice(0, MAX_AURAS).map(cleanAura) : []
    }
    if(label(b.name)) { r.name = label(b.name) }
    let outerSides = int(b.outerSides, 0, 12, 0)
    if(outerSides > 0 && outerSides < 3) { outerSides = 3 }
    const outerSize = num(b.outerSize, 0, 2.5, 0)
    if(outerSides > 0 && outerSize > 0) { r.outerSides = outerSides; r.outerSize = outerSize }
    const base = typeof b.keepFrom === 'string' ? tankData.bodies[b.keepFrom] : null
    if(base && !base.celestial) {
      if(base.turrets && base.turrets.length) { r.turrets = clone(base.turrets) }
      if(base.visualElements) { r.visualElements = clone(base.visualElements) }
      if(!(r.outerSides >= 0) && base.outerSides >= 0 && base.outerSize >= 0) { r.outerSides = base.outerSides; r.outerSize = base.outerSize }
    }
    return r
  }

  const players = function() {
    return dim.tanks.filter(t => t.ws && t.ws.data && t.ws.data.isPlayer && t.ws.sendPacket)
  }
  const install = function(tank, kind, def) {
    const name = (kind ? '@b' : '@w') + (++seq)
    const store = kind ? dim.bodies : dim.weapons, custom = kind ? dim.customBodies : dim.customWeapons
    store[name] = def
    custom[name] = def
    for(const p of players()) { p.ws.sendPacket('flag', ['tankDef', kind, name, def]) }
    const old = kind ? tank.editBody : tank.editWeapon
    tank.removeBullets()
    if(kind) {
      generator.setTankBody(tank, name)
      tank.editBody = name
    } else {
      generator.setTankWeapon(tank, name)
      tank.editWeapon = name
    }
    tank.firedBarrels = {}
    generator.updateTank(tank)
    dim.updatedTanks[tank.id] = tank
    if(old) {
      setTimeout(function() {
        delete store[old]
        delete custom[old]
      }, 5000)
    }
  }

  const apply = function(tank, data) {
    if(!data || typeof data !== 'object') { return }
    if(data.w) { install(tank, 0, cleanWeapon(data.w)) }
    if(data.b) { install(tank, 1, cleanBody(data.b)) }
    if(data.t && typeof data.t === 'object') {
      const t = data.t
      let name = typeof t.name === 'string' ? words.stripEmoji(t.name).slice(0, 24) : ''
      if(name && !checkName(name)) { name = '' }
      if(tank.editName === undefined) { tank.editName = tank.name }
      tank.name = name || tank.editName
      if(TEAMS.indexOf(t.team) >= 0) { tank.team = t.team }
      tank.radiant = int(t.radiant, 0, 9, 0)
      const level = int(t.level, 1, 74, 45)
      if(level !== tank.level) {
        tank.rScore = tank.score = 500 * (Math.pow(1.2, level - 1) - 1) + 1
        if(tank.update) { tank.update() }
      }
      dim.updatedTanks[tank.id] = tank
    }
    if(data.maxStats) {
      tank.upgrades = [15, 15, 15, 15, 15, 15, 15, 15]
      tank.countUpgrades()
      tank.ws.sendPacket('setStats', tank.upgrades)
    }
    if(data.reset) {
      tank.upgrades = [0, 0, 0, 0, 0, 0, 0, 0]
      tank.countUpgrades()
      tank.ws.sendPacket('setStats', tank.upgrades)
    }
  }

  dim.noArras = true
  dim.applyEdit = function(tank, data) {
    if(!tank || tank.dim !== dim) { return }
    const now = Date.now()
    if(tank.editPending) {
      tank.editPending = { ...tank.editPending, ...data }
      return
    }
    const wait = (tank.lastEdit || 0) + 100 - now
    if(wait <= 0) {
      tank.lastEdit = now
      try { apply(tank, data) } catch(e) { console.log('[editor]', e) }
      return
    }
    tank.editPending = data
    setTimeout(function() {
      const d = tank.editPending
      tank.editPending = null
      tank.lastEdit = Date.now()
      if(tank.dim === dim) {
        try { apply(tank, d) } catch(e) { console.log('[editor]', e) }
      }
    }, wait)
  }

  setInterval(function() {
    const used = {}
    for(const t of dim.tanks) {
      if(t.editWeapon) { used[t.editWeapon] = true }
      if(t.editBody) { used[t.editBody] = true }
      if(t.weapon) { used[t.weapon] = true }
      if(t.body) { used[t.body] = true }
    }
    for(const n in dim.customWeapons) { if(!used[n]) { delete dim.customWeapons[n]; delete dim.weapons[n] } }
    for(const n in dim.customBodies) { if(!used[n]) { delete dim.customBodies[n]; delete dim.bodies[n] } }
  }, 30000)
}()
