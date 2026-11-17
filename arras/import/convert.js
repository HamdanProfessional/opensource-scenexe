const KEY_PREFIX = 'arras:'

const RENAMES = {
  basic: 'Rookie',
  twin: 'Duplex',
  sniper: 'Longshot',
  machineGun: 'Burster',
  flankGuard: 'Pincer',
  director: 'Handler',
  trapper: 'Snarer',
  assassin: 'Reaper',
  auto3: 'Triturret',
  auto5: 'Pentaturret',
  autoGunner: 'Autovolley',
  autoSmasher: 'Autobasher',
  annihilator: 'Obliterator',
  battleship: 'Dreadboat',
  booster: 'Jetter',
  destroyer: 'Wrecker',
  doubleTwin: 'Twofold',
  factory: 'Foundry',
  fighter: 'Skirmisher',
  gunner: 'Volley',
  gunnerTrapper: 'Volleylock',
  hunter: 'Chaser',
  hybrid: 'Chimera',
  landmine: 'Sapper',
  manager: 'Steward',
  necromancer: 'Reanimator',
  octoTank: 'Octal',
  overlord: 'Sovereign',
  overseer: 'Warden',
  overtrapper: 'Warlock',
  megaTrapper: 'Bulkhead',
  pentaShot: 'Quintet',
  predator: 'Ambusher',
  ranger: 'Pathfinder',
  skimmer: 'Swirler',
  smasher: 'Basher',
  spike: 'Barb',
  spreadshot: 'Fanshot',
  sprayer: 'Mister',
  stalker: 'Lurker',
  streamliner: 'Torrent',
  triAngle: 'Delta',
  triTrapper: 'Triplock',
  tripleShot: 'Trident',
  tripleTwin: 'Sixfold',
  triplet: 'Trio',
  underseer: 'Undertaker'
}

const projectileDrawScale = function(family, projectile) {
  if(family === 'trap' && projectile.SHAPE === -3) { return 2.3 }
  if(family === 'trap' && Array.isArray(projectile.TURRETS) && projectile.TURRETS.length) { return 1.32 }
  if(family === 'drone') { return 1.81 }
  return 1
}

const FAMILY_REFERENCE = {
  bullet: { type: 0, damage: 1.5, damageBase: 0.75, penetration: 1.5, speed: 4 },
  swarm: { type: 0, damage: 1.5, damageBase: 0.75, penetration: 1.5, speed: 4 },
  trap: { type: 1, damage: 0.65, damageBase: 0.75, penetration: 8, speed: 3.25 },
  boomerang: { type: 1, damage: 0.65, damageBase: 0.75, penetration: 8, speed: 3.25 },
  drone: { type: 2, damage: 1, damageBase: 1, penetration: 2, speed: 1.5 },
  minion: { type: 4, damage: 1, damageBase: 1, penetration: 2, speed: 3 }
}

const PROJECTILE_TYPE_TO_FAMILY = {
  bullet: 'bullet',
  swarm: 'swarm',
  trap: 'trap',
  drone: 'drone',
  satellite: 'drone',
  minion: 'minion'
}

const PROJECTILE_FAMILIES_WITH_GUNS = ['bullet', 'swarm', 'trap']

const FIXED_RANGE_CALCULATORS = ['sustained', 'sustained+lowspeed', 'trap', 'block']

const EXTRA_UPGRADES = {
  launcher: [{ name: 'rocketeer', level: 45 }]
}

const DRONE_TOUGHNESS = {
  bigCheese: 2.5
}

const MAX_PROJECTILE_GUN_DEPTH = 2

const round = function(value, places) {
  const factor = Math.pow(10, places === undefined ? 4 : places)
  const out = Math.round(value * factor) / factor
  return out === 0 ? 0 : out
}

const makeConverter = function(classTable, report) {
  const memo = new Map()

  const count = function(bucket, reason) {
    if(!report[bucket]) { report[bucket] = {} }
    report[bucket][reason] = (report[bucket][reason] || 0) + 1
  }

  const isUsable = function(def) {
    return def && typeof def === 'object' && !def.PLACEHOLDER
  }

  const lookup = function(name) {
    if(Object.prototype.hasOwnProperty.call(classTable, name)) { return classTable[name] }
    return null
  }

  const merge = function(target, source) {
    for(const key of Object.keys(source)) {
      if(key === 'PARENT' || /^UPGRADES_TIER_/.test(key) || /^DMCA_/.test(key)) { continue }
      if(key === 'BODY') {
        target.BODY = Object.assign({}, target.BODY, source.BODY)
      } else {
        target[key] = source[key]
      }
    }
    return target
  }

  const resolveDef = function(def, depth) {
    if(!isUsable(def)) { return { PLACEHOLDER: true } }
    if(depth > 40) { return { PLACEHOLDER: true } }
    const out = {}
    const parents = def.PARENT === undefined ? [] : [].concat(def.PARENT)
    for(const parent of parents) {
      const parentDef = typeof parent === 'string' ? lookup(parent) : parent
      const resolved = resolveDef(parentDef, depth + 1)
      if(resolved.PLACEHOLDER) { out.PLACEHOLDER = true; continue }
      merge(out, resolved)
    }
    merge(out, def)
    return out
  }

  const resolve = function(name) {
    if(memo.has(name)) { return memo.get(name) }
    const resolved = resolveDef(lookup(name), 0)
    memo.set(name, resolved)
    return resolved
  }

  const resolveType = function(type) {
    if(typeof type === 'string') { return resolve(type) }
    if(Array.isArray(type)) {
      const base = typeof type[0] === 'string' ? resolve(type[0]) : resolveDef(type[0], 0)
      if(base.PLACEHOLDER) { return base }
      return merge(Object.assign({}, base, { BODY: Object.assign({}, base.BODY) }), type[1] || {})
    }
    if(type && typeof type === 'object') { return resolveDef(type, 0) }
    return { PLACEHOLDER: true }
  }

  const normalizeGunPosition = function(position) {
    let p = position
    if(Array.isArray(p)) {
      p = { LENGTH: p[0], WIDTH: p[1], ASPECT: p[2], X: p[3], Y: p[4], ANGLE: p[5], DELAY: p[6] }
    }
    p = p || {}
    return {
      L: p.LENGTH === undefined ? 18 : p.LENGTH,
      W: p.WIDTH === undefined ? 8 : p.WIDTH,
      A: p.ASPECT === undefined ? 1 : p.ASPECT,
      X: p.X || 0,
      Y: p.Y || 0,
      ANGLE: p.ANGLE || 0,
      DELAY: p.DELAY || 0
    }
  }

  const normalizeTurretPosition = function(position) {
    let p = position
    if(Array.isArray(p)) {
      p = { SIZE: p[0], X: p[1], Y: p[2], ANGLE: p[3], ARC: p[4], LAYER: p[5] }
    }
    p = p || {}
    return {
      SIZE: p.SIZE === undefined ? 10 : p.SIZE,
      X: p.X || 0,
      Y: p.Y || 0,
      ANGLE: p.ANGLE || 0,
      ARC: p.ARC === undefined ? 360 : p.ARC,
      LAYER: p.LAYER || 0
    }
  }

  const stat = function(settings, key) {
    const v = settings && settings[key]
    return typeof v === 'number' && isFinite(v) ? v : 1
  }

  const hasController = function(projectile, name) {
    return Array.isArray(projectile.CONTROLLERS) && projectile.CONTROLLERS.indexOf(name) >= 0
  }

  const spinSpeed = function(projectile) {
    const facing = projectile.FACING_TYPE
    if(Array.isArray(facing) && facing[0] === 'spin' && facing[1] && typeof facing[1].speed === 'number') {
      return facing[1].speed
    }
    return 0
  }

  const motionType = function(projectile) {
    return Array.isArray(projectile.MOTION_TYPE) ? projectile.MOTION_TYPE[0] : projectile.MOTION_TYPE
  }

  const snakeSettings = function(projectile) {
    if(!Array.isArray(projectile.CONTROLLERS)) { return null }
    for(const entry of projectile.CONTROLLERS) {
      const name = Array.isArray(entry) ? entry[0] : entry
      if(name !== 'snake') { continue }
      const opts = Array.isArray(entry) && entry[1] ? entry[1] : {}
      return {
        invert: opts.invert ? -1 : 1,
        period: round(opts.period === undefined ? 5 : opts.period),
        amplitude: round(opts.amplitude === undefined ? 150 : opts.amplitude),
        yOffset: round(opts.yOffset || 0),
        angle: round(opts.angle || 0)
      }
    }
    return null
  }

  const turnWithSpeed = function(projectile) {
    const facing = projectile.FACING_TYPE
    if(facing === 'turnWithSpeed') { return 1 }
    if(Array.isArray(facing) && facing[0] === 'turnWithSpeed') {
      return facing[1] && typeof facing[1].multiplier === 'number' ? facing[1].multiplier : 1
    }
    return 0
  }

  const makeBulletBody = function(sides, turrets) {
    return { movementSpeed: 1, maxHealth: 1, bodyDamage: 1, cameraSizeMultiplier: 1, sides, turrets, auras: [] }
  }

  const convertGun = function(gun, depth, insideIndependent) {
    if(!gun || typeof gun !== 'object') { count('skippedGuns', 'malformed'); return null }
    const p = normalizeGunPosition(gun.POSITION)
    const hb = p.A > 0 ? p.W / 2 : Math.abs(p.A) * p.W / 2
    const hf = p.A > 0 ? p.W / 2 * p.A : p.W / 2
    const m = Math.max(hb, hf)
    if(!(m > 0) || !(p.L > 0)) { count('skippedGuns', 'zero size'); return null }
    const width = m / 10
    const barrel = {
      damage: 1,
      reload: 1,
      delay: round(p.DELAY),
      speed: 1,
      width: round(width),
      height: round(p.L / 20),
      d: round(p.ANGLE * Math.PI / 180),
      x: round(p.Y / 10),
      y: round(-p.X / 10),
      penetration: 1,
      type: 10,
      recoil: 0,
      time: 1,
      customBarrel: [{ points: [[
        [round(-hb / (2 * m)), 0],
        [round(-hf / (2 * m)), 1],
        [round(hf / (2 * m)), 1],
        [round(hb / (2 * m)), 0]
      ]] }]
    }
    const props = gun.PROPERTIES
    const settings = props && props.SHOOT_SETTINGS
    if(!props || !settings || props.TYPE === undefined) {
      count('visualOnlyGuns', props ? 'no shoot settings or type' : 'no properties')
      return barrel
    }
    const projectile = resolveType(props.TYPE)
    if(projectile.PLACEHOLDER) {
      count('visualOnlyGuns', 'unresolved projectile type')
      return barrel
    }
    let family = PROJECTILE_TYPE_TO_FAMILY[projectile.TYPE]
    if(family === 'trap' && hasController(projectile, 'boomerang')) { family = 'boomerang' }
    if(family === 'swarm' && motionType(projectile) !== 'swarm') { family = 'bullet' }
    if(!(stat(settings, 'speed') > 0) && !(stat(settings, 'range') > 0)) {
      count('visualOnlyGuns', 'fake gun')
      return barrel
    }
    if(!family) {
      count('visualOnlyGuns', 'unknown projectile family ' + projectile.TYPE)
      return barrel
    }
    const ref = FAMILY_REFERENCE[family]
    if(projectile.TYPE === 'satellite') { count('approximations', 'satellites act as drones') }
    const spray = stat(settings, 'spray')
    const shudder = stat(settings, 'shudder')
    barrel.type = ref.type
    const toughness = stat(settings, 'health') * stat(settings, 'pen')
    barrel.damage = round(ref.damage * stat(settings, 'damage') / ref.damageBase * toughness)
    barrel.reload = round(stat(settings, 'reload') / 15)
    barrel.speed = round(stat(settings, 'speed') / ref.speed)
    barrel.penetration = round(ref.penetration * Math.sqrt(toughness))
    barrel.recoil = round(stat(settings, 'recoil') / 1.4)
    barrel.time = round(stat(settings, 'range'))
    barrel.size = round(stat(settings, 'size') * (p.W / 20) / width * projectileDrawScale(family, projectile))
    barrel.spread = round(Math.min(spray / 2, 2 * spray * shudder) / 90)
    if(family === 'swarm') { barrel.visualType = 2 }
    if(family === 'drone' || family === 'minion') {
      barrel.drones = props.MAX_CHILDREN || 4
    }
    if(family === 'minion') {
      if(depth > 0) {
        count('visualOnlyGuns', 'nested minion')
        barrel.type = 10
        delete barrel.drones
      } else {
        const minionGuns = convertGuns(projectile.GUNS || [], depth + 1)
        for(const sub of minionGuns) {
          const subRef = sub.arras && FAMILY_REFERENCE[sub.arras.family]
          if(subRef) { sub.penetration = subRef.penetration }
        }
        barrel.bulletWeapon = { barrels: minionGuns, weaponTurrets: [] }
        barrel.bulletBody = makeBulletBody(0, [])
      }
    }
    if(family === 'drone' && typeof projectile.SHAPE === 'number' && projectile.SHAPE >= 0 && projectile.SHAPE !== 3) {
      barrel.bulletSides = projectile.SHAPE
    }
    if(family === 'swarm' && typeof projectile.SHAPE === 'number' && projectile.SHAPE >= 3) {
      barrel.bulletSides = projectile.SHAPE
    }
    const star = (family === 'trap' || family === 'boomerang') && typeof projectile.SHAPE === 'number' && projectile.SHAPE <= -3 ? -projectile.SHAPE : 0
    if(star) {
      barrel.bulletStar = star
    }
    if(PROJECTILE_FAMILIES_WITH_GUNS.indexOf(family) >= 0 && depth < MAX_PROJECTILE_GUN_DEPTH) {
      const subBarrels = convertGuns(projectile.GUNS || [], depth + 1, !!projectile.INDEPENDENT)
      const subTurrets = family === 'trap' ? convertTurrets(projectile.TURRETS, {}) : []
      if(subBarrels.length || subTurrets.length) {
        barrel.bulletWeapon = { barrels: subBarrels, weaponTurrets: [] }
        barrel.bulletBody = makeBulletBody(family === 'trap' ? 4 : 0, subTurrets)
        if(star) { barrel.bulletBody.star = star }
        if(family === 'trap') { barrel.type = 3 }
      }
    }
    if(props.SHOOT_ON_DEATH) { barrel.shootOnDeath = true }
    if(props.AUTOFIRE) { barrel.autoFire = true }
    if(props.ALT_FIRE) { barrel.altFire = true }
    barrel.arras = {
      family: family === 'minion' ? 'drone' : family,
      speed: round(stat(settings, 'speed')),
      maxSpeed: round(stat(settings, 'maxSpeed')),
      range: round(stat(settings, 'range')),
      recoil: round(stat(settings, 'recoil'))
    }
    if(projectile.BODY && typeof projectile.BODY.RANGE === 'number') { barrel.arras.bodyRange = projectile.BODY.RANGE }
    if(FIXED_RANGE_CALCULATORS.indexOf(props.STAT_CALCULATOR) >= 0) { barrel.arras.fixedRange = true }
    const snake = snakeSettings(projectile)
    if(snake) { barrel.arras.snake = snake }
    if(family === 'swarm') { barrel.arras.homing = true }
    if(family === 'swarm' && insideIndependent) { barrel.arras.autoTarget = true }
    if(family === 'boomerang') { barrel.arras.boomerang = true }
    if(hasController(projectile, 'goToMasterTarget')) { barrel.arras.goToTarget = true }
    if(projectile.PERSISTS_AFTER_DEATH) { barrel.arras.persists = true }
    const spin = spinSpeed(projectile)
    if(spin) { barrel.arras.spin = round(spin) }
    const turn = turnWithSpeed(projectile)
    if(turn) { barrel.arras.turnWithSpeed = round(turn) }
    return barrel
  }

  const convertGuns = function(guns, depth, insideIndependent) {
    const out = []
    for(const gun of guns || []) {
      const barrel = convertGun(gun, depth, insideIndependent)
      if(barrel) { out.push(barrel) }
    }
    return out
  }

  const convertTurrets = function(turrets, bodyOut, layer) {
    const out = []
    for(const turret of turrets || []) {
      const pos = normalizeTurretPosition(turret.POSITION)
      const cls = resolveType(turret.TYPE)
      if(cls.PLACEHOLDER) { count('skippedTurrets', 'unresolved type'); continue }
      const guns = cls.GUNS || []
      if(!guns.length) {
        if(layer === 'under') { continue }
        const sides = typeof cls.SHAPE === 'number' ? cls.SHAPE : 0
        if(sides >= 3 && pos.X === 0 && pos.Y === 0 && pos.LAYER <= 0 && !bodyOut.outerSides) {
          bodyOut.outerSides = sides
          bodyOut.outerSize = round(pos.SIZE / 20)
        } else {
          count('skippedTurrets', 'decoration without guns')
        }
        continue
      }
      if(layer === 'under' && pos.LAYER > 0) { continue }
      if(layer === 'over' && pos.LAYER <= 0) { continue }
      const barrels = convertGuns(guns, 0)
      if(!barrels.length) { count('skippedTurrets', 'no convertible guns'); continue }
      const a = pos.ANGLE * Math.PI / 180
      const forward = (pos.X * Math.cos(a) - pos.Y * Math.sin(a)) / 10
      const right = (pos.X * Math.sin(a) + pos.Y * Math.cos(a)) / 10
      const item = {
        x: round(-right),
        y: round(-forward),
        size: round(pos.SIZE / 10),
        sectionWeapon: { barrels, weaponTurrets: [] }
      }
      if(pos.ARC < 360) {
        item.angle = round(a)
        item.angleRange = round(pos.ARC * Math.PI / 180 / 2)
      }
      out.push(item)
    }
    return out
  }

  const convertTank = function(name) {
    const resolved = resolve(name)
    if(resolved.PLACEHOLDER) { return null }
    const own = lookup(name)
    const key = KEY_PREFIX + name
    const body0 = resolved.BODY || {}
    const censorName = !!own.DMCA_CENSOR_NAME
    const censorDesign = !!own.DMCA_CENSOR_DESIGN
    if((censorName || censorDesign) && !RENAMES[name]) {
      throw new Error('flagged tank without rename: ' + name)
    }
    const label = (censorName || censorDesign) && RENAMES[name] ? RENAMES[name] : resolved.LABEL || name
    const body = {
      label,
      movementSpeed: round((body0.SPEED || 0) / 5.25),
      maxHealth: round((body0.HEALTH || 0) / 20),
      bodyDamage: round((body0.DAMAGE || 0) / 3),
      size: round((resolved.SIZE || 12) / 12),
      cameraSizeMultiplier: round((body0.FOV || 1.02) / 1.02),
      sides: typeof resolved.SHAPE === 'number' && resolved.SHAPE >= 3 ? resolved.SHAPE : 0
    }
    body.turrets = convertTurrets(resolved.TURRETS, body, 'over')
    body.auras = []
    body.arras = { speed: round(body0.SPEED || 0), accel: round(body0.ACCELERATION || 0) }
    if(Array.isArray(resolved.INVISIBLE) && (resolved.INVISIBLE[0] > 0 || resolved.INVISIBLE[1] > 0)) {
      body.stealth = [round(resolved.INVISIBLE[0]), round(resolved.INVISIBLE[1])]
    }
    body.censorName = censorName
    body.censorDesign = censorDesign
    if(resolved.PROPS && resolved.PROPS.length) { count('approximations', 'props and hats skipped') }
    const weapon = {
      label,
      cameraSizeMultiplier: 1,
      barrels: convertGuns(resolved.GUNS, 0),
      weaponTurrets: convertTurrets(resolved.TURRETS, {}, 'under'),
      renderBody: key,
      pairedBody: key
    }
    if(DRONE_TOUGHNESS[name]) {
      for(const barrel of weapon.barrels) {
        if(barrel.type === 2) { barrel.penetration = round(FAMILY_REFERENCE.drone.penetration * DRONE_TOUGHNESS[name]) }
      }
    }
    return { key, weapon, body }
  }

  const upgradeTargets = function(name) {
    const own = lookup(name)
    const out = []
    for(let tier = 0; tier <= 9; tier++) {
      const list = own && own['UPGRADES_TIER_' + tier]
      if(!Array.isArray(list)) { continue }
      for(const entry of list) {
        if(typeof entry !== 'string') { count('skippedUpgradeEntries', 'non-string entry'); continue }
        out.push({ name: entry, level: 15 * tier })
      }
    }
    for(const extra of EXTRA_UPGRADES[name] || []) {
      if(out.every(function(e) { return e.name !== extra.name })) { out.push(extra) }
    }
    return out
  }

  const reachableFrom = function(rootName) {
    const order = []
    const seen = new Set([rootName])
    const queue = [rootName]
    while(queue.length) {
      const name = queue.shift()
      const resolved = resolve(name)
      if(resolved.PLACEHOLDER) { count('skippedTanks', 'placeholder or unresolved: ' + name); continue }
      order.push(name)
      for(const target of upgradeTargets(name)) {
        if(seen.has(target.name)) { continue }
        seen.add(target.name)
        queue.push(target.name)
      }
    }
    return order
  }

  const buildUpgradeMap = function(reachable) {
    const set = new Set(reachable)
    const map = {}
    for(const name of reachable) {
      const best = new Map()
      for(const target of upgradeTargets(name)) {
        if(!set.has(target.name)) { continue }
        if(!best.has(target.name) || best.get(target.name) > target.level) {
          best.set(target.name, target.level)
        }
      }
      if(!best.size) { continue }
      const entries = Array.from(best.entries()).sort(function(a, b) { return a[1] - b[1] })
      map[KEY_PREFIX + name] = {
        level: entries[0][1],
        upgrades: entries.map(function(e) { return KEY_PREFIX + e[0] }),
        levels: entries.map(function(e) { return e[1] })
      }
    }
    return map
  }

  return { resolve, convertTank, buildUpgradeMap, reachableFrom, lookup }
}

module.exports = { makeConverter, RENAMES, KEY_PREFIX }
