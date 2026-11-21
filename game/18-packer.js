  const hasEntries = function(object) {
    for(let key in object) { return true }
    return false
  }
  const angleStep = function(angle, half) {
    const steps = half * 2
    return (Math.round(angle / Math.PI * half) % steps + steps) % steps
  }

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
        return [Math.round(b.x), Math.round(b.y), angleStep(b.d, 100) * Math.PI / 100, Math.round(b.xv * tickRate), Math.round(b.yv * tickRate), 0, 0]
      },
      polygonSpin: function(p) {
        return Math.round(0.005 * dimension.tickMultiplier * (p.speed || 0) * dimension.per50 * tickRate * 500 / Math.PI)
      },
      polygonMotion: function(p) {
        const vd = net.polygonSpin(p)
        return [Math.round(p.x), Math.round(p.y), angleStep(p.d, 500) * Math.PI / 500, Math.round(p.xv * tickRate), Math.round(p.yv * tickRate), vd * Math.PI / 500, vd]
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
      forget: function(known, seq, removed) {
        for(const [id, k] of known) {
          if(k.s !== seq) {
            known.delete(id)
            removed.push(id)
          }
        }
      },
      pick: function(state, kind, objects, removed, interval, sig, key) {
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
          const s0 = sig(o, 0), s1 = sig(o, 1)
          if(!k) {
            known.set(o.id, { o: o, at: seq - (o.id % n), s: seq, s0: s0, s1: s1, v: key(o), settled: false })
            out.push(o)
            continue
          }
          k.s = seq
          const forced = s0 > k.s0 || s1 !== k.s1
          if(seq - k.at >= n || forced) {
            k.at = seq
            k.s0 = s0
            k.s1 = s1
            const v = key(o)
            if(v === k.v) {
              if(k.settled && !forced) { continue }
              k.settled = true
            } else {
              k.v = v
              k.settled = false
            }
            out.push(o)
          }
        }
        this.forget(known, seq, removed)
        return out
      },
      pickMoving: function(state, kind, objects, removed, sig, motion) {
        const known = state.known[kind], seq = state.seq, out = []
        for(const i in objects) {
          const o = objects[i]
          if(!o || !(o.id >= 0)) { continue }
          let k = known.get(o.id)
          if(k && k.o !== o) {
            removed.push(o.id)
            k = false
          }
          const s0 = sig(o, 0), s1 = sig(o, 1)
          if(!k) {
            known.set(o.id, { o: o, s: seq, s0: s0, s1: s1, m: motion(o), ms: seq })
            out.push(o)
            continue
          }
          k.s = seq
          const forced = s0 > k.s0 || s1 !== k.s1
          k.s0 = s0
          k.s1 = s1
          const m = motion(o)
          if(!forced && this.predicted(k, m, seq)) { continue }
          k.m = m
          k.ms = seq
          out.push(o)
        }
        this.forget(known, seq, removed)
        return out
      },
      bulletSig: function(b, i) {
        return i === 0 ? (Math.floor((1 - b.health / b.maxHealth) * 10) || 0) : 0
      },
      polygonSig: function(p, i) {
        return i === 0 ? (Math.floor((1 - p.health / p.maxHealth) * 100) || 0) : (p.sides | 0) * 1000 + (p.radiant | 0)
      },
      frame: 0,
      serial: 0,
      scratch: null,
      knownSize: function(state, kind) {
        const table = state.tables && state.tables[kind]
        return (table ? table.count : 0) + state.known[kind].size
      },
      pickMotion: function(state, kind, objects, removed, sig, motion) {
        if(!native) {
          return this.pickMoving(state, kind, objects, removed, sig, motion)
        }
        const list = Array.isArray(objects) ? objects : Object.values(objects || {})
        const length = list.length
        let s = this.scratch
        if(!s) {
          s = this.scratch = { frame: -1, rows: 0, table: new Float64Array(12 * 1024), wire: new Float64Array(12 * 1024), turrets: new Float64Array(256), turretCount: 0, candidates: new Int32Array(1024), out: new Int32Array(1024), sent: new Int32Array(1024), bytes: new Uint8Array(65536), removed: new Float64Array(2048), info: new Int32Array(4), objects: [] }
        }
        if(s.frame !== this.frame) {
          s.frame = this.frame
          s.rows = 0
          s.turretCount = 0
        }
        if(s.candidates.length < length) {
          s.candidates = new Int32Array(length * 2)
          s.out = new Int32Array(length * 2)
        }
        if((s.rows + length) * 12 > s.table.length) {
          const size = Math.max(s.table.length * 2, (s.rows + length) * 24)
          const grown = new Float64Array(size), grownWire = new Float64Array(size)
          grown.set(s.table.subarray(0, s.rows * 12))
          grownWire.set(s.wire.subarray(0, s.rows * 12))
          s.table = grown
          s.wire = grownWire
        }
        const stamp = this.frame * 3 + kind, table = s.table, candidates = s.candidates, objs = s.objects
        let count = 0
        for(let i=0;i<length;i++) {
          const o = list[i]
          if(!o || !(o.id >= 0)) { continue }
          if(o._netFrame !== stamp) {
            const row = s.rows ++, j = row * 12
            o._netFrame = stamp
            o._netRow = row
            table[j] = o.id
            table[j + 1] = o._netSerial || (o._netSerial = ++this.serial)
            table[j + 2] = sig(o, 0)
            table[j + 3] = sig(o, 1)
            const m = motion(o)
            if(m) {
              table[j + 4] = 1
              for(let k=0;k<7;k++) { table[j + 5 + k] = m[k] }
            } else {
              table[j + 4] = 0
            }
            this.fillWire(s, kind, o, j)
          }
          candidates[count] = o._netRow
          objs[count] = o
          count ++
        }
        const tables = state.tables || (state.tables = [])
        const known = tables[kind] || (tables[kind] = { count: 0, index: new Int32Array(0), entries: new Float64Array(0), spareIndex: new Int32Array(64), spareEntries: new Float64Array(14 * 32) })
        if(known.spareIndex.length < 64 || known.spareIndex.length < count * 2) {
          let size = 64
          while(size < count * 3) { size *= 2 }
          known.spareIndex = new Int32Array(size)
        }
        if(known.spareEntries.length < count * 14) {
          known.spareEntries = new Float64Array(Math.ceil(count * 1.5) * 14)
        }
        if(s.removed.length < count + known.count) {
          s.removed = new Float64Array((count + known.count) * 2)
        }
        s.info[0] = known.count
        const sent = native.pick(count, candidates, table, known.index, known.entries, known.spareIndex, known.spareEntries, state.seq, this.keyframe, this.seqTime, s.out, s.removed, s.info)
        const oldIndex = known.index, oldEntries = known.entries
        known.index = known.spareIndex
        known.entries = known.spareEntries
        known.spareIndex = oldIndex
        known.spareEntries = oldEntries
        known.count = s.info[3]
        const out = new Array(sent), picked = s.out, gone = s.removed
        for(let p=0;p<sent;p++) { out[p] = objs[picked[p]] }
        for(let p=0,l=s.info[2];p<l;p++) { removed.push(gone[p]) }
        objs.length = 0
        return out
      },
      Raw: function(bytes) {
        this.bytes = bytes
      },
      bulletEntry: function(bullet) {
        let arr = [
          bullet.id,
          Math.round(bullet.x),
          Math.round(bullet.y),
          angleStep(bullet.d, 100),
          Math.floor((1 - bullet.health / bullet.maxHealth) * 100),
          Math.round(bullet.xv * dimension.tickRate),
          Math.round(bullet.yv * dimension.tickRate)
        ]
        if(bullet.turrets && bullet.turrets[0]) {
          let a = []
          for(let i in bullet.turrets) {
            let turret = bullet.turrets[i]
            a.push(angleStep(turret.d, 100))
          }
          arr.push(a)
        }
        return arr
      },
      polygonEntry: function(polygon) {
        return [
          polygon.id,
          Math.round(polygon.x),
          Math.round(polygon.y),
          angleStep(polygon.d, 500),
          Math.floor((1 - polygon.health / polygon.maxHealth) * 500),
          Math.round(polygon.xv * dimension.tickRate),
          Math.round(polygon.yv * dimension.tickRate),
          net.polygonSpin(polygon)
        ]
      },
      bulletSection: function(list) {
        let data = [3]
        let object = {}, ids = {}
        for(let i=0,l=list.length;i<l;i++) {
          let bullet = list[i]
          let parentId = bullet.parentId
          let barrelId = bullet.barrelId
          if(!(parentId in object)) {
            object[parentId] = {}
            ids[parentId] = parentId
          }
          let obj = object[parentId]
          let arr = net.bulletEntry(bullet)
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
        return data
      },
      polygonSection: function(list) {
        let data = [4]
        let obj = {}, keys = {}, keys2 = {}
        for(let i=0,l=list.length;i<l;i++) {
          let polygon = list[i]
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
              arr2.push(net.polygonEntry(obj2[id]))
            }
            arr.push(arr2)
          }
          data.push(arr)
        }
        return data
      },
      fillWire: function(s, kind, o, j) {
        const wire = s.wire
        if(kind === 1) {
          const entry = net.bulletEntry(o)
          wire[j] = o.parentId
          wire[j + 1] = o.barrelId
          for(let k=0;k<7;k++) { wire[j + 2 + k] = entry[k] }
          wire[j + 9] = -1
          wire[j + 10] = 0
          if(entry.length > 7) {
            const turrets = entry[7]
            if(s.turretCount + turrets.length > s.turrets.length) {
              const grown = new Float64Array(Math.max(s.turrets.length * 2, s.turretCount + turrets.length))
              grown.set(s.turrets.subarray(0, s.turretCount))
              s.turrets = grown
            }
            wire[j + 9] = turrets.length
            wire[j + 10] = s.turretCount
            for(let k=0;k<turrets.length;k++) { s.turrets[s.turretCount ++] = turrets[k] }
          }
          wire[j + 11] = typeof o.parentId === 'number' && typeof o.barrelId === 'number' && typeof entry[0] === 'number' ? 1 : 0
        } else {
          const entry = net.polygonEntry(o)
          wire[j] = o.radiant
          wire[j + 1] = o.sides
          for(let k=0;k<8;k++) { wire[j + 2 + k] = entry[k] }
          wire[j + 10] = 0
          wire[j + 11] = typeof o.radiant === 'number' && typeof o.sides === 'number' && typeof entry[0] === 'number' ? 1 : 0
        }
      },
      rawSection: function(kind, list) {
        const s = this.scratch
        if(!native || !s || s.frame !== this.frame) { return null }
        const n = list.length, stamp = this.frame * 3 + kind, wire = s.wire
        if(s.sent.length < n) { s.sent = new Int32Array(n * 2) }
        const rows = s.sent
        for(let i=0;i<n;i++) {
          const o = list[i]
          if(!o || o._netFrame !== stamp) { return null }
          const row = o._netRow
          if(wire[row * 12 + 11] !== 1) { return null }
          rows[i] = row
        }
        let size = native.encode(kind, n, rows, wire, s.turrets, s.bytes)
        if(size > s.bytes.length) {
          s.bytes = new Uint8Array(size * 2)
          size = native.encode(kind, n, rows, wire, s.turrets, s.bytes)
        }
        return new this.Raw(Buffer.from(s.bytes.subarray(0, size)))
      },
      arrayHeader: function(count) {
        if(count < 16) { return Buffer.from([0x90 | count]) }
        if(count < 65536) { return Buffer.from([0xdc, count >> 8, count & 255]) }
        return Buffer.from([0xdd, (count >>> 24) & 255, (count >> 16) & 255, (count >> 8) & 255, count & 255])
      },
      encode: function(code, packet) {
        const n = packet.length, parts = [Buffer.from([0x92]), pack(code), this.arrayHeader(n)]
        let start = 0
        for(let i=0;i<=n;i++) {
          if(i === n || packet[i] instanceof this.Raw) {
            if(i > start) {
              const run = packet.slice(start, i)
              parts.push(pack(run).subarray(this.arrayHeader(run.length).length))
            }
            if(i < n) { parts.push(packet[i].bytes) }
            start = i + 1
          }
        }
        return Buffer.concat(parts)
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
        fovObject: false,
        staff: false,
        follow: -1
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
      if(s.follow >= 0 && !(spectate.alive(s) && s.target.ws && s.target.ws.data && s.target.ws.data.uid === s.follow)) {
        for(let i=s.dim.tanks.length-1;i>=0;i--) {
          const t = s.dim.tanks[i]
          if(t.ws && t.ws.data && t.ws.data.uid === s.follow) {
            s.target = t
            break
          }
        }
      }
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
    staff: function(tank) {
      return tank.ws && tank.ws.data && tank.ws.data.isPlayer && commands.level(tank.ws.data.role) >= commands.level('admin') ? 1 : 0
    },
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
          Math.round(tank.maxHealth) || 0,
          packer.staff(tank)
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
        dim.customWeapons && hasEntries(dim.customWeapons) ? dim.customWeapons : false,
        dim.customBodies && hasEntries(dim.customBodies) ? dim.customBodies : false,
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
      const shownTanks = visible ? options.tanks.filter(function(t) {
        return t === viewer || visible[t.id] || t.alwaysShowOnMinimap || dimension.isSameTeam(viewer, t)
      }) : options.tanks
      const sendTanks = net.pick(state, 0, shownTanks, removed[0], function(t) {
        if(t === viewer || dim.updatedTanks[t.id]) { return 1 }
        if(visible && !visible[t.id]) { return net.tanks[2] }
        return net.tanks[isNear(t) ? 0 : 1]
      }, function(t, i) {
        if(i === 0) { return Math.floor((1 - t.health / t.maxHealth) * 100) || 0 }
        return (hasEntries(t.firedBarrels) ? state.seq : 0) + (t.typing ? 1 : 0) + (t.passive ? 2 : 0) + (t.invincible ? 4 : 0) + (t.invisible ? 8 : 0) + (t.alwaysShowOnMinimap ? 16 : 0) + (t.level | 0) * 32 + (t.team | 0) * 100000 + net.hidden(t) / 32
      }, function(t) {
        let k = Math.round(t.x) + ',' + Math.round(t.y) + ',' + angleStep(t.d, 1000) + ',' + Math.floor((1 - t.health / t.maxHealth) * 100)
        for(let i=0,l=t._turrets.length;i<l;i++) { k += ',' + angleStep(t._turrets[i].d, 50) }
        return k
      })
      const sendBullets = net.pickMotion(state, 1, options.bullets, removed[1], net.bulletSig, net.bulletMotion)
      const sendPolygons = net.pickMotion(state, 2, options.polygons, removed[2], net.polygonSig, net.polygonMotion)
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

          let d = angleStep(tank.d, 1000)
          let recordedDirections = d, turns = tank._d, length = Math.min(turns.length, 5)
          for(let i=1;i<length;i++) {
            if(turns[i] !== turns[i - 1]) {
              recordedDirections = []
              for(let k=0;k<5;k++) { recordedDirections.push(k < length ? turns[k] : d) }
              break
            }
          }
          let turretDirections = []
          for(let i=0,l=tank._turrets.length;i<l;i++) {
            let turret = tank._turrets[i]
            turretDirections.push(angleStep(turret.d, 50))
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
          if(hasEntries(tank.firedBarrels)) {
            arr.push(Object.values(tank.firedBarrels))
          }
          data.push(arr)
        }
        packet.push(data)
      }
      if(hasEntries(options.dim.updatedTanks)) {
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
            Math.round(tank.maxHealth) || 0,
            packer.staff(tank)
          ]
          data.push(arr)
        }
        packet.push(data)
      }
      if(hasEntries(options.dim.chatMessages)) {
        let data = [2]
        for(let i in options.dim.chatMessages) {
          data.push([i, options.dim.chatMessages[i]])
        }
        packet.push(data)
      }
      if(sendBullets.length) {
        const raw = net.rawSection(1, sendBullets)
        if(raw) {
          packet.push(raw)
          packet.raw = true
        } else {
          packet.push(net.bulletSection(sendBullets))
        }
      }
      if(sendPolygons.length) {
        const raw = net.rawSection(2, sendPolygons)
        if(raw) {
          packet.push(raw)
          packet.raw = true
        } else {
          packet.push(net.polygonSection(sendPolygons))
        }
      }
      if(hasEntries(options.dim.leaderboardChanges)) {
        let data = [5].concat(options.dim.leaderboardChanges)

        packet.push(data)
      }
      if(hasEntries(options.dim.updatedGates)) {
        let data = [6]

        for(let i in options.dim.updatedGates) {
          let gate = options.dim.updatedGates[i]
          data.push(gate)
        }
        packet.push(data)
      }
      if(hasEntries(options.dim.resizedWormholes)) {
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
      if(hasEntries(options.dim.rupturedWormholes)) {
        let data = [8]

        for(let i in options.dim.rupturedWormholes) {
          let wormhole = options.dim.rupturedWormholes[i]
          data.push(wormhole.id)
        }
        packet.push(data)
      }
      if(hasEntries(options.dim.fadeTimeChanges)) {
        let data = [9]

        for(let i in options.dim.fadeTimeChanges) {
          let wormhole = options.dim.fadeTimeChanges[i]
          data.push([wormhole.id, Math.round(wormhole.fadeTime * 100)])
        }
        packet.push(data)
      }
      if(hasEntries(options.dim.removedWormholes)) {
        let data = [10]

        for(let i in options.dim.removedWormholes) {
          let wormhole = options.dim.removedWormholes[i]
          data.push(wormhole.id)
        }
        packet.push(data)
      }
      if(hasEntries(options.dim.addedWormholes)) {
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
      if(hasEntries(options.dim.updatedPortals)) {
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
      if(hasEntries(options.dim.updatedWalls)) {
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
      if(hasEntries(options.dim.removedWalls)) {
        let data = [16]

        for(let i in options.dim.removedWalls) {
          let w = options.dim.removedWalls[i]
          data.push(w)
        }
        packet.push(data)
      }
      if(hasEntries(options.dim.matrixWallChanges)) {
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
      if(packet.length === 3 && state.sentScore === options.score && state.seq - state.sentSeq < net.keepalive && !net.knownSize(state, 1) && !net.knownSize(state, 2)) { return null }
      state.sentScore = options.score
      state.sentSeq = state.seq
      return packet
    }
  }

