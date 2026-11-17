!function() {
  let teams = [1, 2, 3, 4]
  let teamCodeA = teams.splice(Math.floor(Math.random() * 4), 1)[0]
  let teamCodeB = teams.splice(Math.floor(Math.random() * 3), 1)[0]
  const dim = dimension.create({
    teamCodeA: teamCodeA,
    teamCodeB: teamCodeB,
    mapSize: 6000,
    name: '2teams',
    type: '2teams',
    displayName: '2 Teams',
    displayColor: 4,
    isMain: true,
    freeJoin: true,
    walls: [
      [-5200, 0, 800, 6000, teamCodeA],
      [5200, 0, 800, 6000, teamCodeB]
    ],
    gates: [],
    ...mainModeLook,
    maxPolygonSides: 13,
    maxPolygonCount: 300,
    spawnPlayer: function(team, tank) {
      return defenderSpawn(defenders, team, [0, -0.5, 0.5, 1]) || randomSpawnAwayFromTanks(dim, dim.mapSize - 2000)
    }
  })
  wormhole.main(dim)
  let defenders = {
    [teamCodeA]: [],
    [teamCodeB]: []
  }
  let teamA = TEAM_NAMES[teamCodeA] + ' Defender'
  let teamB = TEAM_NAMES[teamCodeB] + ' Defender'
  for(let i=-5200;i<=5200;i+=2080) {
    defenders[teamCodeA].push(createDefender(dim, -5200, i, teamCodeA, teamA))
    defenders[teamCodeB].push(createDefender(dim, 5200, i, teamCodeB, teamB))
  }
  spawnCenterPolygon(dim)
  spawnCenterBosses(dim)
}()
