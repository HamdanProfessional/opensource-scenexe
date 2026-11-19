      dragwall: [
        [[], function(data, tank, ws) {
          tank.dragWall = false
        }],
        [['string'], function(data, tank, ws) {
          let dim = tank.dim
          if(data[0] && data[0][0] === 'w') {
            let i = parseInt(data[0].slice(1))
            let wall = dim.walls[i]
            if(wall && i >= dim.defaultWalls) {
              tank.dragWall = wall
            }
          } else if(data[0] === 'snap') {
            tank.dragWallSnap = true
          } else if(data[0] = 'nosnap') {
            delete tank.dragWallSnap
          }
        }]
      ],
      wallsize: [
        [['int', 'int'], function(data, tank, ws) {
          let i = tank.dim.walls.indexOf(tank.dragWall)
          if(tank.dragWall && i >= 0) {
            tank.dragWall[2] = data[0] > 10 ? data[0] : 10
            tank.dragWall[3] = data[1] > 10 ? data[1] : 10
            tank.dim.updatedWalls[i] = tank.dragWall
          }
        }]
      ],
      wallteam: [
        [['int'], function(data, tank, ws) {
          let i = tank.dim.walls.indexOf(tank.dragWall)
          if(tank.dragWall && i >= 0) {
            tank.dragWall[4] = data[0] >= 0 ? data[0] : 0
            tank.dim.updatedWalls[i] = tank.dragWall
          }
        }]
      ],
      createwall: [
        [[], function(data, tank, ws) {
          let w = [tank.mousePosition[0], tank.mousePosition[1], 100, 100]
          let dim = tank.dim
          let i = 0
          for(i=dim.defaultWalls,l=dim.walls.length;i<l;i++) {
            if(!dim.walls[i]) {
              break
            }
          }
          tank.dragWall = w
          dim.walls[i] = w
          dim.updatedWalls[i] = w
        }],
      ],
      savewalls: [
        [['string'], function(data, tank, ws) {
          if(data[0][0] === 'm') {
            return ws.sendPacket('announcement', 'The name started with m, try a different one!')
          }
          let r = dimension.saveWalls(tank.dim, data[0])
          ws.sendPacket('announcement', r)
        }]
      ],
      downloadwalls: [
        [[], function(data, tank, ws) {
          let a = tank.dim.walls.slice(tank.dim.defaultWalls)
          if(a.length > 0) {
            ws.sendPacket('eval', JSON.stringify(a))
            ws.sendPacket('announcement', 'Copied to clipboard')
          }
        }]
      ],
      loadwalls: [
        [['string'], function(data, tank, ws) {
          let r = dimension.loadWalls(tank.dim, data[0])
          ws.sendPacket('announcement', r)
        }]
      ],
      uploadwalls: [
        [['*'], function(data, tank, ws) {
          try {
            let a = JSON.parse(data[0])
            if(a && a.length > 0) {
              let r = dimension.loadWalls(tank.dim, a, true)
              ws.sendPacket('announcement', r)
            } else {
              ws.sendPacket('announcement', 'Failed: ')
            }
          } catch(e) {
            ws.sendPacket('announcement', 'Failed: ' + e)
          }
        }]
      ],
      removewormhole: [
        [['string'], function(data, tank, ws) {
          let dim = tank.dim
          if(data[0] === 'wormholes') {
            for(let i in dim.wormholes) {
              let w = dim.wormholes[i]
              if(!w.static) {
                w.remove()
              }
            }
          } if(data[0] && data[0][0] === 'w') {
            let i = parseInt(data[0].slice(1))
            let w = dim.wormholes[i]
            if(w && !w.static) {
              w.remove()
            }
          }
        }]
      ],
      removewall: [
        [['string'], function(data, tank, ws) {
          let dim = tank.dim
          if(data[0] === 'walls') {
            let l = dim.walls.length
            if(l > dim.defaultWalls) {
              for(let i=dim.defaultWalls;i<l;i++) {
                dim.removedWalls[i] = i
              }
              dim.walls = dim.walls.slice(0, dim.defaultWalls)
            }
          } if(data[0] && data[0][0] === 'w') {
            let i = parseInt(data[0].slice(1))
            let wall = dim.walls[i]
            if(wall && i >= dim.defaultWalls) {
              let l = dim.walls.length - 1
              if(i === l) {
                dim.walls.splice(l, 1)
              } else {
                delete dim.walls[i]
              }
              dim.removedWalls[i] = i
            }
          }
        }]
      ],
