  const load = function(p) {
    try {
      let src = fs.readFileSync(p).toString()
      if(/(^|[\/])dims[\/]/.test(p)) {
        src = fs.readFileSync(p.replace(/[^\/]+$/, 'common.js')).toString() + '\n;\n' + src
      }
      eval(src)
    } catch(e) { console.log(`Failed to load dim from ${p}: ${e}`) }
  }
  const special = function(p, dim) {
    if(!dim) { return }
    try {
      eval(fs.readFileSync(p).toString())
    } catch(e) { console.log(`Failed to load special from ${p}: ${e}`) }
  }

  eval(args.start)
  const addBot = function(d) {
    let tank = d[1]
    let team = 0, x = 0, y = 0
	  let dim = dimension.dims[d[0]]
    if(tank[0].team >= 5 && !(dimension.noPinkTeam && tank[0].team === 6)) {
      team = tank[0].team
    } else {
      if(dim.type === '2teams') {
        let teamCodeA = dim.teamCodeA, teamCodeB = dim.teamCodeB
        if(tank[0].team === teamCodeA || tank[0].team === teamCodeB) {
          team = tank[0].team
        } else {
          team = Math.random() < 0.5 ? teamCodeA : teamCodeB
        }
      } else if(dim.type === 'ffa') {
        team = 0
      } else {
        if(tank[0].team > 0 && tank[0].team < 5) {
          team = tank[0].team
        } else {
          team = 1 + Math.floor(4 * Math.random())
        }
      }
    }
    tank[0].team = team
    tank[0].dim = dim
    tank[0].score = Math.max(tank[0].score || 0, SPAWN_SCORE)
    let t = generator.tank(tank[0]);
    [x, y] = dim.spawnPlayer(team, t, tank[1])
    t.x = x
    t.y = y
    t.ws.accountNameParsed = tank[2]
    return t
  }

  const spawnPolygon = function(dim) {
    let p
    if(dim.spawnPolygon) {
      p = dim.spawnPolygon()
    } else {
      p = [(Math.random() < 0.5 ? 1 : -1) * dim.mapSize * Math.random(), (Math.random() < 0.5 ? 1 : -1) * dim.mapSize * Math.random()]
    }
    let count = 5 + 5 * Math.random()
    for(let i=0;i<count;i++) {
      spawnPolygon2(dim, p)
    }
  }
  const spawnPolygon2 = function(dim, p) {
    let polygons = {}
    for(let i=dim.polygons.length-1;i>=0;i--) {
      let polygon = dim.polygons[i]
      if(polygon.sides in polygons) {
        polygons[polygon.sides] ++
      } else {
        polygons[polygon.sides] = 1
      }
    }
    let radiant = 0
    let voidd = (dim === dimension.dims.voidd || dim === dimension.dims.voiddMaze)
    let abyss = (dim === dimension.dims.abyss || dim === dimension.dims.abyssHallway)
    let crossroads = (dim === dimension.dims.crossroads)
    if(voidd && Math.random() < 0.9999 ) {
      radiant++
      if(Math.random() < 0.75) {
        radiant++
        if(Math.random() < 0.6) {
          radiant++
          if(Math.random() < 0.45) {
            radiant++
            if(Math.random() < 0.3) {
              radiant++
            }
          }
        }
      }
    }
    if(abyss && Math.random() > 0.2 || dim.name === 'assault') {
      radiant ++
    }
    if(dim.gleaming && Math.random() > 0.1) {
      radiant ++
      if(Math.random() > 0.4) {
        radiant ++
      }
    }
    if(crossroads && Math.random() * 7 < 1) {
      radiant ++
    }
    if(Math.random() * 4096 < 1) {
      radiant ++
    }
    if(radiant > 0) {
      while(Math.random() * 9 < 1) { radiant ++ }
    }
    let chances = {}
    let total = 0
    let k = 1
    for(let i=3;i<=dim.maxPolygonSides;i++) {
      let c = (polygons[i] || 0)
      let l = k * 1 / (1 + c)
      if(i > 13 && voidd) {
        chances[i] = l * 500
        total += l * 500
      }
      if(i > 7 && (voidd || abyss || crossroads)) {
        chances[i] = l * 50
        total += l * 50
      } else {
        chances[i] = l
        total += l
      }
      if(dim.clans) {
        k *= 0.4
      } else if(crossroads) {
        k *= 0.24
      } else {
        k *= (abyss ? 0.3 : 0.24)
      }
    }
    let int = Math.random() * total
    let current = 0
    let sides = 3
    for(let i in chances) {
      current += chances[i]
      if(int < current) {
        sides = parseInt(i)
        break
      }
    }
    let m = sides >= 3 ? 1 + (sides - 3) * 0.1 : 1 - (sides + 1) * 0.1
    if(dim.nextSpawnPolyhedra) {
      dim.nextSpawnPolyhedra = false
      sides = -1
      radiant = 0
      while(sides > -5 && Math.random() * 5 < 1) {
        sides --
      }
      if(voidd && Math.random() < 0.9999 ) {
        radiant++
        if(Math.random() < 0.75) {
          radiant++
          if(Math.random() < 0.6) {
            radiant++
            if(Math.random() < 0.45) {
              radiant++
              if(Math.random() < 0.3) {
                radiant++
              }
            }
          }
        }
      }
      if(abyss && Math.random() > 0.2 || dim.name === 'assault') {
        radiant ++
      }
      if(dim.gleaming && Math.random() > 0.1) {
        radiant ++
        if(Math.random() > 0.4) {
          radiant ++
        }
      }
      if(crossroads && Math.random() * 7 < 1) {
        radiant ++
      }
      if(Math.random() * 4096 < 1) {
        radiant ++
      }
      if(radiant > 0) {
        while(Math.random() * 9 < 1) { radiant ++ }
      }
    }
    if(dim.name === 'dv1') {
      let q = Math.random()
      radiant += Math.floor(1 + 7 * q * q * q)
    }
    generator.polygon({
      x: p[0],
      y: p[1],
      d: 2 * Math.PI * Math.random(),
      sides: sides,
      dim: dim,
      radiant: radiant
    }, [sides, radiant])
  }

  setInterval(function() {
    let c = {}
    for(let n in dimension.dims) {
      let d = dimension.dims[n]
      c[n] = [d.playerCount(), d.getTickrate(), d.getTickTime(), d.getUpdateTime(), d.getObjectLength(), d.tanks.length, d.bullets.length, d.polygons.length]
    }

    args.parentPort.postMessage(['dimStats', c])
  }, 3000)

  return { game, dimension, packer, generator, Detector, View, httpServer, server, commands, addBot }
}

