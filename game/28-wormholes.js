  const wormhole = {
    count: function(dim, type) {
      let arr = []
      for(let i in dim.wormholes) {
        let wormhole = dim.wormholes[i]
        if(wormhole.type === type) {
          arr.push(wormhole)
        }
      }
      return arr
    },
    main: function(dim) {
      dim.every(function() {
        if(Math.random() < 0.3) {
          let arr = wormhole.count(dim, 0)
          let p = 0
          if(arr.length === 0) {
            p = 0.5
          } else {
            p = 1 / (2 + arr.length)
          }
          if(Math.random() < p) {
            let s = dim.mapSize - 2000
            let x = (2 * Math.random() - 1) * s, y = (2 * Math.random() - 1) * s
            if(Math.random() < 0.003) {
              if(Math.random() < 0.00034) {
                dim.broadcast(`[404]: CRITICAL ERROR OCCURED DURING WORMHOLE CREATION!`)
                generator.wormhole({
                  x: x,
                  y: y,
                  size: 500,
                  type: 0,
                  radiant: 1,
                  time: 60 + 120 * Math.random(),
                  dim: dim,
                  action: function(tank) {
                    dimension.sendTankTo({
                      tank: tank,
                      dim: 'voiddMaze'
                    })
                  }
                })
              } else {
                generator.wormhole({
                  x: x,
                  y: y,
                  size: 100,
                  type: 0,
                  radiant: 1,
                  time: 60 + 120 * Math.random(),
                  dim: dim,
                  action: function(tank) {
                    dimension.sendTankTo({
                      tank: tank,
                      dim: 'abyssHallway'
                    })
                  }
                })
              }
            } else {
              generator.wormhole({
                x: x,
                y: y,
                size: 100,
                type: 0,
                time: 60 + 120 * Math.random(),
                dim: dim,
                action: function(tank) {
                  let _b = tank.dim.bodies[tank.body] || {}
                  if(tank.team !== 6 && !_b.celestial) {
                    tank.ascend()
                  } if(tank.team !== 7) {
                    dimension.sendTankTo({
                      tank: tank,
                      dim: 'sanctuary',
                    })
                  } else {
                    dimension.sendTankTo({
                      tank: tank,
                      dim: ['ffa', '2teams', '4teams'][Math.floor(Math.random() * 3)]
                    })
                  }
                },
                onRupture: function(wormhole) {
                  wormhole.action = function(tank) {
                    dimension.sendTankTo({
                      tank: tank,
                      dim: 'crossroadsLobby',
                    })
                  }
                }
              })
            }
          }
        }
      }, 1000)
      dim.every(function() {
        let s = dim.mapSize - 2000
        let x = (2 * Math.random() - 1) * s, y = (2 * Math.random() - 1) * s
        generator.wormhole({
          x: x,
          y: y,
          size: 100,
          type: 0,
          radiant: 1,
          time: 3,
          dim: dim,
          ruptured: true,
          action: function(tank) {
            dimension.sendTankTo({
              tank: tank,
              dim: 'abyssHallway'
            })
          }
        })
      }, 600000)
    }
  }

