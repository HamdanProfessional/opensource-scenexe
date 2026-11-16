  const pathfind = {
    controller: function(options) {
      let c = {
        tank: options.tank,
        osize: options.range,
        updateInterval: options.updateInterval || 1000,
        lastUpdate: 0,
        map: false,
        dx: options.dx || 0,
        dy: options.dy || 0,
        r: options.r || 300,
        update: function(now, x, y, target) {
          if(!c.map || now > c.lastUpdate + c.updateInterval) {
            c.lastUpdate = now
          } else {
            return false
          }
          let w = c.tank.dim.walls

          if(options.extraWalls) {
            w = w.concat(options.extraWalls)
          }

          let m = pathfind.extract(w, 0, 0, -c.dx, -c.dy, c.osize, c.r)
          if(target) {
            target = [Math.floor(target[0] / c.r + 0.5 + c.dx), Math.floor(target[1] / c.r + 0.5 + c.dy)]
          }

          m = pathfind.preMap({
            map: m,
            maxSteps: options.maxSteps,
            x: Math.floor(x / c.r + 0.5 + c.dx),
            y: Math.floor(y / c.r + 0.5 + c.dy),
            target: target
          })
          c.map = m
          return true
        },
        getImpulse: function(x, y) {
          if(!c.map) { c.update() }

          x = Math.floor(x / c.r + 0.5 + c.dx)
          y = Math.floor(y / c.r + 0.5 + c.dy)
          return pathfind.getImpulse(c.map, x, y)
        },
        directPath: function(fx, fy, tx, ty) {
          return pathfind.directPath(c.tank.dim.walls, fx, fy, tx, ty)
        }
      }
      return c
    },
    directPath: function(walls, fx, fy, tx, ty) {
      let lx, ly, hx, hy
      if(fx < tx) {
        lx = fx
        hx = tx
      } else {
        lx = tx
        hx = fx
      }
      if(fy < ty) {
        ly = fy
        hy = ty
      } else {
        ly = ty
        hy = fy
      }

      for(let i=0,l=walls.length;i<l;i++) {
        let w = walls[i]
        if(w && w[0] + w[2] > lx && w[0] - w[2] < hx && w[1] + w[3] > ly && w[1] - w[3] < hy) {
          return false
        }
      }
      return true
    },
    createMap: function(o, s) {
      const map = []
      map.osize = o
      for(let i=0;i<s;i++) {
        const o = []
        for(let u=0;u<s;u++) {
          o.push(0)
        }
        map.push(o)
      }
      return map
    },
    flag: function(i, f, b) {
      let e = (1 << f)
      if(b) {
        return i | e
      } if(b == false) {
        return (i | e) ^ e
      }
      return i ^ e
    },
    readFlag: function(i, f) {
      return i & (1 << f)
    },
    flagCell: function(m, o, x, y, f, b) {
      x += o
      y += o
      m[x][y] = pathfind.flag(m[x][y], f, b)
    },
    step: function(map, front, o, target) {
      let newFront = []
      for(let i=0,l=front.length;i<l;i++) {
        let x = front[i][0], y = front[i][1]
        if(
          pathfind.add(map, o, x + 1, y, newFront, 2, target) ||
          pathfind.add(map, o, x, y + 1, newFront, 3, target) ||
          pathfind.add(map, o, x - 1, y, newFront, 4, target) ||
          pathfind.add(map, o, x, y - 1, newFront, 5, target)
        ) {
          return []
        }
      }

      for(let i=0,l=newFront.length;i<l;i++) {
        let x = newFront[i][0], y = newFront[i][1]
        pathfind.flagCell(map, o, x, y, 1, 1)
      }
      return newFront
    },
    add: function(m, o, x, y, newFront, f, target) {
      if(x >= -o && y >= -o && x <= o && y <= o && !pathfind.readFlag(m[x + o][y + o], 1)) {
        if(f >= 0) { pathfind.flagCell(m, o, x, y, f, 1) }
        pathfind.flagCell(m, o, x, y, 1, 1)
        if(!pathfind.readFlag(m[x + o][y + o], 0)) {
          newFront.push([x, y])
        }
        if(target && x === target[0] && y === target[1]) { return true }
      }
    },
    preMap: function(o) {
      const map = o.map, osize = map.osize
      let front = []

      pathfind.add(map, osize, o.x, o.y, front)
      front = [[o.x, o.y]]

      for(let i=0,l=(o.maxSteps < 1000 ? o.maxSteps : 1000);i<l;i++) {
        front = pathfind.step(map, front, osize, o.target)

        if(!front[0]) { break }
      }
      return map
    },
    getImpulse: function(map, x, y) {
      x += map.osize
      y += map.osize
      if(map[x] && map[x][y] >= 0) {
        let s = map[x][y]
        if(pathfind.readFlag(s, 2)) { return 2 }
        if(pathfind.readFlag(s, 3)) { return 3 }
        if(pathfind.readFlag(s, 4)) { return 0 }
        if(pathfind.readFlag(s, 5)) { return 1 }
      }
      return -1
    },
    extract: function(walls, x, y, dx, dy, s, r) {
      let d = (s + 0.5) * r
      let rx = x * r, ry = y * r
      const rsize = s * 2 + 1
      const left = rx - d
      const right = rx + d
      const bottom = ry - d
      const top = ry + d
      const map = pathfind.createMap(s, rsize)
      for(let i=0,l=walls.length;i<l;i++) {
        let w = walls[i]
        if(!w) { continue }
        let w0 = w[0] - dx
        let w1 = w[1] - dy
        let w2 = w[2]
        let w3 = w[3]
        if(w0 + w2 > left && w0 - w2 < right && w1 + w3 > bottom && w1 - w3 < top) {
          let lx, hx, ly, hy
          if(w2 * 2 < r) {
            lx = hx = Math.floor(w0 / r + 0.5) - x
          } else {
            lx = Math.floor((w0 - w2) / r + 1) - x
            hx = Math.floor((w0 + w2) / r + 0) - x
          } if(w3 * 2 < r) {
            ly = hy = Math.floor(w1 / r + 0.5) - y
          } else {
            ly = Math.floor((w1 - w3) / r + 1) - y
            hy = Math.floor((w1 + w3) / r + 0) - y
          }
          lx += s
          ly += s
          hx += s
          hy += s
          if(lx < 0) { lx = 0 }
          if(ly < 0) { ly = 0 }
          if(hx > 2 * s) { hx = 2 * s }
          if(hy > w * s) { hy = s * 2 }
          for(let x=lx;x<=hx;x++) {
            for(let y=ly;y<=hy;y++) {
              pathfind.flagCell(map, 0, x, y, 0, 1)
            }
          }
        }
      }
      return map
    }
  }

