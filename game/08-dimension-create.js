    create: function(options) {
      if(!(options.name in dimension.dims)) {
        let d = options.darkness > 0 ? Math.round(100 * options.darkness) : 0
        let maxPolygonCount = options.maxPolygonCount || 0
        if(args.lessPolygons) {
          maxPolygonCount *= 0.1
        }
        let weapons = tankData.weapons, bodies = tankData.bodies
        if(options.customWeapons) {
          weapons = { ...weapons, ...options.customWeapons }
        }
        if(options.customBodies) {
          bodies = { ...bodies, ...options.customBodies }
        }
        const dim = {
          getTickrate: function() {
            return 0
          },
          lastTickDelta: 0,
          lastTick: 0,
          updateTime: 0,
          objectLength: 0,
          getTickTime: function() {
            return dim.lastTickDelta
          },
          getUpdateTime: function() {
            return dim.updateTime
          },
          getObjectLength: function() {
            return dim.objectLength
          },
          playerCount: function() {
            let count = 0
            for(let i=dim.tanks.length-1;i>=0;i--) {
              let tank = dim.tanks[i]
              if(tank.ws && tank.ws.data && tank.ws.data.isPlayer) {
                count ++
              }
            }
            return count
          },
          wallEdit: true || (options.wallEdit ? true : false),
          matrixWalls: {},
          matrixWallChanges: {},
          flat: function(x) {
            if(x > dim.mapSize) { x = dim.mapSize }
            if(x < -dim.mapSize) { x = -dim.mapSize }
            return x > 0 ? -Math.floor(1 - x / 50) : Math.floor(x / 50)
          },
          addWall: function(x, y) {
            let m = dim.matrixWalls[x]
            if(!m) { m = dim.matrixWalls[x] = {} }
            if(!m[y]) {
              m[y] = true
              m = dim.matrixWallChanges[x]
              if(!m) { m = dim.matrixWallChanges[x] = {} }
              m[y] = true
            }
          },
          removeWall: function(x, y) {
            let m = dim.matrixWalls[x]
            if(m && m[y]) {
              delete m[y]
              if(Object.keys(m).length <= 0) {
                delete dim.matrixWalls[x]
              }
              m = dim.matrixWallChanges[x]
              if(!m) { m = dim.matrixWallChanges[x] = {} }
              m[y] = false
            }
          },
		      dt: 0,
          tickTime: 0,
          weapons: weapons,
          bodies: bodies,
          customWeapons: options.customWeapons || {},
          customBodies: options.customBodies || {},
		      isMain: options.isMain || false,
          sizeScale: options.sizeScale >= 0 ? options.sizeScale : 1.01,
          entryMessage: options.entryMessage || false,
          exitMessage: options.exitMessage || false,
          ambientParticles: options.ambientParticles || [],
          sandbox: options.sandbox ? true : false,
          noPolygons: options.noPolygons ? true : false,
          forceRespawnScore: options.forceRespawnScore,
          removeFallens: options.removeFallens ? true : false,
          allowScale: options.allowScale ? true : false,
          onDeath: options.onDeath || function() {},
          onChat: options.onChat || function() {},
          onUpdate: options.onUpdate || function() {},
          freeJoin: options.freeJoin ? true : false,
          fillWalls: options.fillWalls ? true : false,
          noMinimap: options.noMinimap ? true : false,
          wrap: options.wrap ? true : false,
          displayName: options.displayName || '',
          displayColor: options.displayColor || 0,
          displayRadiant: options.displayRadiant || 0,
          friction: options.friction === false ? false : true,
          nextSpawnPolyhedra: false,
          lastPolyhedra: 0,
          mapSize: options.mapSize || 100,
          _mapSize: 0,
          mapSizeSpeed: 0,
          lastMapSize: options.mapSize || 100,
          gridSize: options.gridSize || 30,
          background: options.background,
          grid: options.grid,
          maxPolygonSides: options.maxPolygonSides || 0,
          _maxPolygonSides: options.maxPolygonSides || 0,
          maxPolygonCount: maxPolygonCount,
          _maxPolygonCount: maxPolygonCount,
          name: options.name,
          tanks: [],
          type: options.type || 'ffa',
          ids: {
            tank: [],
            bullet: [],
            polygon: [],
            wormhole: [],
          },
          spawnPlayer: options.spawnPlayer || function() { return [0, 0] },
          spawnPolygon: options.spawnPolygon || false,
          newTanks: [],
          darkness: d,
          darknessUpdated: false,
          setDarkness: function(v) {
            let d = v > 0 ? Math.round(100 * v) : 0
		        if(d > 100) { d = 100 }
            if(d !== dim.darkness) {
              dim.darkness = d
              dim.darknessUpdated = true
            }
          },
          resizedWormholes: {},
          rupturedWormholes: {},
          fadeTimeChanges: {},
          removedWormholes: {},
          addedWormholes: {},
          updatedTanks: {},
          updatedGates: {},
          updatedPortals: {},
          updatedWalls: {},
          removedWalls: {},
          bullets: [],
          polygons: [],
          bases: [],
          walls: options.walls || [],
          defaultWalls: 0,
          gates: options.gates || [],
          wormholes: {},
          chatMessages: {},
          leaderboard: [],
          leaderboardChanges: {},
          remove: function() {
            if(dimension.dims[dim.name] === dim) {
              for(let i=0,l=dim.tanks.length;i<l;i++) {
                let tank = dim.tanks[i]
                tank.ws.data.respawnScore = 0
                if(tank.ws.data.isPlayer && (tank.ws.data.uid >= 0 || args.standalone)) {
                  if(args.standalone) {
                    tank.ws.sendPacket('death', [[], 0])
                  } else {
                    tank.ws.data.ready = false
                    args.parentPort.postMessage(['death', [tank.ws.data.uid, 0, [[], 0], tank.ws.data.lastTeam]])
                  }
                }
              }
              clearInterval(dim.intervalId)
              delete dimension.dims[dim.name]
            }
          },
          add: function(key, object) {
            let array = dim[key]
            if(array.indexOf(object) < 0) {
              array.push(object)
            }
          },
          delete: function(key, object) {
            let array = dim[key]
            let index = array.indexOf(object)
            if(index >= 0) { array.splice(index, 1) }
          },
          broadcast: function(message) {
            for(let i=dim.tanks.length-1;i>=0;i--) {
              let tank = dim.tanks[i]
              if(tank.ws && tank.ws.sendPacket) {
                tank.ws.sendPacket('announcement', message)
              }
            }
          }
        }
        if(dim.type === '2teams') {
          dim.teamCodeA = options.teamCodeA > 0 ? options.teamCodeA : 1
          dim.teamCodeB = options.teamCodeB > 0 ? options.teamCodeB : 2
        }
        dim.defaultWalls = dim.walls.length
        dim.timers = []
        dim.simTime = 0
        dim.after = function(fn, ms) {
          const t = { fn: fn, at: dim.simTime + (ms > 0 ? ms : 0), every: 0, cancelled: false }
          dim.timers.push(t)
          return t
        }
        dim.every = function(fn, ms) {
          ms = ms > 0 ? ms : dimension.tickMs
          const t = { fn: fn, at: dim.simTime + ms, every: ms, cancelled: false }
          dim.timers.push(t)
          return t
        }
        dim.runTimers = function(dt) {
          dim.simTime += dt
          const list = dim.timers, now = dim.simTime
          if(list.length === 0) { return }
          const due = []
          for(let i=list.length-1;i>=0;i--) {
            const t = list[i]
            if(t.cancelled) { list.splice(i, 1); continue }
            if(t.at <= now) {
              due.push(t)
              if(t.every) { t.at = now + t.every }
              else { list.splice(i, 1) }
            }
          }
          for(let i=due.length-1;i>=0;i--) {
            try { due[i].fn() } catch(e) { console.log('dim timer error', dim.name, e) }
          }
        }

        if(dim.name === 'ffa' || dim.name === '4teams' || dim.name === '2teams') {
          const sp = function() {
            let u = Math.floor((Math.pow(Math.random(), 2)) * 4)
            let a = `crasher${u + 3}-0`
            let radiant = 0
            if(Math.random() * 4096 < 1) {
              radiant ++
              while(Math.random() * 9 < 1) { radiant ++ }
            }
            let abyssling = generator.tank({
              dim: dim,
              x: (1 - 2 * Math.random()) * (dim.mapSize - 2000),
              y: (1 - 2 * Math.random()) * (dim.mapSize - 2000),
              name: 'an Awakened ' + ['Triangle', 'Square', 'Pentagon', 'Hexagon'][u],
              weapon: a,
              body: a,
              noKillNotification: true,
              score: 5250 * Math.pow(4, u),
              radiant: radiant,
              team: 5,
              ai: 'fallen',
              aiRam: true,
              invincible: false,
              onDeath: function() {
                dim.after(sp, 60000 + 60000 * Math.random())
              },
              polygon: true,
            })
            }
          const awakenedCount = 0
          for(let i=0;i<awakenedCount;i++) {
            dim.after(sp, 60000 + 60000 * Math.random())
          }
          let p = false
          const sk = function() {
            let a = 1 + Math.floor(4 * Math.pow(Math.random(), 4))
            let x = (1 - 2 * Math.random()) * (dim.mapSize - 2000)
            let y = (1 - 2 * Math.random()) * (dim.mapSize - 2000)
            generator.wormhole({
              x: x,
              y: y,
              size: 175,
              type: 1,
              time: 300,
              dim: dim,
              ruptured: false,
              action: function(tank) {
                dimension.sendTankTo({
                  tank: tank,
                  dim: 'abyssHallway'
                })
              }
            })
            let abyssling = generator.tank({
              dim: dim,
              x: x,
              y: y,
              name: 'Peacekeeper',
              weapon: 'peacekeeper' + a,
              body: 'peacekeeper' + a,
              score: 387096774 * Math.pow(15.5, a),
              exactDeathScore: true,
              radiant: 1,
              team: 8,
              ai: 'peacekeeper',
              invincible: false,
            })
            let d = 2 * Math.PI * Math.random()
            abyssling.xv = Math.sin(d) * 15 * dimension.per50
            abyssling.yv = Math.cos(d) * 15 * dimension.per50
            abyssling.d = -d
            return abyssling
          }
          dim.after(function() {
            p = sk()
            dim.every(function() {
              if(!p.alive) {
                p = sk()
              }
            }, 30 * 60 * 1000)
          }, 10000 + 0 * 30 * 60 * 1000 * Math.random())
        }
        dimension.dims[dim.name] = dim
        startTick(dim)
        return dim
      }
    },
    reset: function(dim) {
      for(let i=dim.tanks.length-1;i>=0;i--) {
        let tank = dim.tanks[i]
        tank._d = []
        tank.firedBarrels = {}
        if(tank.lastLevelSent !== tank.level) {
          tank.lastLevelSent = tank.level
        }
      }
      dim.updatedTanks = {}
      dim.leaderboardChanges = []
      dim.chatMessages = {}
      dim.updatedGates = {}
      dim.resizedWormholes = {}
      dim.rupturedWormholes = {}
      dim.fadeTimeChanges = {}
      dim.removedWormholes = {}
      dim.addedWormholes = {}
      dim.updatedPortals = {}
      dim.updatedWalls = {}
      dim.removedWalls = {}
      dim.mapSizeUpdated = false
      dim.darknessUpdated = false
      dim.matrixWallChanges = {}
    },
