  const codeTanks = (function() {
    const tankCode = require('./shared/tank-code.js')
    let loaded = null
    const codes = function() {
      if(!loaded) { loaded = tankCode.folder('./tankData/codes') }
      return loaded
    }
    const TYPES = { bullet: 0, custom: 0, trap: 1, drone: 2 }
    const LIFE = { 0: 1.5, 1: 12, 2: 1 }
    const HEALTH = { 0: 100, 1: 800, 2: 100 }
    const AIM_TICKS = 5

    const engineBarrel = function(n, k, tank) {
      const type = TYPES[n.kind] || 0
      const data = {
        type: type,
        x: 0,
        y: 0,
        d: 0,
        width: n.w * k,
        height: n.h * k,
        relativeSize: 1,
        relativeSizeS: n.size,
        reload: n.reload * 2,
        delay: n.offset,
        damage: n.damage,
        penetration: n.health * 20 / HEALTH[type],
        speed: n.speed / 5,
        time: n.time / LIFE[type],
        recoil: n.recoil,
        spread: n.spray * 2 / Math.PI,
        drones: n.maxDrones || 1,
        maxChildren: type === 0 ? tankCode.LIMITS.bulletsPerBarrel : 0
      }
      const holder = { d: 0, gameX: tank.x, gameY: tank.y, active: false, followingMouse: true, detector: {}, barrels: [] }
      const barrel = {
        current: data.reload * 0.5 * (1 - tank.upgrades[3] / 30) * (1 - data.delay) - 0.1,
        bullets: [],
        data: data,
        turret: holder
      }
      if(type === 1) { barrel.maxTraps = Math.min(tankCode.LIMITS.bulletsPerBarrel - 1, 24 / data.reload * data.time) }
      holder.barrels.push(barrel)
      return barrel
    }

    const attach = function(tank) {
      tank.codeState = null
      const body = tank.bodyData
      if(!body || !body.code) { return }
      const entry = codes()[body.code]
      if(!entry) { return }
      const sections = [], barrels = [], auras = [], syncs = []
      const base = tank._turrets.length
      const walk = function(items, parent, k, auto) {
        for(const n of items) {
          if(n.t === 'section') {
            const s = { node: n, parent: parent, k: k * n.size, x: 0, y: 0, angle: 0, target: null, auto: n.turn === 'auto' ? sections.length : auto, aimCount: 0 }
            sections.push(s)
            if(n.sync >= 0) {
              const turret = { d: 0, rotationType: 2, barrels: [], detector: {}, position: 'code', count: 0 }
              tank._turrets[base + n.sync] = turret
              syncs.push({ section: s, turret: turret })
            }
            walk(n.children, sections.length - 1, k * n.size, s.auto)
          } else if(n.t === 'barrel' && !n.visual) {
            const barrel = engineBarrel(n, k, tank)
            tank._barrels.push(barrel)
            const lookAuras = n.look >= 0 ? (entry.tank.looks[n.look] || []).filter(a => a.t === 'aura' && a.damage > 0) : []
            barrels.push({ node: n, parent: parent, k: k, auto: auto, barrel: barrel, auras: lookAuras })
          } else if(n.t === 'aura' && n.damage > 0) {
            auras.push({ node: n, parent: parent, k: k })
          }
        }
      }
      walk(entry.tank.render, -1, 1, -1)
      tank.codeState = { name: body.code, reach: entry.tank.reach, time: 0, sections: sections, barrels: barrels, auras: auras, syncs: syncs }
    }

    const world = function(tank, x, y) {
      const f = tank.d + Math.PI / 2, s = Math.sin(f), c = Math.cos(f)
      return [tank.x + tank.size * (x * c - y * s), tank.y + tank.size * (x * s + y * c)]
    }

    const findTarget = function(tank, s, from, keep) {
      const n = s.node
      const detect = n.detect * tank.size, forget = n.forget * tank.size
      if(keep && keep.alive !== false && !keep._removed && keep.dim === tank.dim) {
        const dx = keep.x - from[0], dy = keep.y - from[1]
        if(dx * dx + dy * dy <= forget * forget && !keep.invisible) { return keep }
      }
      let best = null, bestDistance = detect * detect
      const tanks = tank.dim.tanks
      for(let i=tanks.length-1;i>=0;i--) {
        const t = tanks[i]
        if(t === tank || t.static || t.alive === false || t.invisible || t.passive || dimension.isSameTeam(t, tank)) { continue }
        const dx = t.x - from[0], dy = t.y - from[1]
        const d = dx * dx + dy * dy
        if(d < bestDistance) {
          bestDistance = d
          best = t
        }
      }
      return best
    }

    const turn = function(tank, s, parentAngle, facing, time) {
      const n = s.node
      const free = n.relative === 'none'
      if(n.turn === 'constant') {
        const spin = n.d + n.speed * time
        return free ? spin - facing : parentAngle + spin
      }
      if(n.turn === 'mouse') { return n.d }
      if(n.turn === 'auto') {
        if(s.aimCount <= 0) {
          s.aimCount = AIM_TICKS
          const from = n.fromTop ? [tank.x, tank.y] : world(tank, s.x, s.y)
          s.target = findTarget(tank, s, from, s.target)
        }
        s.aimCount --
        if(s.target) {
          const from = world(tank, s.x, s.y)
          return Math.atan2(s.target.y - from[1], s.target.x - from[0]) - facing
        }
        return parentAngle + n.rest
      }
      return free ? n.d - facing : parentAngle + n.d
    }

    const update = function(tank) {
      const state = tank.codeState
      if(!state) { return }
      state.time += dimension.tickTime
      const facing = tank.d + Math.PI / 2
      const sections = state.sections
      for(let i=0,l=sections.length;i<l;i++) {
        const s = sections[i], n = s.node
        const p = s.parent >= 0 ? sections[s.parent] : null
        const px = p ? p.x : 0, py = p ? p.y : 0, pa = p ? p.angle : 0, pk = p ? p.k : 1
        const ps = Math.sin(pa), pc = Math.cos(pa)
        s.x = px + pk * (n.x * pc - n.y * ps)
        s.y = py + pk * (n.x * ps + n.y * pc)
        s.angle = turn(tank, s, pa, facing, state.time)
      }
      for(let i=0,l=state.syncs.length;i<l;i++) {
        state.syncs[i].turret.d = state.syncs[i].section.angle + tank.d
      }
      const firing = tank.firing && !tank.passive
      for(let i=0,l=state.barrels.length;i<l;i++) {
        const b = state.barrels[i], n = b.node
        const p = b.parent >= 0 ? sections[b.parent] : null
        const px = p ? p.x : 0, py = p ? p.y : 0, pa = p ? p.angle : 0
        const a = pa + n.d
        const lx = px + b.k * (n.x * Math.cos(a) - n.y * Math.sin(a))
        const ly = py + b.k * (n.x * Math.sin(a) + n.y * Math.cos(a))
        const at = world(tank, lx, ly)
        const holder = b.barrel.turret
        holder.gameX = at[0]
        holder.gameY = at[1]
        holder.d = a + tank.d
        holder.active = b.auto >= 0 ? !tank.passive && !!sections[b.auto].target : firing
      }
      if(tank.passive) { return }
      for(let i=0,l=state.auras.length;i<l;i++) {
        const aura = state.auras[i], n = aura.node
        const p = aura.parent >= 0 ? sections[aura.parent] : null
        const px = p ? p.x : 0, py = p ? p.y : 0, pa = p ? p.angle : 0
        const at = world(tank, px + aura.k * (n.x * Math.cos(pa) - n.y * Math.sin(pa)), py + aura.k * (n.x * Math.sin(pa) + n.y * Math.cos(pa)))
        hurt(tank, n, at[0], at[1], aura.k * tank.size)
      }
      for(let i=0,l=state.barrels.length;i<l;i++) {
        const b = state.barrels[i]
        if(!b.auras.length) { continue }
        const bullets = b.barrel.bullets
        for(let u=bullets.length-1;u>=0;u--) {
          const bullet = bullets[u]
          for(let j=0,m=b.auras.length;j<m;j++) {
            const n = b.auras[j], s = Math.sin(bullet.d + Math.PI / 2), c = Math.cos(bullet.d + Math.PI / 2)
            hurt(tank, n, bullet.x + bullet.size * (n.x * c - n.y * s), bullet.y + bullet.size * (n.x * s + n.y * c), bullet.size)
          }
        }
      }
    }

    const hurt = function(tank, n, x, y, scale) {
      const outer = n.size * scale, inner = n.inner * scale
      const amount = dimension.tickMultiplier * n.damage * 0.25 * tank.levelMultiplier
      const tanks = tank.dim.tanks
      for(let i=tanks.length-1;i>=0;i--) {
        const t = tanks[i]
        if(t === tank || t.static || t.alive === false || t.invincible || t.inBase || t.prevInBase || dimension.isSameTeam(t, tank)) { continue }
        const dx = t.x - x, dy = t.y - y
        const d = Math.sqrt(dx * dx + dy * dy)
        if(d > outer + t.size || d + t.size < inner) { continue }
        t.damage(amount, tank, 'tanks')
        if(n.steal > 0) { tank.health = Math.min(tank.maxHealth, tank.health + amount * n.steal) }
      }
    }

    return { codes: codes, attach: attach, update: update }
  })()

