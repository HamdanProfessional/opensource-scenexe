!function() {
    let wormholePositions = []
    let generated = (function() {
      let s = 25, sm = s - 1
      let inc = function(a) {
        a[0] = Math.round(a[0] * 0.94)
        a[1] = Math.round(a[1] * 0.94)
        return a
      }
      let shift = function(a) {
        a[0] += Math.floor(3 * Math.random()) - 1
        a[1] += Math.floor(3 & Math.random()) - 1
        return a
      }
      let corners = [[-19, -19], [19, 19], [19, -19], [-19, 19], [0, 19], [19, 0], [0, -19], [-19, 0]]
      let c1 = corners.splice(Math.floor(Math.random() * 4), 1)[0]
      let abyss1 = shift(inc(c1))
      let c2 = corners.splice(Math.floor(Math.random() * 3), 1)[0]
      let abyss2 = shift(inc(c2))
      for(let i=corners.length-1;i>=0;i--) {
        shift(shift(shift(corners[i])))
        wormholePositions.push(corners[i])
      }
      let gates = [
        [0, 8300, 0, 0, 200, false, 0],
        [0, -8300, 0, 0, 200, false, 0],
        [0, 0, 8300, 1, 200, false, 0],
        [0, 0, -8300, 1, 200, false, 0]
      ]
      let addgates = function(x, y) {
        gates.push(
          [1, x - 300, y, 2, 150, false, 0],
          [1, x + 300, y, 0, 150, false, 0],
          [1, x, y - 300, 3, 150, false, 0],
          [1, x, y + 300, 1, 150, false, 0]
        )
      }
      corners.push([25, 0, 1], [0, 25, 1], [-25, 0, 1], [0, -25, 1])
      let dist = function(a, b, c, d) {
        return Math.max(Math.abs(a - c), Math.abs(b - d))
      }
      let check = function(x, y) {
        let k1 = dist(x, y, abyss1[0], abyss1[1])
        let k2 = dist(x, y, abyss2[0], abyss2[1])
        let min = 1000
        for(let i=corners.length-1;i>=0;i--) {
          let d = dist(x, y, corners[i][0], corners[i][1])
          if(d < min) { min = d }
        }
        if(k2 < k1) { k1 = k2 }
        if(k1 < 3 || min < 2) { return false }
        if(k1 === 3) { return 0.03 }
          if(k1 === 4) { return 1 + 0.4 * Math.random() }
          if(k1 === 6 || k1 === 5) { return 1 + 0.8 * Math.random() }
        if(min === 2) { return 0.7 }
        return true
      }
      let map = {}
      let ad = function(x, y) {
        let m = map[x][y]
        if(m) {
          m.wall = m.g = true
        }
      }
      let place = function() {
        let exists = function(x, y) {
          let m = map[x]
          if(!m) { return false }
          m = m[y]
          if(m && m.wall) { return true }
          return false
        }
        let score = function(x, y) {
          let s = 0
          for(let i=0;i<4;i++) {
            let dx = [1, 0, -1, 0][i]
            let dy = [0, 1, 0, -1][i]
            if(exists(x + dx, y + dy)) {
              s += 20
              if(exists(x + dx * 2, y + dy * 2)) {
                s += 40
                if(exists(x + dx * 3, y + dy * 3)) {
                  s += 60
                  if(exists(x + dx * 4, y + dy * 4)) {
                    s += 100 * (2 * Math.random() - 1)
                    if(exists(x + dx * 5, y + dy * 5)) {
                      s += 120 * (2 * Math.random() - 1)
                    }
                  }
                }
              }
            }
          }
          return s
        }
        let k = [], swap = Math.random() < 0.5, sx = Math.random() < 0.5 ? 1 : -1, sy = Math.random() < 0.5 ? 1 : -1
        for(let cx=-s;cx<=s;cx++) {
          for(let cy=-s;cy<=s;cy++) {
                let x = sx * (swap ? cy : cx), y = sy * (swap ? cx : cy)
                if(!map[x]) { map[x] = {} }
            let m = map[x][y]
            if(!m) { m = map[x][y] = {} }
            let w = Math.abs(x)
            let z = Math.abs(y)
            let r = Math.max(w, z)
            let ch = check(x, y)
            if(!ch) { continue }
            if(r <= s && r > 2) {
              let c = [0.01, 0.01, 0.015, 0.02, 0.025, 0.03, 0.04, 0.045][r - 2] || 0.05
              let cc = [-10, 0.04, 0.0425, 0.045, 0.06, 0.08, 0.08, 0.06][s - r]
              if(cc) { c = cc }
              if(cc < 0) { continue }
              let around = exists(x + 1, y) + exists(x - 1, y) + exists(x, y + 1) + exists(x, y - 1)
              let corners = exists(x + 1, y + 1) + exists(x - 1, y - 1) + exists(x + 1, y - 1) + exists(x - 1, y + 1)
              let total = around + corners
              if(total > 0 && total < 4) { c += [0.08, 0.06, 0.1][total - 1] }
              else if(total > 3) { c *= 0.2 }
              if(corners - around > 0) { c *= 0.1 }
              if(corners - around > 1) { c *= 0.6 }
              if(corners - around > 2) { c *= 0.6 }
              if(corners - around > 3) { c *= 0.6 }
              let cs = score(x, y)
              if(Math.random() * 4.1 < c * ch * (1 + cs * 0.1)) {
                k.push([x, y])
              }
            }
          }
        }
        for(let i=k.length-1;i>=0;i--) {
          let j = k[i]
          ad(j[0], j[1])
        }
      }
      for(let i=0;i<18;i++) {
        place()
      }
      const createAbyss = function(x, y) {
        addgates(300 * x, 300 * y)
        ad(x + 1, y + 1)
        ad(x - 1, y - 1)
        ad(x + 1, y - 1)
        ad(x - 1, y + 1)
      }
      let after = function() {
        createAbyss(abyss1[0], abyss1[1])
        createAbyss(abyss2[0], abyss2[1])
      }
      let check2x2 = function() {
      for(let y=-s;y<s;y++) {
        for(let x=-s;x<s;x++) {
          if(map[x][y].wall && map[x+1][y].wall && map[x][y+1].wall && map[x+1][y+1].wall) {
            map[x + Math.floor(2 * Math.random())][y + Math.floor(2 * Math.random())].wall = false
          }
      if(map[x][y].wall && !map[x+1][y].wall && !map[x][y+1].wall && map[x+1][y+1].wall) {
          let i = Math.floor(2 * Math.random())
          map[x+i][y+i].wall = false
      }
      if(!map[x][y].wall && map[x+1][y].wall && map[x][y+1].wall && !map[x+1][y+1].wall) {
          let i = Math.floor(2 * Math.random())
          map[x+i][y+1-i].wall = false
      }
        }
      }
        }
        let checkCell = function() {
      for(let x=1-s;x<s;x++) {
          for(let y=1-s;y<s;y++) {
              let sum = (map[x+1][y].wall ? 1 : 0) + (map[x-1][y].wall ? 1 : 0)
              for(let i=0-1;i<=1;i++) {
                  sum += (map[x+i][y+1].wall ? 1 : 0) + (map[x+i][y-1].wall ? 1 : 0)
              }
              if(sum >= 6 && (sum >= 7 || Math.random() < 0.48)) {
                  for(let i=0;i<2;i++) {
                      let u = Math.floor(Math.random() * 8)
                      map[x+[1,1,0,-1,-1,-1,0,1][u]][y+[0,1,1,1,0,-1,-1,-1][u]].wall = false
                  }
              } else if(sum <= 0 && map[x][y].wall) {
                  map[x][y].wall = false
              }
          }
      }
        }
        check2x2()
      let front = []
      let step = function() {
        let newfront = []
        let add = function(x, y) {
          let m = map[x]
          if(!m) { return }
          m = m[y]
          if(m && !(m.c === ccc) && !m.wall) {
            m.c = ccc
            newfront.push([x,y])
          }
        }
        for(let i=front.length-1;i>=0;i--) {
          let u = front[i]
          add(u[0] + 1, u[1])
          add(u[0] - 1, u[1])
          add(u[0], u[1] + 1)
          add(u[0], u[1] - 1)
        }
        front = newfront
      }
      let ccc = 0
      let tick = function() {
        ccc ++
        front = [ [0, 0] ]
        map[0][0].c = ccc
        for(let i=0;i<250;i++) {
          step()
          if(!front[0]) {
            break
          }
        }
        let changed = false
        for(let x=-s;x<=s;x++) {
          for(let y=-s;y<=s;y++) {
            let m = map[x][y]
            if(!m.wall && !(m.c === ccc)) {
              changed = true
              if(Math.random() < 0.2 + ccc * 0.02) {
                let d = Math.floor(Math.random() * 4)
                let t = map[x + [1, 0, -1, 0][d]]
                if(t) {
                  t = t[y + [0, 1, 0, -1][d]]
                  if(t) { t.wall = false }
                }
              }
            }
          }
        }
        return changed
      }
      for(let i=0;i<100;i++) {
        let changed = tick()
        if(!changed) {
          break
        }
      }
        checkCell()
        check2x2()
        check2x2()
      after()
      let index = 0
      let walls = []
      for(let x=-s;x<=s;x++) {
        for(let y=-s;y<=s;y++) {
          let m = map[x][y]
          if(m.wall && !m.a) {
            let a = 1
            for(a=1;a+x<=sm;a++) {
              let n = map[a + x][y]
              if(n.wall && !n.a) {

              } else {
                break
              }
            }
            if(a > 1) {
              walls.push([(x + (a - 1) / 2) * 150, y * 150, a * 150, 150])
              for(let b=0;b<a;b++) {
                map[x + b][y].o = index
                map[x + b][y].d = b === 0 ? '[#' : (b === a - 1 ? '#]' : '##')
                map[x + b][y].a = true
              }
              index ++
            }
          }
        }
      }
      for(let y=-s;y<=s;y++) {
        for(let x=-s;x<=s;x++) {
          let m = map[x][y]
          if(m.wall && !m.a) {
            let a = 1
            for(a=1;a+y<=sm;a++) {
              let n = map[x][a + y]
              if(n.wall && !n.a) {

              } else {
                break
              }
            }
            if(a > 0) {
              walls.push([x * 150, (y + (a - 1) / 2) * 150, 150, a * 150])
              for(let b=0;b<a;b++) {
                map[x][y + b].o = index
                map[x][y + b].d = b === 0 ? (a === 1 ? '[]' : '++') : (b === a - 1 ? '++' : '||')
                map[x][y + b].a = true
              }
            }
          }
        }
      }
      let str = '\n', block = String.fromCharCode(9608, 9608)
      for(let y=-s;y<=s;y++) {
        let sa = ''
        for(let x=-s;x<=s;x++) {
          let m = map[x][y]
          sa += m.wall ? block : (m.c ? '  ' : '  ')
        }
        str += sa + '\n'
      }

      for(let i=walls.length-1;i>=0;i--) {
        let w = walls[i]
        w[0] *= 2
        w[1] *= 2
      }
      walls.push(
        [8650, 4925, 1000, 4725],[8650, -4925, 1000, 4725],
        [-8650, 4925, 1000, 4725],[-8650, -4925, 1000, 4725],
        [3925, 8650, 3725, 1000], [3925, -8650, 3725, 1000],
        [-3925, 8650, 3725, 1000], [-3925, -8650, 3725, 1000]
      )
      return [walls, gates, abyss1, abyss2]
    })()

    const dim = dimension.create({
      mapSize: 9650,
      displayName: 'Crossroads',
      displayRadiant: 127,
      name: 'crossroads',
      exitMessage: 'Returning From The Crossroads...',
      type: 'crossroads',
      ambientParticles: [
        {
          amount: 10,
          radiant: 0,
          size: [75, 200],
          color: { r: 54, g: 54, b: 54 },
          d: 50,
          range: 30,
          speed: 650,
          fade: 20,
          t: 80,
          opacity: 50
        }
      ],
      walls: generated[0],
      gates: generated[1],
      darkness: 0.96,
      background: {
        r: 54,
        g: 54,
        b: 54
      },
      grid: {
        r: 39,
        g: 39,
        b: 39
      },
      gridSize: 100,
      maxPolygonSides: 11,
      maxPolygonCount: 350,
      spawnPlayer: function(team, tank, prevDim) {
        if(prevDim === 'sanctuary') {
          if(Math.random() * 3 < 1) {
            let a = generated[Math.random() < 0.5 ? 2 : 3]
            return [a[0] * 300, a[1] * 300]
          }
          let p = [0, 0]
          p[Math.floor(Math.random() * 2)] = Math.random() < 0.5 ? 9450 : -9450
          return p
        } else {
          let max = 0.5
          for(let i=dim.tanks.length-1;i>=0;i--) {
            let t = dim.tanks[i]
            let d = 1500 / (t.x * t.x + t.y * t.y + 1500)
            if(d > max) { d = max }
            t.xv += t.x * 5 * d * dimension.per50
            t.yv += t.y * 5 * d * dimension.per50
          } for(let i=dim.polygons.length-1;i>=0;i--) {
            let t = dim.polygons[i]
            let d = 1500 / (t.x * t.x + t.y * t.y + 1500)
            if(d > max) { d = max }
            t.xv += t.x * 5 * d * dimension.per50
            t.yv += t.y * 5 * d * dimension.per50
          } for(let i=dim.bullets.length-1;i>=0;i--) {
            let t = dim.bullets[i]
            let d = 1500 / (t.x * t.x + t.y * t.y + 1500)
            if(d > max) { d = max }
            t.xv += t.x * 5 * d * dimension.per50
            t.yv += t.y * 5 * d * dimension.per50
          }
          return [0, 0]
        }
      },
      spawnPolygon: function() {
        return [(2 * Math.random() - 1) * 7650, (2 * Math.random() - 1) * 7650]
      }
    })
    let tdim = 'sanctuary'
    generator.wormhole({
      static: true,
      x: 9450,
      y: 0,
      size: 90,
      type: 2,
      dim: dim,
      action: function(tank) {
        if(tank.timeExisted < 1) {
          tank.xv = -20 * dimension.per50
          tank.x --
        } else {
          dimension.sendTankTo({
            tank: tank,
            dim: tdim,
          })
        }
      },
    })
    generator.wormhole({
      static: true,
      x: -9450,
      y: 0,
      size: 90,
      type: 2,
      dim: dim,
      action: function(tank) {
        if(tank.timeExisted < 1) {
          tank.xv = 20 * dimension.per50
          tank.x ++
        } else {
          dimension.sendTankTo({
            tank: tank,
            dim: tdim,
          })
        }
      },
    })
    generator.wormhole({
      static: true,
      x: 0,
      y: 9450,
      size: 90,
      type: 2,
      dim: dim,
      action: function(tank) {
        if(tank.timeExisted < 1) {
          tank.yv = -20 * dimension.per50
          tank.y --
        } else {
          dimension.sendTankTo({
            tank: tank,
            dim: tdim,
          })
        }
      },
    })
    generator.wormhole({
      static: true,
      x: 0,
      y: -9450,
      size: 90,
      type: 2,
      dim: dim,
      action: function(tank) {
        if(tank.timeExisted < 1) {
          tank.yv = 20 * dimension.per50
          tank.y ++
        } else {
          dimension.sendTankTo({
            tank: tank,
            dim: tdim,
          })
        }
      },
    })
    for(let i=wormholePositions.length-1;i>=0;i--) {
      let p = wormholePositions[i]
      let a = function() {
        let color = 1 + Math.floor(Math.random() * 3)
        let cdim = ['ffa', '2teams', '4teams'][color - 1]
        if(Math.random() < 0.02) {
          generator.wormhole({
            x: p[0] * 300,
            y: p[1] * 300,
            size: 100,
            type: 0,
            radiant: 1,
            time: 20,
            dim: dim,
            ruptured: true,
            action: function(tank) {
              dimension.sendTankTo({
                tank: tank,
                dim: 'abyssHallway'
              })
            }
          })
        } else {
          generator.wormhole({
            x: p[0] * 300,
            y: p[1] * 300,
            size: 100,
            type: 0,
            time: 30,
            dim: dim,
            ruptured: true,
            color: color,
            action: function(tank) {
              dimension.sendTankTo({
                tank: tank,
                dim: cdim,
              })
            }
          })
        }
        setTimeout(a, 30000 + 10000 * Math.random())
      }
      setTimeout(a, 10000 * Math.random())
    }
    generator.wormhole({
      static: true,
      x: generated[2][0] * 300,
      y: generated[2][1] * 300,
      size: 75,
      type: 2,
      dim: dim,
      action: function(tank) {
        if(tank.timeExisted < 1) {
          tank.xv = -100 * dimension.per50
          tank.yv = 0
        } else {
          dimension.sendTankTo({
            tank: tank,
            dim: 'abyssHallway',
          })
        }
      },
    })
    generator.wormhole({
      static: true,
      x: generated[3][0] * 300,
      y: generated[3][1] * 300,
      size: 75,
      type: 2,
      dim: dim,
      action: function(tank) {
        if(tank.timeExisted < 1) {
          tank.xv = -100 * dimension.per50
          tank.yv = 0
        } else {
          dimension.sendTankTo({
            tank: tank,
            dim: 'abyssHallway',
          })
        }
      },
    })
    let count = 0
    const spawnTriangles = function() {
      count ++
      let e = (Math.random() < 0.5 ? 1 : 0)
      let l = generated[2 + e], h = (10 + 20 * Math.random())
      createAbyssling(e)
      setTimeout(spawnTriangles, h * 60 * 1000)
    }
    setTimeout(spawnTriangles, 5000)

    const createAbyssling = function(i) {
      let _tx = generated[3 - i][0] * 300, _ty = generated[3 - i][1] * 300
      let tx = 1000 * (Math.random() - 0.5), ty = 1000 * (Math.random() - 0.5)
      let ts = -1
      let abyssling = generator.tank({
        dim: dim,
        x: generated[i + 2][0] * 300,
        y: generated[i + 2][1] * 300,
        weapon: 'abyssling',
        body: 'abyssling',
        forceDeathScore: 20e6,
        score: 1e9,
        radiant: 1,
        team: 8,
        invincible: false,
        ai: function(options) {
          if(abyssling.timeExisted > 0.5 && ts === -1) {
            ts = 0
            controller.lastUpdate = 0
            controller.update(options.now, tx, ty, [abyssling.x, abyssling.y])
          } else if(abyssling.timeExisted > 30 && ts === 0) {
            ts = 1
            tx = -_tx
            ty = -_ty
          } else if(abyssling.timeExisted > 60 && ts === 1) {
            ts = 2
            tx = _tx
            ty = _ty
          }
          let target = [0, 0]
          let attacking = false
          let c = abyssling.detector.closestTank
          if(c) {
            if(controller.directPath(abyssling.x, abyssling.y, c.x, c.y)) {
              target[0] = c.x
              target[1] = c.y
              attacking = true
            }
          }
          if(!attacking) {
            try {
              controller.update(options.now, tx, ty, [abyssling.x, abyssling.y])
              let i = controller.getImpulse(abyssling.x, abyssling.y)
              if(controller.directPath(abyssling.x, abyssling.y, tx, ty)) {
                target[0] = tx
                target[1] = ty
                controller.lastTarget = target
              } else if(i >= 0) {
                let dx = [50, 0, -50, 0][i], dy = [0, 50, 0, -50][i]
                target[0] = dx ? abyssling.x + dx : abyssling.x
                target[1] = dy ? abyssling.y + dy : abyssling.y
                controller.lastTarget = target
              } else {
                target = controller.lastTarget
              }
            } catch(e) { console.log(e) }
          }
          abyssling.firing = true
          let d = [target[0] - abyssling.x, target[1] - abyssling.y]
          abyssling.d = dimension.averageAngles(abyssling.d, Math.atan2(-d[0], d[1]), dimension.smooth(2))
          abyssling.input.movement[0] = -Math.sin(abyssling.d)
          abyssling.input.movement[1] = Math.cos(abyssling.d)
        }
      })
      let controller = pathfind.controller({
        tank: abyssling,
        range: 25,
        maxSteps: 200,
        updateInterval: 10000,
        dx: 0,
        dy: 0,
        extraWalls: [
          [generated[2][0] * 300, generated[2][1] * 300, 150, 150],
          [generated[3][0] * 300, generated[3][1] * 300, 150, 150],
        ]
      })
      controller.lastTarget = [abyssling.x, abyssling.y]
    }
  }()
  !function() {
    let walls = []
    let arr = [
      [1, 2, 1, 1],
      [5, 2, 1, 1],
      [6, 1.5, 1, 2],
      [3, 4, 3, 1],
      [4, 5.5, 1, 2],
      [7, 4, 3, 1],
      [8, 3, 1, 1],
      [9.5, 2, 4, 1],
      [10, 4, 1, 1],
      [2, 6.5, 1, 2],
      [2, 11, 1, 1],
      [4, 13.5, 1, 4],
      [13, 4, 3, 1],
      [12, 5, 1, 1],
      [14, 7, 1, 3],
      [12, 9, 1, 1],
      [13.5, 10, 4, 1],
      [10.5, 12, 2, 1],
      [10, 14, 3, 1],
      [12, 15, 1, 1]
    ]
    for(let i=0,l=arr.length;i<l;i++) {
      let w = arr[i]
      walls.push([300 * (w[0] - 8), 300 * (w[1] - 8), 150 * w[2], 150 * w[3]])
    }
    const dim = dimension.create({
      mapSize: 2125 * 150 / 125,
      displayName: 'Crossroads Lobby',
      displayRadiant: 127,
      name: 'crossroadsLobby',
      entryMessage: 'Launching To The Crossroads...',
      type: 'crossroads',
      ambientParticles: [
        {
          amount: 10,
          radiant: 0,
          size: [75, 200],
          color: { r: 54, g: 54, b: 54 },
          d: 50,
          range: 30,
          speed: 650,
          fade: 20,
          t: 80,
          opacity: 50
        }
      ],
      walls: walls,
      gates: [],
      darkness: 0.96,
      background: {
        r: 54,
        g: 54,
        b: 54
      },
      grid: {
        r: 39,
        g: 39,
        b: 39
      },
      gridSize: 100,
      maxPolygonSides: 3,
      maxPolygonCount: 0,
      spawnPlayer: function(team, tank) {
        return [1000 * (2 * Math.random() - 1), 1000 * (2 * Math.random() - 1)]
      }
    })
    generator.wormhole({
      static: true,
      x: 0,
      y: 0,
      size: 150,
      type: 2,
      dim: dim,
      action: function(tank) {
          if(!(tank.invincible && tank.invincibleTime > 0)) {
        dimension.sendTankTo({
          tank: tank,
          dim: 'crossroads',
        })
          }
      },
    })
  }()
  