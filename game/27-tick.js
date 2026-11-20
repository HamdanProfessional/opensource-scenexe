  let stallTimes = [], lastStall = -Infinity, lastQuietLog = -Infinity
  const stallSummary = function(dim) {
    let players = 0
    for(let i=dim.tanks.length-1;i>=0;i--) {
      if(dimension.isPlayer(dim.tanks[i])) { players++ }
    }
    let top = dimension.bulletOwners(dim).slice(0, 3).map(function(e) {
      return `${e[0].name || 'unnamed'} (${e[0].weapon || '?'}-${e[0].body || '?'}) ${e[1]}`
    })
    return `${players} players, ${dim.tanks.length} tanks, ${dim.bullets.length} bullets, ${dim.polygons.length} shapes${top.length ? ', most bullets: ' + top.join(', ') : ''}`
  }
  const slowestDim = function(since) {
    let slowest = false
    for(const n in dimension.dims) {
      const d = dimension.dims[n]
      if(!(d.workPeakAt >= since)) { continue }
      if(!slowest || d.workPeak > slowest.workPeak) { slowest = d }
    }
    return slowest
  }
  const antilagCheck = function(now, stall) {
    if(now - lastStall < 1000) { return }
    lastStall = now
    const dim = slowestDim(now - stall - 1000)
    if(!dim || dim.workPeak < Math.max(50, stall / 4)) {
      if(now - lastQuietLog < 10000) { return }
      lastQuietLog = now
      console.log(`stall: ${Math.round(stall)}ms, but no dimension had a slow tick${dim ? ` (longest ${Math.round(dim.workPeak)}ms in ${dim.name})` : ''}`)
      return
    }
    stallTimes.push(now)
    while(stallTimes.length && stallTimes[0] < now - 10000) { stallTimes.shift() }
    try { console.log(`stall: ${Math.round(stall)}ms, ${dim.name} had a ${Math.round(dim.workPeak)}ms tick (usually ${Math.round(dim.workAvg || 0)}ms): ${stallSummary(dim)}`) } catch(e) {}
    if(!(stall > 2000 || stallTimes.length >= 3)) { return }
    const since = now - (dim.antilagAt || -Infinity)
    if(since < 15000) { return }
    dim.antilagAt = now
    stallTimes.length = 0
    const result = dimension.antilag(dim, since < 60000)
    let text
    if(result.full) {
      text = `antilag: ${dim.name} kept lagging, so its ${result.bullets} bullets, ${result.bots} bots and ${result.shapes} extra shapes were cleared`
    } else if(result.trimmed.length) {
      text = `antilag: ${dim.name} lagged ${Math.round(stall)}ms, cleared ${result.bullets} bullets from ${result.trimmed.map(t => `${t[0]} (${t[1]})`).join(', ')}`
    } else {
      text = `antilag: ${dim.name} lagged ${Math.round(stall)}ms, but no tank had 20 or more bullets, so nothing was cleared yet`
    }
    console.log(text)
    if(args.parentPort && !args.standalone) { args.parentPort.postMessage(['antilag', text]) }
  }
  const startTick = function(dim) {
    let gameUpdateCounter = 0, finalDamageCounter = 0, netCounter = 0, ticks = []
    dim.getTickrate = function() {
      return ticks.length
    }
    const hasPlayers = function() {
      if(dim.newTanks.length > 0) { return true }
      for(let i=dim.tanks.length-1;i>=0;i--) {
        let ws = dim.tanks[i].ws
        if(ws && ws.data && ws.data.isPlayer) { return true }
      }
      return false
    }
    function tick(now) {
      if(!hasPlayers()) {
        dim.paused = true
        dim.updateTime = 0
        ticks.length = 0
        return
      }
      dim.paused = false
      const started = _performance.now()
      ticks.push(now + 1000)
      let i = 0
      while(ticks[i] < now) {
        i ++
      }
      ticks.splice(0, i)
      if(finalDamageCounter >= dimension.finalDamageTicks - 1) {
        finalDamageCounter = 0
      } else {
        finalDamageCounter ++
      }
      let gameUpdate = (gameUpdateCounter >= dimension.gameUpdateTicks - 1)
      let netUpdate = (++netCounter >= net.sendTicks)
      dim.runTimers(dimension.tickMs)
      dimension.update(dim, {
        recordDirection: ((gameUpdateCounter + 1) % 2 === 0) || true,
        updateFinalDamage: (finalDamageCounter === 0),
        gameUpdate: gameUpdate,
        netUpdate: netUpdate
      }, now)
      if(gameUpdate) {
        dim.tickTime = dim.dt / dimension.gameUpdateTicks
        dim.dt = 0
        gameUpdateCounter = 0
      } else {
        gameUpdateCounter ++
      }
      let netStarted = 0
      if(netUpdate) {
        netStarted = _performance.now()
        netCounter = 0
        net.frame ++
        for(let i=dim.tanks.length-1;i>=0;i--) {
          let tank = dim.tanks[i]
          let ws = tank.ws
          if(ws.data.isPlayer) {
            const p = packer.gameUpdate({
              tank: tank,
              tanks: tank.fov.tanks,
              bullets: tank.fov.bullets,
              polygons: tank.fov.polygons,
              id: tank.id,
              score: Math.floor(tank.score),
              dim: tank.dim
            })
            if(p) { ws.sendPacket('gameUpdate', p) }
          }
        }
        spectate.send(dim)
        dimension.reset(dim)
      }
      const ended = _performance.now()
      const spent = ended - started
      const netSpent = netStarted ? ended - netStarted : 0
      dim.workAvg = dim.workAvg > 0 ? dim.workAvg * 0.95 + spent * 0.05 : spent
      dim.netAvg = dim.netAvg > 0 ? dim.netAvg * 0.95 + netSpent * 0.05 : netSpent
      if(!(spent <= dim.statsPeak)) { dim.statsPeak = spent }
      if(!(spent <= dim.workPeak) || started - dim.workPeakAt > 1000) {
        dim.workPeak = spent
        dim.workPeakAt = started
      }
    }

    let lastTick = 0, lt = _performance.now()
    dim.intervalId = setInterval(function() {
      let now = _performance.now()
      if(now - lt > 500 && !dim.paused) { antilagCheck(now, now - lt) }
      if(now >= lastTick) {
        lt = now
        lastTick += dimension.tickMs * (1 + Math.floor((now - lastTick) / dimension.tickMs))
        tick(now)
      }
    }, Math.max(1, Math.floor(dimension.tickMs / 2)))
  }

