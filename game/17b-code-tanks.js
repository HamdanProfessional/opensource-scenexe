  const tankCode = require('./shared/tank-code.js')

  const codeTanks = {
    loaded: null,
    life: { 0: 1.5, 1: 12, 2: 1 },
    health: { 0: 100, 1: 800, 2: 100 },
    aimTicks: 5,
    trapRate: 24,
    auraRate: 0.25,
    barrel: function(n, k, tank) {
      let type = n.shape
      let data = {
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
        penetration: n.health * 20 / codeTanks.health[type],
        speed: n.speed / 5,
        time: n.time / codeTanks.life[type],
        recoil: n.recoil,
        spread: n.spray * 2 / Math.PI,
        drones: n.maxDrones || 1,
        maxChildren: type === 0 ? tankCode.LIMITS.bulletsPerBarrel : 0
      }
      let holder = { d: 0, gameX: tank.x, gameY: tank.y, active: false, followingMouse: true, detector: {}, barrels: [] }
      let barrel = {
        current: data.reload * 0.5 * (1 - tank.upgrades[3] / 30) * (1 - data.delay) - 0.1,
        bullets: [],
        data: data,
        turret: holder
      }
      if(type === 1) { barrel.maxTraps = Math.min(tankCode.LIMITS.bulletsPerBarrel - 1, codeTanks.trapRate / data.reload * data.time) }
      holder.barrels.push(barrel)
      return barrel
    },
    attach: function(tank) {
      tank.codeState = null
      let body = tank.bodyData
      if(!body || !body.code) { return }
      if(!codeTanks.loaded) { codeTanks.loaded = tankCode.folder('./tankData/codes') }
      let entry = codeTanks.loaded[body.code]
      if(!entry) { return }
      let sections = [], barrels = [], auras = [], syncs = []
      let base = tank._turrets.length
      let walk = function(items, parent, k, auto) {
        for(let i=0,l=items.length;i<l;i++) {
          let n = items[i]
          if(n.t === 'section') {
            let s = { node: n, parent: parent, k: k * n.size, x: 0, y: 0, angle: 0, target: null, auto: n.turn === 'auto' ? sections.length : auto, aimCount: 0 }
            sections.push(s)
            if(n.sync >= 0) {
              let turret = { d: 0, rotationType: 2, barrels: [], detector: {}, position: 'code', count: 0 }
              tank._turrets[base + n.sync] = turret
              syncs.push({ section: s, turret: turret })
            }
            walk(n.children, sections.length - 1, k * n.size, s.auto)
          } else if(n.t === 'barrel' && !n.visual) {
            let barrel = codeTanks.barrel(n, k, tank)
            tank._barrels.push(barrel)
            let lookAuras = []
            if(n.look >= 0) {
              let look = entry.tank.looks[n.look]
              for(let j=0,m=look.length;j<m;j++) {
                if(look[j].t === 'aura' && look[j].damage > 0) { lookAuras.push(look[j]) }
              }
            }
            barrels.push({ node: n, parent: parent, k: k, auto: auto, barrel: barrel, auras: lookAuras })
          } else if(n.t === 'aura' && n.damage > 0) {
            auras.push({ node: n, parent: parent, k: k })
          }
        }
      }
      walk(entry.tank.render, -1, 1, -1)
      tank.codeState = { name: body.code, reach: entry.tank.reach, time: 0, sections: sections, barrels: barrels, auras: auras, syncs: syncs }
    },
    world: function(tank, x, y) {
      let f = tank.d + Math.PI / 2, s = Math.sin(f), c = Math.cos(f)
      return [tank.x + tank.size * (x * c - y * s), tank.y + tank.size * (x * s + y * c)]
    },
    findTarget: function(tank, s, from, keep) {
      let n = s.node
      let detect = n.detect * tank.size, forget = n.forget * tank.size
      if(keep && keep.alive !== false && keep.dim === tank.dim) {
        let dx = keep.x - from[0], dy = keep.y - from[1]
        if(dx * dx + dy * dy <= forget * forget && !keep.invisible) { return keep }
      }
      let best = null, bestDistance = detect * detect
      let tanks = tank.dim.tanks
      for(let i=tanks.length-1;i>=0;i--) {
        let t = tanks[i]
        if(t === tank || t.static || t.alive === false || t.invisible || t.passive || dimension.isSameTeam(t, tank)) { continue }
        let dx = t.x - from[0], dy = t.y - from[1]
        let d = dx * dx + dy * dy
        if(d < bestDistance) {
          bestDistance = d
          best = t
        }
      }
      return best
    },
    turn: function(tank, s, parentAngle, facing, time) {
      let n = s.node
      let free = n.relative === 'none'
      if(n.turn === 'constant') {
        let spin = n.d + n.speed * time
        return free ? spin - facing : parentAngle + spin
      }
      if(n.turn === 'mouse') { return n.d }
      if(n.turn === 'auto') {
        if(s.aimCount <= 0) {
          s.aimCount = codeTanks.aimTicks
          let from = n.fromTop ? [tank.x, tank.y] : codeTanks.world(tank, s.x, s.y)
          s.target = codeTanks.findTarget(tank, s, from, s.target)
        }
        s.aimCount --
        if(s.target) {
          let from = codeTanks.world(tank, s.x, s.y)
          return Math.atan2(s.target.y - from[1], s.target.x - from[0]) - facing
        }
        return parentAngle + n.rest
      }
      return free ? n.d - facing : parentAngle + n.d
    },
    update: function(tank) {
      let state = tank.codeState
      if(!state) { return }
      state.time += dimension.tickTime
      let facing = tank.d + Math.PI / 2
      let sections = state.sections
      for(let i=0,l=sections.length;i<l;i++) {
        let s = sections[i], n = s.node
        let p = s.parent >= 0 ? sections[s.parent] : null
        let px = p ? p.x : 0, py = p ? p.y : 0, pa = p ? p.angle : 0, pk = p ? p.k : 1
        let ps = Math.sin(pa), pc = Math.cos(pa)
        s.x = px + pk * (n.x * pc - n.y * ps)
        s.y = py + pk * (n.x * ps + n.y * pc)
        s.angle = codeTanks.turn(tank, s, pa, facing, state.time)
      }
      for(let i=0,l=state.syncs.length;i<l;i++) {
        state.syncs[i].turret.d = state.syncs[i].section.angle + tank.d
      }
      let firing = tank.firing && !tank.passive
      for(let i=0,l=state.barrels.length;i<l;i++) {
        let b = state.barrels[i], n = b.node
        let p = b.parent >= 0 ? sections[b.parent] : null
        let px = p ? p.x : 0, py = p ? p.y : 0, pa = p ? p.angle : 0
        let a = pa + n.d
        let lx = px + b.k * (n.x * Math.cos(a) - n.y * Math.sin(a))
        let ly = py + b.k * (n.x * Math.sin(a) + n.y * Math.cos(a))
        let at = codeTanks.world(tank, lx, ly)
        let holder = b.barrel.turret
        holder.gameX = at[0]
        holder.gameY = at[1]
        holder.d = a + tank.d
        holder.active = b.auto >= 0 ? !tank.passive && !!sections[b.auto].target : firing
      }
      if(tank.passive) { return }
      for(let i=0,l=state.auras.length;i<l;i++) {
        let aura = state.auras[i], n = aura.node
        let p = aura.parent >= 0 ? sections[aura.parent] : null
        let px = p ? p.x : 0, py = p ? p.y : 0, pa = p ? p.angle : 0
        let at = codeTanks.world(tank, px + aura.k * (n.x * Math.cos(pa) - n.y * Math.sin(pa)), py + aura.k * (n.x * Math.sin(pa) + n.y * Math.cos(pa)))
        codeTanks.hurt(tank, n, at[0], at[1], aura.k * tank.size)
      }
      for(let i=0,l=state.barrels.length;i<l;i++) {
        let b = state.barrels[i]
        if(!b.auras.length) { continue }
        let bullets = b.barrel.bullets
        for(let u=bullets.length-1;u>=0;u--) {
          let bullet = bullets[u]
          for(let j=0,m=b.auras.length;j<m;j++) {
            let n = b.auras[j], s = Math.sin(bullet.d + Math.PI / 2), c = Math.cos(bullet.d + Math.PI / 2)
            codeTanks.hurt(tank, n, bullet.x + bullet.size * (n.x * c - n.y * s), bullet.y + bullet.size * (n.x * s + n.y * c), bullet.size)
          }
        }
      }
    },
    hurt: function(tank, n, x, y, scale) {
      let outer = n.size * scale, inner = n.inner * scale
      let amount = dimension.tickMultiplier * n.damage * codeTanks.auraRate * tank.levelMultiplier
      let tanks = tank.dim.tanks
      for(let i=tanks.length-1;i>=0;i--) {
        let t = tanks[i]
        if(t === tank || t.static || t.alive === false || t.invincible || t.inBase || t.prevInBase || dimension.isSameTeam(t, tank)) { continue }
        let dx = t.x - x, dy = t.y - y
        let d = Math.sqrt(dx * dx + dy * dy)
        if(d > outer + t.size || d + t.size < inner) { continue }
        t.damage(amount, tank, 'tanks')
        if(n.steal > 0) { tank.health = Math.min(tank.maxHealth, tank.health + amount * n.steal) }
      }
    }
  }
