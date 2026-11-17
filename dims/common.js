
const mainModeLook = {
  background: { r: 205, g: 205, b: 205 },
  grid: { r: 200, g: 200, b: 200 },
  gridSize: 25
}

const TEAM_NAMES = ['None', 'Blue', 'Red', 'Green', 'Purple']

const randomSpawnAwayFromTanks = function(dim, range, minDist, tries) {
  minDist = minDist || 1500
  return dimension.getSpawnPosition(function() {
    return [(2 * Math.random() - 1) * range, (2 * Math.random() - 1) * range]
  }, function(p) {
    let d = dimension.findClosestTank(p[0], p[1], dim.tanks)
    return d[0] > minDist * minDist
  }, tries || 10)
}

const spawnOutsideRadius = function(range, minDistSq, shift) {
  shift = shift || [-300, -300]
  let x = 0, y = 0, r = 0
  while(r < minDistSq) {
    x = (2 * Math.random() - 1) * range
    y = (2 * Math.random() - 1) * range
    r = x * x + y * y
  }
  return [x + shift[0], y + shift[1]]
}

const createDefender = function(dim, x, y, team, name) {
  let ws = {
    data: {},
    sendPacket: function() {}
  }
  let defender = generator.tank({
    dim: dim,
    x: x,
    y: y,
    name: name,
    static: true,
    weapon: 'defender',
    body: 'defender',
    score: 17694994357968816000,
    radiant: 0,
    team: team,
    invincible: false,
    ai: 'defender'
  }, ws)
  ws.data.tank = defender
  return defender
}

const defenderSpawn = function(defenders, team, sides) {
  let d = defenders[team]
  if(!d || d.length === 0) { return false }
  let t = Math.floor(Math.random() * 4)
  d = d[Math.floor(Math.random() * d.length)]
  d.firedBarrels[t + 8] = t + 8
  let x = d.x, y = d.y
  let a = d.d + sides[t] * Math.PI
  let r = d.size - 50
  return [x + r * Math.sin(a), y - r * Math.cos(a)]
}

const spawnCenterPolygon = function(dim, delay) {
  dim.after(function() {
    generator.polygon({
      x: 0,
      y: 0,
      d: 2 * Math.PI * Math.random(),
      sides: -5,
      dim: dim,
      radiant: 5
    })
  }, delay || 5000)
}

const spawnCenterBosses = function(dim) {
  if(!generator.bossIds().length) { return }
  let boss = false, nextTime = Date.now() + 60000 * (1 + Math.random())
  let check = function() {
    if(boss && boss.alive) {
      nextTime = Date.now() + 60000 * (3 + 4 * Math.random())
    } else if(Date.now() >= nextTime) {
      let id = generator.randomBoss()
      boss = generator.boss(dim, id, 0, 0)
      dim.broadcast(`${tankData.bodies[id].boss.name} has appeared in the center!`)
      nextTime = Date.now() + 60000 * (3 + 4 * Math.random())
    }
    dim.after(check, 10000)
  }
  dim.after(check, 10000)
}
