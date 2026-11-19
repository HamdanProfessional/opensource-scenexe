  let stallTimes = [], lastAntilag = -Infinity, lastStallLog = {}
  const stallSummary = function(dim) {
    let players = 0, owners = new Map()
    for(let i=dim.tanks.length-1;i>=0;i--) {
      let t = dim.tanks[i]
      if(t.ws && t.ws.data && t.ws.data.isPlayer) { players++ }
    }
    for(let i=dim.bullets.length-1;i>=0;i--) {
      let owner = dim.bullets[i].parent
      for(let k=0;k<10 && owner && owner.parent && owner.parent !== owner;k++) { owner = owner.parent }
      if(owner) { owners.set(owner, (owners.get(owner) || 0) + 1) }
    }
    let top = [...owners].sort(function(a, b) { return b[1] - a[1] }).slice(0, 3).map(function(e) {
      return `${e[0].name || 'unnamed'} (${e[0].weapon || '?'}-${e[0].body || '?'}) ${e[1]}`
    })
    return `${players} players, ${dim.tanks.length} tanks, ${dim.bullets.length} bullets, ${dim.polygons.length} shapes${top.length ? ', most bullets: ' + top.join(', ') : ''}`
  }
  const antilagCheck = function(now, stall, dim) {
    if(!(now - (lastStallLog[dim.name] || -Infinity) < 5000)) {
      lastStallLog[dim.name] = now
      try { console.log(`stall: ${Math.round(stall)}ms in ${dim.name}: ${stallSummary(dim)}`) } catch(e) {}
    }
    if(stallTimes.length === 0 || now - stallTimes[stallTimes.length - 1] > 1000) { stallTimes.push(now) }
    while(stallTimes.length && stallTimes[0] < now - 10000) { stallTimes.shift() }
    if((stall > 2000 || stallTimes.length >= 3) && now - lastAntilag > 15000) {
      lastAntilag = now
      stallTimes.length = 0
      console.log(`antilag: ${Math.round(stall)}ms stall in ${dim.name}`)
      dimension.antilag()
    }
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
      if(netUpdate) {
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
    }

    let lastTick = 0, lt = 0
    dim.intervalId = setInterval(function() {
      let now = _performance.now()
      if(now - lt > 500 && !dim.paused) { antilagCheck(now, now - lt, dim) }
      if(now >= lastTick) {
        lt = now
        lastTick += dimension.tickMs * (1 + Math.floor((now - lastTick) / dimension.tickMs))
        tick(now)
      }
    }, Math.max(1, Math.floor(dimension.tickMs / 2)))
  }

