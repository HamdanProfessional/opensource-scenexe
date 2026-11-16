!function() {
  const SPAWN_SCORE = 23477631
  const WINDOW_MS = 3000
  const DUMMY_SPOTS = [[0, -500], [-700, 400], [700, 400]]

  const dim = dimension.create({
    mapSize: 1600,
    name: 'testing',
    type: 'ffa',
    sandbox: true,
    freeJoin: true,
    displayName: 'Testing Range',
    entryMessage: 'Entering the Testing Range...',
    displayColor: 0,
    walls: [],
    gates: [],
    ...mainModeLook,
    maxPolygonSides: 3,
    maxPolygonCount: 0,
    spawnPlayer: function(team, tank) {
      setTimeout(function() {
        if(tank.dim !== dim) { return }
        tank.rScore = tank.score = SPAWN_SCORE
        if(tank.update) { tank.update() }
        dim.updatedTanks[tank.id] = tank
        if(tank.ws && tank.ws.sendPacket) {
          tank.ws.sendPacket('announcement', 'Testing Range: shoot a dummy, its name shows your damage per second.')
        }
      }, 300)
      return [0, 300]
    }
  })

  const dummies = []
  let clock = 0

  const makeDummy = function(spot) {
    const dummy = generator.tank({
      dim: dim,
      x: spot[0],
      y: spot[1],
      name: 'Dummy',
      weapon: 'node',
      body: 'base',
      score: 0,
      radiant: 0,
      team: 8,
    })
    dummy.noKillNotification = true
    dummy.spot = spot
    dummy.hits = []
    dummy.lastLabel = ''
    dummy.invincible = false
    dummy.invincibleTime = false
    dummy.damage = function(amount, object) {
      if(amount > 0) {
        dummy.hits.push([clock, amount, object && object.name ? object.name : ''])
      }
    }
    dummies.push(dummy)
    return dummy
  }

  const label = function(dummy, now) {
    const cutoff = now - WINDOW_MS
    while(dummy.hits.length && dummy.hits[0][0] < cutoff) { dummy.hits.shift() }
    if(!dummy.hits.length) { return 'Dummy' }
    let total = 0
    const byName = {}
    for(const hit of dummy.hits) {
      total += hit[1]
      byName[hit[2]] = (byName[hit[2]] || 0) + hit[1]
    }
    const span = Math.max(1000, Math.min(WINDOW_MS, now - dummy.hits[0][0]))
    let top = '', topDamage = -1
    for(const name in byName) {
      if(byName[name] > topDamage) { top = name; topDamage = byName[name] }
    }
    const dps = Math.round(total / span * 1000)
    return `${dps} DPS${top ? ' (' + top.slice(0, 20) + ')' : ''}`
  }

  let nextLabel = 0
  dim.onUpdate = function(data) {
    clock = data.now
    for(const tank of dim.tanks) {
      if(tank.ws && tank.ws.data && tank.ws.data.isPlayer) { tank.health = tank.maxHealth }
    }
    for(let i=dummies.length-1;i>=0;i--) {
      const dummy = dummies[i]
      if(!dummy.alive) {
        dummies.splice(i, 1)
        makeDummy(dummy.spot)
        continue
      }
      dummy.x = dummy.spot[0]
      dummy.y = dummy.spot[1]
      dummy.xv = 0
      dummy.yv = 0
      dummy.health = dummy.maxHealth
      dummy.invincible = false
      dummy.invincibleTime = false
    }
    if(data.now >= nextLabel) {
      nextLabel = data.now + 500
      for(const dummy of dummies) {
        const text = label(dummy, data.now)
        if(text !== dummy.lastLabel) {
          dummy.lastLabel = text
          dummy.name = text
          dim.updatedTanks[dummy.id] = dummy
        }
      }
    }
  }

  setTimeout(function() {
    for(const spot of DUMMY_SPOTS) { makeDummy(spot) }
  }, 1000)
}()
