!function() {
  const dim = dimension.create({
    mapSize: 6000,
    name: 'ffa',
    type: 'ffa',
    isMain: true,
    freeJoin: true,
    displayName: 'Free For All',
    displayColor: 0,
    walls: [],
    gates: [],
    ...mainModeLook,
    maxPolygonSides: 13,
    maxPolygonCount: 300,
    spawnPlayer: function(team, tank) {
      return randomSpawnAwayFromTanks(dim, dim.mapSize)
    }
  })
  wormhole.main(dim)
  spawnCenterPolygon(dim)
}()
