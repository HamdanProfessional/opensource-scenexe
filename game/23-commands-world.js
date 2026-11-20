      boss: [
        [[], function(data, tank, ws) {
          commands.spawnBoss(tank, ws, 'random', tank.mousePosition)
        }],
        [['string'], function(data, tank, ws) {
          commands.spawnBoss(tank, ws, data[0], tank.mousePosition)
        }],
        [['string', 'position'], function(data, tank, ws) {
          commands.spawnBoss(tank, ws, data[0], data[1])
        }]
      ],
      tankcode: [
        [[], function(data, tank, ws) {
          commands.listCodes(tank, ws)
        }],
        [['string'], function(data, tank, ws) {
          commands.becomeCode([tank], ws, data[0])
        }],
        [['targets', 'string'], function(data, tank, ws) {
          commands.becomeCode(data[0], ws, data[1])
        }]
      ],
      becomeboss: [
        [['string'], function(data, tank, ws) {
          commands.becomeBoss([tank], ws, data[0])
        }],
        [['targets', 'string'], function(data, tank, ws) {
          commands.becomeBoss(data[0], ws, data[1])
        }]
      ],
      polygon: [
        [['int'], function(data, tank, ws) {
          let sides = data[0]
          if(sides >= 3) {
            generator.polygon({
              x: tank.x,
              y: tank.y,
              d: 2 * Math.PI * Math.random(),
              sides: sides,
              dim: tank.dim,
              radiant: 0,
            })
          }
        }],
        [['int', 'int'], function(data, tank, ws) {
          let sides = data[0]
          let radiant = data[1]
          if(sides >= 3 && sides <= 20) {
            generator.polygon({
              x: tank.x,
              y: tank.y,
              d: 2 * Math.PI * Math.random(),
              sides: sides,
              dim: tank.dim,
              radiant: radiant,
            })
          }
        }],
        [['int', 'position'], function(data, tank, ws) {
          let sides = data[0]
          let position = data[1]
          if(sides >= 3) {
            generator.polygon({
              x: position[0],
              y: position[1],
              d: 2 * Math.PI * Math.random(),
              sides: sides,
              dim: tank.dim,
              radiant: 0,
            })
          }
        }],
        [['int', 'int', 'position'], function(data, tank, ws) {
          let sides = data[0]
          let radiant = data[1]
          let position = data[2]
          if(sides >= 3) {
            generator.polygon({
              x: position[0],
              y: position[1],
              d: 2 * Math.PI * Math.random(),
              sides: sides,
              dim: tank.dim,
              radiant: radiant,
            })
          }
        }]
      ],
      polyhedra: [
        [['int'], function(data, tank, ws) {
          let sides = data[0]
          if(sides >= 1 && sides <= 5) {
            generator.polygon({
              x: tank.x,
              y: tank.y,
              d: 2 * Math.PI * Math.random(),
              sides: -sides,
              dim: tank.dim,
              radiant: 0,
            })
          }
        }],
        [['int', 'int'], function(data, tank, ws) {
          let sides = data[0]
          let radiant = data[1]
          if(sides >= 1 && sides <= 5) {
            generator.polygon({
              x: tank.x,
              y: tank.y,
              d: 2 * Math.PI * Math.random(),
              sides: -sides,
              dim: tank.dim,
              radiant: radiant,
            })
          }
        }],
        [['int', 'position'], function(data, tank, ws) {
          let sides = data[0]
          let position = data[1]
          if(sides >= 1 && sides <= 5) {
            generator.polygon({
              x: position[0],
              y: position[1],
              d: 2 * Math.PI * Math.random(),
              sides: -sides,
              dim: tank.dim,
              radiant: 0,
            })
          }
        }],
        [['int', 'int', 'position'], function(data, tank, ws) {
          let sides = data[0]
          let radiant = data[1]
          let position = data[2]
          if(sides >= 1 && sides <= 5) {
            generator.polygon({
              x: position[0],
              y: position[1],
              d: 2 * Math.PI * Math.random(),
              sides: -sides,
              dim: tank.dim,
              radiant: radiant,
            })
          }
        }]
      ],
      darkness: [
        [['float'], function(data, tank, ws) {
          let dim = tank.dim
          dim.setDarkness(data[0])
        }]
      ],
      maxpolygonsides: [
        [[], function(data, tank, ws) {
          let dim = tank.dim
          dim.maxPolygonSides = dim._maxPolygonSides
        }],
        [['int'], function(data, tank, ws) {
          let dim = tank.dim
          dim.maxPolygonSides = data[0] > 100 ? 100 : data[0]
        }],
      ],
      maxpolygoncount: [
        [[], function(data, tank, ws) {
          let dim = tank.dim
          dim.maxPolygonCount = dim._maxPolygonCount
        }],
        [['int'], function(data, tank, ws) {
          let dim = tank.dim
          dim.maxPolygonCount = data[0] > 1000000 ? 100000 : data[0]
        }],
      ],
      mapsize: [
        [[], function(data, tank, ws) {
          let dim = tank.dim
          if(dim.allowScale) {
            dim._mapSize = dim.mapSize
            dim.mapSizeSpeed = 0
          }
        }],
        [['int'], function(data, tank, ws) {
          let dim = tank.dim
          if(dim.allowScale) {
            let s = data[0]
            if(s < 1) { s = 1 }
            if(s > 100000) { s = 100000 }
            dim.mapSize = s
          }
        }],
        [['int', 'int'], function(data, tank, ws) {
          let dim = tank.dim
          if(dim.allowScale) {
            let s = data[0], t = data[1]
            if(s < 1) { s = 1 }
            if(s > 100000) { s = 100000 }
            if(t < 1) { t = 1 }
            dim._mapSize = s
            dim.mapSizeSpeed = t * 0.01 * dimension.per50
          }
        }]
      ],
      xp: [
        [['float'], function(data, tank, ws) {
          tank.rScore = tank.score = data[0]
          tank.dim.updatedTanks[tank.id] = tank
          tank.update()
        }],
        [['targets', 'float'], function(data, tank, ws) {
          let targets = data[0]
          let score = data[1]
          for(let i=targets.length-1;i>=0;i--) {
            let object = targets[i]
            if('score' in object && !object.static && (!('sides' in object) || object.sides >= 0)) {
              object.rScore = object.score = score
              if(object.objectType === 'tank') {
                object.dim.updatedTanks[object.id] = object
              }
              if(object.update) { object.update() }
            }
          }
        }]
      ],
      level: [
        [['float'], function(data, tank, ws) {
          commands.setLevel(tank, data[0])
        }],
        [['targets', 'float'], function(data, tank, ws) {
          let targets = data[0]
          for(let i=targets.length-1;i>=0;i--) {
            let object = targets[i]
            if(object.objectType === 'tank' && !object.static) {
              commands.setLevel(object, data[1])
            }
          }
        }]
      ],
      addxp: [
        [['float'], function(data, tank, ws) {
          tank.score += data[0]
          tank.rScore += data[0]
          tank.dim.updatedTanks[tank.id] = tank
          tank.update()
        }],
        [['targets', 'float'], function(data, tank, ws) {
          let targets = data[0]
          let score = data[1]
          for(let i=targets.length-1;i>=0;i--) {
            let object = targets[i]
            if('score' in object && !object.static && (!('sides' in object) || object.sides >= 0)) {
              object.score += score
              if(object.objectType === 'tank') {
                object.dim.updatedTanks[object.id] = object
                object.rScore += score
              }
              if(object.update) { object.update() }
            }
          }
        }]
      ],
      maxxp: [
        [['float'], function(data, tank, ws) {
          if(tank.score > data[0]) {
            tank.rScore = tank.score = data[0]
            tank.dim.updatedTanks[tank.id] = tank
            tank.update()
          }
        }],
        [['targets', 'float'], function(data, tank, ws) {
          let targets = data[0]
          let score = data[1]
          for(let i=targets.length-1;i>=0;i--) {
            let object = targets[i]
            if('score' in object && !object.static && (!('sides' in object) || object.sides >= 0) && object.score > score) {
              object.score = score
              if(object.objectType === 'tank') {
                object.dim.updatedTanks[object.id] = object
              }
              if(object.update) { object.update() }
            }
          }
        }]
      ],
      minxp: [
        [['float'], function(data, tank, ws) {
          if(tank.score < data[0]) {
            tank.rScore = tank.score = data[0]
            tank.dim.updatedTanks[tank.id] = tank
            tank.update()
          }
        }],
        [['targets', 'float'], function(data, tank, ws) {
          let targets = data[0]
          let score = data[1]
          for(let i=targets.length-1;i>=0;i--) {
            let object = targets[i]
            if('score' in object && !object.static && (!('sides' in object) || object.sides >= 0) && object.score < score) {
              object.score = score
              if(object.objectType === 'tank') {
                object.dim.updatedTanks[object.id] = object
              }
              if(object.update) { object.update() }
            }
          }
        }]
      ],
