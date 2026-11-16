  const net = (function() {
    const c = Object.assign({
      sendRate: 30,
      nearTanks: 30,
      farTanks: 15,
      offscreenTanks: 2.5,
      nearBullets: 30,
      farBullets: 15,
      nearPolygons: 15,
      farPolygons: 5,
      nearDistance: 0.55
    }, (args && args.network) || {})
    const tickRate = dimension.tickRate
    const sendTicks = Math.max(1, Math.round(tickRate / Math.max(1, c.sendRate)))
    const every = function(rate) {
      return Math.max(1, Math.round(tickRate / sendTicks / Math.max(0.1, rate)))
    }
    return {
      sendTicks: sendTicks,
      keepalive: Math.max(1, Math.round(tickRate / sendTicks)),
      near: c.nearDistance,
      tanks: [every(c.nearTanks), every(c.farTanks), every(c.offscreenTanks)],
      bullets: [every(c.nearBullets), every(c.farBullets)],
      polygons: [every(c.nearPolygons), every(c.farPolygons)],
      keyframe: Math.max(1, Math.round(2 * tickRate / sendTicks)),
      seqTime: sendTicks / tickRate,
      bulletMotion: function(b) {
        if(b.turrets && b.turrets[0]) { return null }
        return [Math.round(b.x), Math.round(b.y), ((Math.round(b.d / Math.PI * 100) % 200 + 200) % 200) * Math.PI / 100, Math.round(b.xv * tickRate), Math.round(b.yv * tickRate), 0, 0]
      },
      polygonMotion: function(p) {
        const vd = Math.round(0.005 * dimension.tickMultiplier * (p.speed || 0) * dimension.per50 * tickRate * 500 / Math.PI)
        return [Math.round(p.x), Math.round(p.y), ((Math.round(p.d / Math.PI * 500) % 1000 + 1000) % 1000) * Math.PI / 500, Math.round(p.xv * tickRate), Math.round(p.yv * tickRate), vd * Math.PI / 500, vd]
      },
      predicted: function(k, m, seq) {
        const p = k.m
        if(!p || !m || seq - k.ms >= this.keyframe) { return false }
        const t = (seq - k.ms) * this.seqTime
        const ex = p[0] + p[3] * t - m[0], ey = p[1] + p[4] * t - m[1]
        let ed = (p[2] + p[5] * t - m[2]) % (2 * Math.PI)
        if(ed > Math.PI) { ed -= 2 * Math.PI } else if(ed < -Math.PI) { ed += 2 * Math.PI }
        return ex * ex + ey * ey < 9 && Math.abs(ed) < 0.03
      },
      state: function(viewer) {
        return viewer.net || (viewer.net = { seq: 0, known: [new Map(), new Map(), new Map()] })
      },
      hidden: function(tank) {
        return tank.alpha < 1 ? Math.round((1 - tank.alpha) * 20) : 0
      },
      pick: function(state, kind, objects, removed, interval, sig, key, motion) {
        const known = state.known[kind], seq = state.seq, out = []
        for(const i in objects) {
          const o = objects[i]
          if(!o || !(o.id >= 0)) { continue }
          const n = interval(o)
          let k = known.get(o.id)
          if(k && k.o !== o) {
            removed.push(o.id)
            k = false
          }
          const s0 = sig ? sig(o, 0) : 0, s1 = sig ? sig(o, 1) : 0
          if(!k) {
            known.set(o.id, { o: o, at: seq - (o.id % n), s: seq, s0: s0, s1: s1, v: key ? key(o) : 0, settled: false, m: motion ? motion(o) : null, ms: seq })
            out.push(o)
            continue
          }
          k.s = seq
          const forced = s0 > k.s0 || s1 !== k.s1
          if(motion || seq - k.at >= n || forced) {
            k.at = seq
            k.s0 = s0
            k.s1 = s1
            if(motion) {
              const m = motion(o)
              if(!forced && this.predicted(k, m, seq)) { continue }
              k.m = m
              k.ms = seq
            } else if(key) {
              const v = key(o)
              if(v === k.v) {
                if(k.settled && !forced) { continue }
                k.settled = true
              } else {
                k.v = v
                k.settled = false
              }
            }
            out.push(o)
          }
        }
        for(const [id, k] of known) {
          if(k.s !== seq) {
            known.delete(id)
            removed.push(id)
          }
        }
        return out
      }
    }
  })()
  const spectate = {
    add: function(ws, dim, tank, target) {
      spectate.remove(ws)
      if(!dim.spectators) { dim.spectators = [] }
      const s = {
        ws: ws,
        dim: dim,
        target: target || false,
        x: tank.x,
        y: tank.y,
        fovMultiplier: tank.fovMultiplier || 1,
        net: tank.net || false,
        lastDarkness: tank.lastDarkness,
        darknessUpdated: -1,
        fov: { tanks: dim.tanks, bullets: [], polygons: [] },
        fovVisible: null,
        fovObject: false
      }
      ws.data.spectator = s
      dim.spectators.push(s)
    },
    remove: function(ws) {
      const s = ws && ws.data && ws.data.spectator
      if(!s) { return }
      ws.data.spectator = false
      const i = s.dim.spectators.indexOf(s)
      if(i >= 0) { s.dim.spectators.splice(i, 1) }
    },
    alive: function(s) {
      const t = s.target
      if(!t) { return false }
      return (t.objectType === 'tank' ? s.dim.tanks : s.dim.polygons).indexOf(t) >= 0
    },
    follow: function(s) {
      if(!spectate.alive(s)) {
        let best = false
        for(let i=s.dim.tanks.length-1;i>=0;i--) {
          const t = s.dim.tanks[i]
          if(!t.static && !t.invisible && (!best || t.score > best.score)) { best = t }
        }
        s.target = best
      }
      if(s.target) {
        s.x = s.target.x
        s.y = s.target.y
        if(s.target.fovMultiplier > 0) { s.fovMultiplier = s.target.fovMultiplier }
      }
    },
    send: function(dim) {
      if(!dim.spectators || !dim.spectators.length) { return }
      const list = dim.spectators.slice()
      for(let i=list.length-1;i>=0;i--) {
        const s = list[i]
        if(s.ws.closed || !s.ws.sendPacket) {
          spectate.remove(s.ws)
          continue
        }
        const t = s.target
        const p = packer.gameUpdate({
          tank: s,
          tanks: dim.tanks,
          bullets: s.fov.bullets || [],
          polygons: s.fov.polygons || [],
          id: -1,
          score: 0,
          dim: dim,
          spectate: [t && t.objectType === 'tank' ? t.id : -1, Math.round(s.x), Math.round(s.y), t ? (t.name || (t.objectType === 'polygon' ? dimension.getFullPolygonName(t) : '')) : '']
        })
        if(p) { s.ws.sendPacket('gameUpdate', p) }
      }
    }
  }
  const packer = {
    gameStart: function(options) {
      options.tank.net = false
      let dim = options.dim
      let tanks = []
      for(let i=dim.tanks.length-1;i>=0;i--) {
        let tank = dim.tanks[i]
        tanks.push([
          tank.id,
          tank.name,
          tank.team,
          tank.radiant,
          tank.weapon,
          tank.body,
          tank.ws ? (tank.ws.accountNameParsed || false) : false,
          Math.round(tank.maxHealth) || 0
        ])
      }
      let objects = dimension.leaderboard(dim)
      let leaderboard = []

      for(let i=0;i<8;i++) {
        let obj = objects[i]
        if(obj) {
          leaderboard.push([
            obj.id,
            (obj.objectType === 'tank' ? 0 : [obj.sides, obj.radiant]),
            Math.round(obj.score)
          ])
        } else {
          leaderboard.push([
            -i - 1,
            [0, 0],
            1
          ])
        }
      }
      let slicedGates = []

      for(let i=0,l=dim.gates.length;i<l;i++) {
        slicedGates.push(dim.gates[i].slice(0, 6))
      }

      let wormholes = []
      for(let i in dim.wormholes) {
        let wormhole = dim.wormholes[i]
        wormholes.push([
          wormhole.id,
          wormhole.x,
          wormhole.y,
          wormhole.type,
          wormhole.size,
          wormhole.ruptured || false,
          Math.round(wormhole.fadeTime * 100),
          wormhole.color,
          wormhole.radiant,
          generator.wormholeLifeMs(wormhole)
        ])
      }
      let w = []

      for(let i=0,l=dim.walls.length;i<l;i++) {
        let c = dim.walls[i]
        if(c) {
          w.push(c)
        } else {
          w.push(false)
        }
      }
      let p = []

      for(let i=0,l=dim.ambientParticles.length;i<l;i++) {
        let a = dim.ambientParticles[i]
        p.push([
          a.amount,
          a.radiant,
          a.size[0],
          a.size[1],
          a.color.r,
          a.color.g,
          a.color.b,
          a.d,
          a.range,
          a.speed,
          a.fade,
          a.t,
          a.opacity
        ])
      }
      let c = dim.flat(-dim.mapSize), s = -c * 2
      let arr = new Uint8Array(Math.ceil(s * s / 8)), changed = false
      for(let x in dim.matrixWalls) {
        let m = dim.matrixWalls[x]
        for(let y in m) {
          let sx = x * 1 - c
          let sy = y * 1 - c
          let i = sx * s + sy
          changed = true
          let f = Math.floor(i / 8)
          arr[f] = arr[f] | (1 << (i % 8))
        }
      }
      if(!changed) { arr = false }

      return [
        tanks,
        dim.mapSize,
        leaderboard,
        w,
        slicedGates,
        wormholes,
        options.upgrades,
        options.tank.lastDarkness >= 0 ? options.tank.lastDarkness : Math.round(dim.darkness),
        [dim.background.r, dim.background.g, dim.background.b, dim.grid.r, dim.grid.g, dim.grid.b, dim.gridSize],
        false,
        dim.fillWalls ? true : false,
        p,
        Math.round(dim.sizeScale * 1000),
        dim.customWeapons && Object.keys(dim.customWeapons).length > 0 ? dim.customWeapons : false,
        dim.customBodies && Object.keys(dim.customBodies).length > 0 ? dim.customBodies : false,
        dim.wallEdit ? true : false,
        arr,
        dim.noMinimap ? true : false,
        Math.round(net.seqTime * 100000) / 100
      ]
    },
    gameUpdate: function(options) {
      let packet = [options.id, options.score, Math.round(10 * options.dim.tickTime)]
      let dim = options.dim
      const infoNow = Date.now()
      if(!(infoNow - dim.serverInfoAt < 1000)) {
        dim.serverInfoAt = infoNow
        dim.serverInfo = [dim.getTickrate(), dim.playerCount(), game.totalPlayers || 0]
        dim.serverInfoKey = dim.serverInfo.join(',')
      }
      if(options.tank.serverInfoKey !== dim.serverInfoKey) {
        options.tank.serverInfoKey = dim.serverInfoKey
        packet.push([18].concat(dim.serverInfo))
      }
      const viewer = options.tank, state = net.state(viewer), visible = viewer.fovVisible
      const nw = 1920 * (viewer.fovMultiplier || 1) * net.near, nh = 1080 * (viewer.fovMultiplier || 1) * net.near
      const isNear = function(o) {
        return Math.abs(o.x - viewer.x) < nw + (o.size || 0) && Math.abs(o.y - viewer.y) < nh + (o.size || 0)
      }
      const removed = [[], [], []]
      state.seq ++
      const sendTanks = net.pick(state, 0, options.tanks, removed[0], function(t) {
        if(t === viewer || dim.updatedTanks[t.id]) { return 1 }
        if(visible && !visible[t.id] && !t.alwaysShowOnMinimap) { return net.tanks[2] }
        return net.tanks[isNear(t) ? 0 : 1]
      }, function(t, i) {
        if(i === 0) { return Math.floor((1 - t.health / t.maxHealth) * 100) || 0 }
        let fired = 0
        for(const b in t.firedBarrels) { fired = state.seq; break }
        return fired + (t.typing ? 1 : 0) + (t.passive ? 2 : 0) + (t.invincible ? 4 : 0) + (t.invisible ? 8 : 0) + (t.alwaysShowOnMinimap ? 16 : 0) + (t.level | 0) * 32 + (t.team | 0) * 100000 + net.hidden(t) / 32
      }, function(t) {
        let k = Math.round(t.x) + ',' + Math.round(t.y) + ',' + ((Math.round(t.d / Math.PI * 1000) % 2000 + 2000) % 2000) + ',' + Math.floor((1 - t.health / t.maxHealth) * 100)
        for(let i=0,l=t._turrets.length;i<l;i++) { k += ',' + ((Math.round(t._turrets[i].d / Math.PI * 50) % 100 + 100) % 100) }
        return k
      })
      const sendBullets = net.pick(state, 1, options.bullets, removed[1], function(b) {
        return net.bullets[isNear(b) ? 0 : 1]
      }, function(b, i) {
        return i === 0 ? (Math.floor((1 - b.health / b.maxHealth) * 10) || 0) : 0
      }, null, net.bulletMotion)
      const sendPolygons = net.pick(state, 2, options.polygons, removed[2], function(p) {
        return net.polygons[isNear(p) ? 0 : 1]
      }, function(p, i) {
        return i === 0 ? (Math.floor((1 - p.health / p.maxHealth) * 100) || 0) : (p.sides | 0) * 1000 + (p.radiant | 0)
      }, null, net.polygonMotion)
      if(removed[0].length || removed[1].length || removed[2].length) {
        packet.push([19, removed[0], removed[1], removed[2]])
      }
      if(options.spectate) {
        packet.push([20].concat(options.spectate))
      }
      if(sendTanks.length) {
        let data = [0]
        for(let i=0,l=sendTanks.length;i<l;i++) {
          let tank = sendTanks[i]

          let d = (Math.round(tank.d / Math.PI * 1000) % 2000 + 2000) % 2000
          let recordedDirections = [], length = tank._d.length
          if(length <= 1) {
            recordedDirections = d
          } else {
            let same = true
            for(let i=0;i<5;i++) {
              if(i < length) {
                recordedDirections.push(tank._d[i])
                if(same && i > 0 && tank._d[i] !== recordedDirections[i - 1]) {
                  same = false
                }
              } else {
                recordedDirections.push(d)
              }
            }
            if(same) {
              recordedDirections = d
            }
          }
          let turretDirections = []
          for(let i=0,l=tank._turrets.length;i<l;i++) {
            let turret = tank._turrets[i]
            turretDirections.push((Math.round(turret.d / Math.PI * 50) % 100 + 100) % 100)
          }
          let arr = [
            tank.id,
            Math.round(tank.x),
            Math.round(tank.y),
            recordedDirections,
            turretDirections,
            Math.floor((1 - tank.health / tank.maxHealth) * 100),
            (tank.typing ? 1 : 0) + (tank.passive ? 2 : 0) + (tank.invincible ? 4 : 0) + (tank.invisible ? 8 : 0) + (tank.alwaysShowOnMinimap ? 16 : 0) + net.hidden(tank) * 32,
            tank.level
          ]
          let firedBarrels = Object.values(tank.firedBarrels)
          if(firedBarrels[0] >= 0) {
            arr.push(firedBarrels)
          }
          data.push(arr)
        }
        packet.push(data)
      }
      if(Object.keys(options.dim.updatedTanks)[0] >= 0) {
        let data = [1]
        for(let i in options.dim.updatedTanks) {
          let tank = options.dim.updatedTanks[i]
          let arr = [
            tank.id,
            tank.name,
            tank.team,
            tank.radiant,
            tank.weapon,
            tank.body,
            tank.ws ? (tank.ws ? tank.ws.accountNameParsed || false : false) : false,
            Math.round(tank.maxHealth) || 0
          ]
          data.push(arr)
        }
        packet.push(data)
      }
      if(Object.keys(options.dim.chatMessages)[0] >= 0) {
        let data = [2]
        for(let i in options.dim.chatMessages) {
          data.push([i, options.dim.chatMessages[i]])
        }
        packet.push(data)
      }
      if(sendBullets.length) {
        let data = [3]
        let object = {}, ids = {}
        for(let i=0,l=sendBullets.length;i<l;i++) {
          let bullet = sendBullets[i]
          let parentId = bullet.parentId
          let barrelId = bullet.barrelId
          if(!(parentId in object)) {
            object[parentId] = {}
            ids[parentId] = parentId
          }
          let obj = object[parentId]
          let arr = [
            bullet.id,
            Math.round(bullet.x),
            Math.round(bullet.y),
            (Math.round(bullet.d / Math.PI * 100) % 200 + 200) % 200,
            Math.floor((1 - bullet.health / bullet.maxHealth) * 100),
            Math.round(bullet.xv * dimension.tickRate),
            Math.round(bullet.yv * dimension.tickRate)
          ]
          if(bullet.turrets && bullet.turrets[0]) {
            let a = []
            for(let i in bullet.turrets) {
              let turret = bullet.turrets[i]
              a.push((Math.round(turret.d / Math.PI * 100) % 200 + 200) % 200)
            }
            arr.push(a)
          }
          if(barrelId in obj) {
            obj[barrelId].push(arr)
          } else {
            obj[barrelId] = [barrelId, arr]
          }
        }
        for(let parentId in object) {
          let objects = object[parentId]
          let obj = [ids[parentId]]
          for(let barrelId in objects) {
            obj.push(objects[barrelId])
          }
          data.push(obj)
        }
        packet.push(data)
      }
      if(sendPolygons.length) {
        let data = [4]
        let obj = {}, keys = {}, keys2 = {}

        for(let i=0,l=sendPolygons.length;i<l;i++) {
          let polygon = sendPolygons[i]
          let object = obj[polygon.radiant]
          if(!object) {
            object = obj[polygon.radiant] = {}
            keys[polygon.radiant] = polygon.radiant
          }
          if(object[polygon.sides]) {
            object[polygon.sides][polygon.id] = polygon
          } else {
            let obj2 = {}
            obj2[polygon.id] = polygon
            object[polygon.sides] = obj2
            keys2[polygon.sides] = polygon.sides
          }
        }
        for(let radiant in obj) {
          radiant = keys[radiant]
          let object = obj[radiant]
          let arr = [radiant]
          for(let sides in object) {
            let obj2 = object[sides]
            let arr2 = [keys2[sides]]
            for(let id in obj2) {
              let polygon = obj2[id]
              arr2.push([
                polygon.id,
                Math.round(polygon.x),
                Math.round(polygon.y),
                (Math.round(polygon.d / Math.PI * 500) % 1000 + 1000) % 1000,
                Math.floor((1 - polygon.health / polygon.maxHealth) * 500),
                Math.round(polygon.xv * dimension.tickRate),
                Math.round(polygon.yv * dimension.tickRate),
                net.polygonMotion(polygon)[6]
              ])
            }
            arr.push(arr2)
          }
          data.push(arr)
        }
        packet.push(data)
      }
      if(Object.keys(options.dim.leaderboardChanges)[0] >= 0) {
        let data = [5].concat(options.dim.leaderboardChanges)

        packet.push(data)
      }
      if(Object.keys(options.dim.updatedGates)[0] >= 0) {
        let data = [6]

        for(let i in options.dim.updatedGates) {
          let gate = options.dim.updatedGates[i]
          data.push(gate)
        }
        packet.push(data)
      }
      if(Object.keys(options.dim.resizedWormholes)[0] >= 0) {
        let data = [7]

        for(let i in options.dim.resizedWormholes) {
          let wormhole = options.dim.resizedWormholes[i]
          data.push([
            wormhole.id,
            Math.round(wormhole.size),
            generator.wormholeLifeMs(wormhole)
          ])
        }
        packet.push(data)
      }
      if(Object.keys(options.dim.rupturedWormholes)[0] >= 0) {
        let data = [8]

        for(let i in options.dim.rupturedWormholes) {
          let wormhole = options.dim.rupturedWormholes[i]
          data.push(wormhole.id)
        }
        packet.push(data)
      }
      if(Object.keys(options.dim.fadeTimeChanges)[0] >= 0) {
        let data = [9]

        for(let i in options.dim.fadeTimeChanges) {
          let wormhole = options.dim.fadeTimeChanges[i]
          data.push([wormhole.id, Math.round(wormhole.fadeTime * 100)])
        }
        packet.push(data)
      }
      if(Object.keys(options.dim.removedWormholes)[0] >= 0) {
        let data = [10]

        for(let i in options.dim.removedWormholes) {
          let wormhole = options.dim.removedWormholes[i]
          data.push(wormhole.id)
        }
        packet.push(data)
      }
      if(Object.keys(options.dim.addedWormholes)[0] >= 0) {
        let data = [11]

        for(let i in options.dim.addedWormholes) {
          let wormhole = options.dim.addedWormholes[i]
          data.push([
            wormhole.id,
            wormhole.x,
            wormhole.y,
            wormhole.type,
            wormhole.size,
            wormhole.ruptured || false,
            Math.round(wormhole.fadeTime * 100),
            wormhole.color,
            wormhole.radiant,
            generator.wormholeLifeMs(wormhole)
          ])
        }
        packet.push(data)
      }
      if(options.dim.darknessUpdated) {
        packet.push([12, options.dim.darkness])
        options.tank.lastDarkness = options.dim.darkness
      } else if(options.tank.darknessUpdated >= 0) {
        packet.push([12, options.tank.darknessUpdated])
        options.tank.lastDarkness = options.tank.darknessUpdated
        options.tank.darknessUpdated = -1
      }
      if(Object.keys(options.dim.updatedPortals)[0] >= 0) {
        let data = [13]

        for(let i in options.dim.updatedPortals) {
          let wormhole = options.dim.updatedPortals[i]
          data.push([
            wormhole.id,
            wormhole.color,
            wormhole.radiant
          ])
        }
        packet.push(data)
      }
      if(Object.keys(options.dim.updatedWalls)[0] >= 0) {
        let data = [14]

        for(let i in options.dim.updatedWalls) {
          let wall = options.dim.updatedWalls[i]
          if(!wall) { continue }
          data.push([
            parseInt(i),
            wall[4] || false,
            wall[0],
            wall[1],
            wall[2],
            wall[3]
          ])
        }
        packet.push(data)
      }
      if(options.dim.mapSizeUpdated) {
        packet.push([15, options.dim.mapSizeUpdated])
      }
      if(Object.keys(options.dim.removedWalls)[0] >= 0) {
        let data = [16]

        for(let i in options.dim.removedWalls) {
          let w = options.dim.removedWalls[i]
          data.push(w)
        }
        packet.push(data)
      }
      if(Object.keys(options.dim.matrixWallChanges).length > 0) {
        let data = [17, [], []]

        for(let x in options.dim.matrixWallChanges) {
          let m = options.dim.matrixWallChanges[x]
          for(let y in m) {
            let i = m[y] ? 1 : 2
            data[i].push([x, y])
          }
        }
        packet.push(data)
      }
      if(packet.length === 3 && state.sentScore === options.score && state.seq - state.sentSeq < net.keepalive && !state.known[1].size && !state.known[2].size) { return null }
      state.sentScore = options.score
      state.sentSeq = state.seq
      return packet
    }
  }

