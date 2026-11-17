!function() {
  const dim = dimension.create({
    mapSize: 6000,
    name: '4teams',
    type: '4teams',
    isMain: true,
    freeJoin: true,
    displayName: '4 Teams',
    displayColor: 3,
    walls: [
      [-5200, -5200, 800, 800, 1],
      [5200, -5200, 800, 800, 2],
      [5200, 5200, 800, 800, 3],
      [-5200, 5200, 800, 800, 4],
    ],
    gates: [],
    ...mainModeLook,
    maxPolygonSides: 13,
    maxPolygonCount: 300,
    spawnPlayer: function(team, tank, prevDim) {
      if(prevDim === 'clans') { return [0, 0] }
      return defenderSpawn(defenders, team, [0, 0.5, -0.5, 1]) || randomSpawnAwayFromTanks(dim, dim.mapSize - 2000)
    }
  })
  wormhole.main(dim)
  let defenders = {
    1: [],
    2: [],
    3: [],
    4: []
  }
  for(let i=0;i<4;i++) {
    let team = i + 1
    defenders[team].push(createDefender(dim, [-5200, 5200, 5200, -5200][i], [-5200, -5200, 5200, 5200][i], team, TEAM_NAMES[team] + ' Defender'))
  }
  spawnCenterPolygon(dim)
}()
