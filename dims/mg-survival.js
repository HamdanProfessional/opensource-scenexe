!function() {
  const PLAYER_LEVEL = 90
  const PLAYER_TEAM = 1
  const SWARM_TEAM = 2
  const MAX_ALIVE = 60
  const BREAK_MS = 6000
  const COUNTDOWN_MS = 5000
  const SPAWN_GAP_MS = 400
  const ENEMIES = {
    thorn: { name: 'Beta Thorn', weapon: 'beta', body: 'thorn', level: 30 },
    saw: { name: 'Alpha Saw', weapon: 'alpha', body: 'saw', level: 45 }
  }

  const scoreForLevel = function(level) {
    return Math.ceil(500 * (Math.pow(1.2, level - 1) - 1)) + 1
  }

  const dim = dimension.create({
    mapSize: 3000,
    name: 'mg:survival',
    type: 'survival',
    freeJoin: true,
    displayName: 'Survival',
    entryMessage: 'Entering Survival...',
    displayColor: 2,
    walls: [],
    gates: [],
    ...mainModeLook,
    maxPolygonSides: 3,
    maxPolygonCount: 0,
    spawnPlayer: function(team, tank) {
      tank.team = PLAYER_TEAM
      dim.after(function() {
        if(tank.dim !== dim || !tank.alive) { return }
        if(tank.level < PLAYER_LEVEL) {
          tank.rScore = tank.score = scoreForLevel(PLAYER_LEVEL)
          if(tank.update) { tank.update() }
        }
        dim.updatedTanks[tank.id] = tank
        if(tank.ws && tank.ws.sendPacket) {
          tank.ws.sendPacket('announcement', state.phase === 'playing'
            ? `Survival: wave ${state.wave} is in progress, help your team survive!`
            : 'Survival: fully upgrade your weapon and body, the swarm starts when everyone is ready.')
        }
      }, 300)
      return [(2 * Math.random() - 1) * 300, (2 * Math.random() - 1) * 300]
    }
  })

  const state = {
    phase: 'waiting',
    wave: 0,
    queue: [],
    swarm: [],
    fighters: new Set(),
    readyText: '',
    nextAt: 0,
    best: 0
  }

  const isPlayer = function(tank) {
    return tank.alive !== false && tank.ws && tank.ws.data && tank.ws.data.isPlayer
  }

  const players = function() {
    return dim.tanks.filter(isPlayer)
  }

  const canUpgrade = function(map, name, level) {
    const entry = map[name]
    if(!entry) { return false }
    const levels = entry.levels || entry.upgrades.map(function() { return entry.level })
    return levels.some(function(l) { return l <= level })
  }

  const fullyUpgraded = function(tank) {
    return tank.level >= PLAYER_LEVEL &&
      !canUpgrade(tankData.weaponUpgradeMap, tank.weapon, tank.level) &&
      !canUpgrade(tankData.bodyUpgradeMap, tank.body, tank.level)
  }

  const nearestPlayer = function(bot) {
    let best = null, bestDist = Infinity
    for(const tank of dim.tanks) {
      if(!isPlayer(tank)) { continue }
      const dx = tank.x - bot.x, dy = tank.y - bot.y, d = dx * dx + dy * dy
      if(d < bestDist) { bestDist = d; best = tank }
    }
    return best
  }

  const chase = function(bot) {
    return function() {
      const target = nearestPlayer(bot)
      if(!target) {
        bot.input.movement = [0, 0]
        bot.firing = false
        return
      }
      const dx = target.x - bot.x, dy = target.y - bot.y
      const r = Math.sqrt(dx * dx + dy * dy) || 1
      bot.input.movement = [dx / r, dy / r]
      bot.mousePosition = [target.x, target.y]
      bot.controlPosition = [dx, dy]
      bot.firing = r < 900
      bot.d = Math.atan2(-dx, dy)
    }
  }

  const edgePosition = function() {
    const s = dim.mapSize * 0.92
    const t = (2 * Math.random() - 1) * s
    switch(Math.floor(Math.random() * 4)) {
      case 0: return [t, -s]
      case 1: return [t, s]
      case 2: return [-s, t]
      default: return [s, t]
    }
  }

  const spawnEnemy = function(kind) {
    const e = ENEMIES[kind]
    const [x, y] = edgePosition()
    const bot = generator.tank({
      dim: dim,
      x: x,
      y: y,
      name: e.name,
      weapon: e.weapon,
      body: e.body,
      score: scoreForLevel(e.level),
      radiant: 0,
      team: SWARM_TEAM,
      forceDeathScore: 0,
      noKillNotification: true,
      invincible: false
    })
    bot.invincible = false
    bot.invincibleTime = false
    bot.ai = chase(bot)
    state.swarm.push(bot)
  }

  const waveSize = function(wave, count) {
    const scale = 1 + 0.5 * (count - 1)
    return {
      thorn: Math.round((4 + 3 * wave) * scale),
      saw: Math.round(Math.max(0, 2 * wave - 3) * scale)
    }
  }

  const startWave = function() {
    state.wave ++
    const size = waveSize(state.wave, Math.max(1, players().length))
    const queue = []
    for(let i=0;i<size.thorn;i++) { queue.push('thorn') }
    for(let i=0;i<size.saw;i++) { queue.push('saw') }
    for(let i=queue.length-1;i>0;i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]]
    }
    state.queue = queue
    state.phase = 'playing'
    for(const tank of players()) { state.fighters.add(tank.id) }
    const plural = function(n, word) { return `${n} ${word}${n === 1 ? '' : 's'}` }
    dim.broadcast(`Wave ${state.wave}: ${plural(size.thorn, 'Beta Thorn')}${size.saw ? ` and ${plural(size.saw, 'Alpha Saw')}` : ''} incoming!`)
  }

  const clearSwarm = function() {
    for(const bot of state.swarm) {
      if(bot.alive !== false && bot.remove) { bot.remove() }
    }
    state.swarm = []
    state.queue = []
  }

  const reset = function(reason) {
    clearSwarm()
    if(reason) { dim.broadcast(reason) }
    state.best = Math.max(state.best, state.wave - 1)
    state.phase = 'waiting'
    state.wave = 0
    state.fighters = new Set()
    state.readyText = ''
  }

  const updateWaiting = function(list) {
    const ready = list.filter(fullyUpgraded).length
    if(list.length > 0 && ready === list.length) {
      state.phase = 'countdown'
      state.nextAt = dim.simTime + COUNTDOWN_MS
      dim.broadcast(`Everyone is fully upgraded! The swarm arrives in ${COUNTDOWN_MS / 1000} seconds.`)
      return
    }
    const text = `Waiting for everyone to fully upgrade their weapon and body (${ready}/${list.length} ready)`
    if(text !== state.readyText) {
      state.readyText = text
      dim.broadcast(text)
    }
  }

  dim.every(function() {
    const list = players()
    if(state.phase !== 'waiting' && !list.some(function(t) { return state.fighters.has(t.id) }) && state.phase !== 'countdown') {
      reset(state.wave > 0 ? `The swarm won. Your team survived ${state.wave - 1} wave${state.wave - 1 === 1 ? '' : 's'}.` : '')
    }
    state.swarm = state.swarm.filter(function(bot) { return bot.alive !== false && dim.tanks.indexOf(bot) >= 0 })
    if(state.phase === 'waiting') {
      updateWaiting(list)
    } else if(state.phase === 'countdown') {
      if(!list.length || !list.every(fullyUpgraded)) {
        state.phase = 'waiting'
        state.readyText = ''
        dim.broadcast('Countdown cancelled: someone is not fully upgraded.')
      } else if(dim.simTime >= state.nextAt) {
        startWave()
      }
    } else if(state.phase === 'playing') {
      for(const tank of list) { state.fighters.add(tank.id) }
      if(state.queue.length && state.swarm.length < MAX_ALIVE && dim.simTime >= state.nextAt) {
        spawnEnemy(state.queue.pop())
        state.nextAt = dim.simTime + SPAWN_GAP_MS
      }
      if(!state.queue.length && !state.swarm.length) {
        state.phase = 'break'
        state.nextAt = dim.simTime + BREAK_MS
        dim.broadcast(`Wave ${state.wave} cleared! Next wave in ${BREAK_MS / 1000} seconds.`)
      }
    } else if(state.phase === 'break') {
      if(dim.simTime >= state.nextAt) { startWave() }
    }
  }, 100)
}()
