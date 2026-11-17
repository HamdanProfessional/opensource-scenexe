    let gameUpgrades = [0, 0, 0, 0, 0, 0, 0, 0]
    let gameControlPosition = [0, 0]
    let gameData = {
      me: false,
      tanks: [],
      bullets: [],
      polygons: [],
      wormholes: {},
      bases: [],
      walls: [],
      gates: [],
      mapSize: 1000,
      _mapSize: 1000,
      grid: {
        size: 30,
        pattern: false,
        background: { r: 205, g: 205, b: 205 },
        lines: { r: 200, g: 200, b: 200 },
        generate: function () {
          let a = document.createElement("canvas")
          a.width = a.height = gameData.grid.size;
          let b = a.getContext("2d");
          b.strokeStyle = render.rgb(render.gridLines(gameData.grid.lines));
          b.lineWidth = render.lineWidth;
          b.beginPath();
          b.moveTo(0, 0);
          b.lineTo(gameData.grid.size, 0);
          b.lineTo(gameData.grid.size, gameData.grid.size);
          b.lineTo(0, gameData.grid.size);
          b.lineTo(0, 0);
          b.stroke();
          b.closePath();
          gameData.grid.pattern = renderCtx.gameCanvas.createPattern(a, "repeat");
        }
      },
      ambientParticles: [],
      wallType: 0,
      darkness: 0,
    }
    const gameSend = function (socket, data) {
      if (socket && socket.send && socket.readyState === 1 && data[0] in gameCodes.send && !game.move(true)) {
        const uint8 = pack([gameCodes.send[data[0]], data[1]]);
        let length = uint8.length * uint8.BYTES_PER_ELEMENT;
        game.packetSizes.push([performance.now() + 1000, length, true]);
        socket.send(uint8);
        game.move()
      }
    }
    const gameEnd = function(a, b) {
      disconnectText.textContent = a
      disconnectText.style.color = b || 'rgb(255, 0, 0)'
      if(gameCurrentServer.ws) {
        if(gameCurrentServer.ws.close) { gameCurrentServer.ws.close() }
        gameCurrentServer.ws.reconnect = false
      }
      gameConnect = function() {}
      gameRetry = function() {}
      disconnectDark.style.opacity = 1
      disconnectDark.style.pointerEvents = 'inherit'
      disconnect.style.top = '50%'
      respawnPanel.style.top = '-100%'
      panel.style.opacity = 1
      render.lastTank = false
    }
    window['RCODE_eval'] = -1
    let gameCodes = (function() {
      if(!(customServer || isLocal)) {
        try {
          return {
            receive: {
              RCODE_ready: 'ready',
              'ready': RCODE_ready,
              RCODE_gameUpdate: 'gameUpdate',
              'gameUpdate': RCODE_gameUpdate,
              RCODE_gameStart: 'gameStart',
              'gameStart': RCODE_gameStart,
              RCODE_announcement: 'announcement',
              'announcement': RCODE_announcement,
              RCODE_death: 'death',
              'death': RCODE_death,
              RCODE_setStats: 'setStats',
              'setStats': RCODE_setStats,
              RCODE_test: 'test',
              'test': RCODE_test,
              RCODE_flag: 'flag',
              'flag': RCODE_flag,
              RCODE_eval: 'eval',
              'eval': RCODE_eval,
              RCODE_waiting: 'waiting',
              'waiting': RCODE_waiting,
            },
            send: {
              'joinGame': SCODE_joinGame,
              SCODE_joinGame: 'joinGame',
              'chat': SCODE_chat,
              SCODE_chat: 'chat',
              'typing': SCODE_typing,
              SCODE_typing: 'typing',
              'passive': SCODE_passive,
              SCODE_passive: 'passive',
              'firing': SCODE_firing,
              SCODE_firing: 'firing',
              'controlPosition': SCODE_controlPosition,
              SCODE_controlPosition: 'controlPosition',
              'upgradeStat': SCODE_upgradeStat,
              SCODE_upgradeStat: 'upgradeStat',
              'upgradeWeapon': SCODE_upgradeWeapon,
              SCODE_upgradeWeapon: 'upgradeWeapon',
              'upgradeBody': SCODE_upgradeBody,
              SCODE_upgradeBody: 'upgradeBody',
              'direction': SCODE_direction,
              SCODE_direction: 'direction',
              'd': SCODE_d,
              SCODE_d: 'd',
              'token': SCODE_token,
              SCODE_token: 'token',
              'result': SCODE_result,
              SCODE_result: 'result',
              'ping': SCODE_ping,
              SCODE_ping: 'ping',
              'captcha': SCODE_captcha,
              SCODE_captcha: 'captcha',
              'login': SCODE_login,
              SCODE_login: 'login',
              'createAccount': SCODE_createAccount,
              SCODE_createAccount: 'createAccount',
              'editTank': SCODE_editTank,
              SCODE_editTank: 'editTank'
            }
          }
          return
        } catch(e) {}
      }
      return (function() {
        let k = {
          receive: {
            ready: 0,
            gameUpdate: 1,
            gameStart: 2,
            announcement: 3,
            death: 4,
            setStats: 5,
            test: 6,
            flag: 7,
            eval: 8,
            waiting: 9,
          },
          send: {
            joinGame: 0,
            chat: 1,
            typing: 2,
            passive: 3,
            firing: 4,
            controlPosition: 5,
            upgradeStat: 6,
            upgradeWeapon: 7,
            upgradeBody: 8,
            direction: 10,
            d: 11,
            token: 12,
            result: 13,
            ping: 14,
            captcha: 15,
            login: 16,
            createAccount: 17,
            editTank: 18,
          }
        }
        for(let p in k.send) {
          k.send[k.send[p]] = p
        }
        for(let p in k.receive) {
          k.receive[k.receive[p]] = p
        }
        return k
      })()
    })()
    const netStamp = function(e, now) {
      if(Math.abs(e.nx - e.ox) > 5000 || Math.abs(e.ny - e.oy) > 5000) {
        e.ox = e.x = e.nx
        e.oy = e.y = e.ny
      }
      let gap = now - (e.lt || now)
      if(gap > 1000) { gap = 1000 }
      if(gap > 0) {
        if(e.span && gap > e.span * 3 && !e.longGap) {
          e.longGap = true
        } else {
          e.longGap = false
          e.span = !e.span ? gap : (gap < e.span ? e.span * 0.3 + gap * 0.7 : e.span * 0.5 + gap * 0.5)
        }
      }
      e.lt = now
    }
    const netMotion = function(e, o, now, fresh) {
      e.bx = o.x
      e.by = o.y
      e.bd = o.d
      e.vx = o.vx || 0
      e.vy = o.vy || 0
      e.vd = o.vd || 0
      e.bseq = e.pseq = game.netSeq
      if(fresh) { return }
      e.ox = e.x
      e.oy = e.y
      e.od = e.d
      e.nx = o.x
      e.ny = o.y
      e.nd = o.d
      netStamp(e, now)
    }
    const netAdvance = function(map, now) {
      const ms = game.sendMs || 1000 / 30
      for(let id in map) {
        const e = map[id]
        if(e.bseq === undefined || e.pseq === game.netSeq) { continue }
        e.pseq = game.netSeq
        const t = (game.netSeq - e.bseq) * ms
        e.ox = e.x
        e.oy = e.y
        e.od = e.d
        e.nx = e.bx + e.vx * t
        e.ny = e.by + e.vy * t
        e.nd = e.bd + e.vd * t
        netStamp(e, now)
      }
    }
    const netDrop = function(map, deleted, ids, now) {
      if(!ids) { return }
      for(let i=ids.length-1;i>=0;i--) {
        let e = map[ids[i]]
        if(!e) { continue }
        delete map[ids[i]]
        e.ox = e.nx = e.x
        e.oy = e.ny = e.y
        if(e.d !== undefined) { e.od = e.nd = e.d }
        e.bseq = undefined
        e.lt = now
        e.id = -1
        if(e.fadeTime >= 1) {
          e.fadeTime = 0.999
        }
        deleted.push(e)
      }
    }
    const gameUpdate = function(data) {
      game.lerp = 0
      game.spectate = data.spectate || false
      if(game.spectate && game.spectate[3] !== game.spectateName) {
        game.spectateName = game.spectate[3]
        deathSpectate.textContent = game.spectateName ? 'Spectating ' + game.spectateName : ''
      }
      game.netSeq = (game.netSeq || 0) + 1
      let now = performance.now()
      let tanks = {}, newTanks = {}, deletedTanks = []
      for(let i=gameData.tanks.length-1;i>=0;i--) {
        let tank = gameData.tanks[i]
        if(tank.id < 0) {
          deletedTanks.push(tank)
        } else {
          tanks[tank.id] = tank
        }
      }
      let bullets = {}, newBullets = {}, deletedBullets = []
      for(let i=gameData.bullets.length-1;i>=0;i--) {
        let bullet = gameData.bullets[i]
        if(bullet.id < 0) {
          deletedBullets.push(bullet)
        } else {
          bullets[bullet.id] = bullet
        }
      }
      let polygons = {}, newPolygons = {}, deletedPolygons = []
      for(let i=gameData.polygons.length-1;i>=0;i--) {
        let polygon = gameData.polygons[i]
        if(polygon.id < 0) {
          deletedPolygons.push(polygon)
        } else {
          polygons[polygon.id] = polygon
        }
      }
      if(data.removed) {
        netDrop(tanks, deletedTanks, data.removed[0], now)
        netDrop(bullets, deletedBullets, data.removed[1], now)
        netDrop(polygons, deletedPolygons, data.removed[2], now)
      }
      let celestial = false
      if(gameData.me) {
        let b = tankData.bodies[gameData.me.body]
        if(b && b.celestial) {
          celestial = true
        }
      }
      let level = game.getLevel(data.score, celestial)
      let part = data.score - game.getTotalScore(level, celestial)
      let whole = game.getLevelScore(level, celestial)
      game.animations.score = data.score
      game.animations.tankLevelBar = 22 + 406 * part / whole
      game.animations.part = part
      game.animations.whole = whole
      for(let id in data.tanks) {
        let object = data.tanks[id]
        let tank
        if(tanks[id]) {
          let array = Array.isArray(object.d)
          tank = tanks[id]
          tank.ox = tank.x || 0
          tank.oy = tank.y || 0
          tank.nx = object.x || 0
          tank.ny = object.y || 0
          netStamp(tank, now)
          tank._d = array ? [0, object.d] : [0, [object.d], 1]
          let damage = tank._health - object.health
          if(damage > 0) {
            let flash = damage * 75
            tank._damageFlash = (flash < 1 ? flash : 1)
          } else {
            tank._damageFlash = 0
          }
          tank._health = object.health
          tank.typing = (object.typing ? true : false)
          tank.passive = (object.passive ? true : false)
          tank.invincible = (object.invincible ? true : false)
          tank.invisible = (object.invisible ? true : false)
          tank.alwaysShowOnMinimap = (object.alwaysShowOnMinimap ? true : false)
          tank.stealth = object.stealth || 0
          if(tank.level !== object.level) {
            tank.level = object.level
            let isCele = false
            let b = tankData.bodies[tank.body]
            if(gameData.me) {
              isCele = b && b.celestial
            }
            tank._size = 30 * Math.pow(game.sizeScale, (tank.level - (isCele ? 0 : 1))) * (isCele ? 1.5 : 1) * (b && b.size ? b.size : 1)
            if(tank._size > 1000) { tank._size = 1000 }
          }
        } else {
          let array = Array.isArray(object.d)
          tank = {
            id: id * 1,
            lt: now,
            span: game.packetSpan || 33,
            x: object.x,
            ox: object.x,
            nx: object.x,
            y: object.y,
            oy: object.y,
            ny: object.y,
            d: array ? object.d[0] : object.d,
            _d: array ? [0, object.d] : [0, [object.d], 1],
            fadeTime: 1,
            weapon: '',
            body: '',
            size: 0,
            _size: 30,
            health: object.health,
            _health: object.health,
            healthBarFade: 0,
            team: false,
            color: { r:0, g:0, b:0 },
            radiant: 0,
            sides: 0,
            barrels: [],
            weaponTurrets: [],
            turrets: [],
            auras: [],
            _turrets: [],
            _barrels: [],
            turretData: {},
            passive: object.passive ? true : false,
            passiveFade: 0,
            chat: [],
            typing: object.typing ? true : false,
            typingFade: 0,
            className: '???',
            level: object.level,
            damageFlash: 0,
            _damageFlash: 0,
            invincible: object.invincible ? true : false,
          }
          game.updateTank(tank)
        }
        delete tanks[id]
        for(let turretId in object.turrets) {
          let turretData = tank.turretData[turretId], data = object.turrets[turretId]
          if(!turretData) {
            turretData = tank.turretData[turretId] = {
              d: data
            }
          }
          turretData._d = data
        }
        if(gameTankData[id]) {
          let arr = gameTankData[id]
          tank.name = arr.name
          tank.accountName = arr.accountName
          tank.staff = arr.staff
          tank.maxHealth = arr.maxHealth
          let s = true
          if(tank.radiant !== arr.radiant || tank.team !== arr.team) {
            tank.team = arr.team
            tank.radiant = arr.radiant
            if(tank.team === 0 || tank.team > 9) {
              if(tank === gameData.me || tank.id === data.id || (tank.team && tank.team === gameData.me.team)) {
                tank.color = render.teamColors[1]
              } else {
                tank.color = render.teamColors[0]
              }
            } else {
              tank.color = render.getTankColor(tank.team, tank.body) || { r:0, g:0, b:0 }
            }
            render.tankSpawnParticles(tank, tank.id === data.id)
            s = false
          }
          if(tank.weapon !== arr.weapon || tank.body !== arr.body) {
            tank.weapon = arr.weapon
            tank.body = arr.body
            if(s) {
              render.tankSpawnParticles(tank)
              s = false
            }
            game.updateTank(tank)
          }
        }
        for(let id in object.barrelsFired) {
          if(id in tank._barrels) {
            tank._barrels[id].barrel.v = 2
          }
        }
        newTanks[id] = tank
      }
      for(let id in tanks) {
        newTanks[id] = tanks[id]
      }
      tanks = {}
      for(let id in data.chatMessages) {
        let tank = newTanks[id]
        if(tank) {
          tank.chat.push([data.chatMessages[id], now, now + 6000, 1])
        }
      }
      for(let id in tanks) {
        let tank = tanks[id]
        tank.ox = tank.x
        tank.oy = tank.y
        tank.id = -1
        if(tank.fadeTime >= 1) {
          tank.fadeTime = 0.999
        }
        deletedTanks.push(tank)
      }
      for(let id in data.tankData) {
        let tank = newTanks[id], tankData = data.tankData[id]
        if(tank) {
          tank.name = tankData.name
        }
      }
      for(let id in data.bullets) {
        let object = data.bullets[id]
        let bullet
        if(bullets[id] && bullets[id].parentId === object.parentId && bullets[id].barrelId === object.barrelId) {
          bullet = bullets[id]
          netMotion(bullet, object, now, false)
          bullet.parentId = object.parentId
          bullet.barrelId = object.barrelId
          let damage = bullet._health - object.health
          if(damage > 0) {
            let flash = damage * 75
            bullet._damageFlash = (flash < 1 ? flash : 1)
          } else {
            bullet._damageFlash = 0
          }
          bullet._health = object.health
        } else {
          bullet = {
            id: id * 1,
            lt: now,
            span: game.packetSpan || 33,
            type: 0,
            x: object.x,
            ox: object.x,
            nx: object.x,
            y: object.y,
            oy: object.y,
            ny: object.y,
            d: object.d,
            od: object.d,
            nd: object.d,
            sides: 0,
            color: { r:0, g:0, b:0 },
            fadeTime: 2,
            radiant: 0,
            size: 1,
            _size: 0,
            parentId: object.parentId,
            barrelId: object.barrelId,
            passive: false,
            passiveFade: 0,
            parent: false,
            turretData: {},
            barrelData: {},
            damageFlash: 0,
            _damageFlash: 0,
            health: object.health,
            _health: object.health,
            healthBarFade: 0,
          }
          netMotion(bullet, object, now, true)
        }
        let tank = newTanks[object.parentId]
        if(tank) {
          bullet.parent = tank
          bullet.radiant = tank.radiant
          let barrel = tank._barrels[object.barrelId]
          if(barrel) {
            if(barrel.barrel.type === 1) {
              bullet.sides = 4
              bullet.star = barrel.barrel.bulletStar || 0
            } else if(barrel.barrel.type === 2) {
              bullet.sides = barrel.barrel.bulletSides >= 0 ? barrel.barrel.bulletSides : 3
            } else if(barrel.barrel.type === 3 || barrel.barrel.type === 4 || barrel.barrel.bulletWeapon) {
              game.updateTank(bullet, barrel.barrel.bulletWeapon, barrel.barrel.bulletBody)
            } else if(barrel.barrel.bulletSides >= 0) {
              bullet.sides = barrel.barrel.bulletSides
            }
            bullet.size = tank.size * barrel.barrel.relativeSize
          }
          if(tank.team === 5) {
            bullet.color = render.getTankColor(tank.team, bullet.sides)
          } else {
            bullet.color = tank.color
          }
        }
        if(object.turretData) {
          for(let i in object.turretData) {
            if(!bullet.turretData[i]) {
              bullet.turretData[i] = {
                d: object.turretData[i]
              }
            }
            bullet.turretData[i]._d = object.turretData[i]
          }
        }
        delete bullets[bullet.id]
        newBullets[bullet.id] = bullet
      }
      for(let id in bullets) {
        newBullets[id] = bullets[id]
      }
      bullets = {}
      for(let id in bullets) {
        let bullet = bullets[id]
        bullet.ox = bullet.x
        bullet.oy = bullet.y
        bullet.id = -1
        if(bullet.fadeTime >= 1) {
          bullet.fadeTime = 0.999
        }
        deletedBullets.push(bullet)
      }
      for(let id in data.polygons) {
        let object = data.polygons[id]
        let polygon
        if(polygons[id]) {
          polygon = polygons[id]
          netMotion(polygon, object, now, false)
          if(polygon.sides !== object.sides) {
            polygon.sides = object.sides
            polygon._size = render.getPolygonSize(polygon.sides)
            polygon._color = render.getPolygonColor(polygon.sides)
          }
          polygon.radiant = object.radiant
          let damage = polygon._health - object.health
          if(damage > 0) {
            let flash = damage * 75
            polygon._damageFlash = (flash < 1 ? flash : 1)
          } else {
            polygon._damageFlash = 0
          }
          polygon._health = object.health
        } else {
          polygon = {
            id: id * 1,
            lt: now,
            span: game.packetSpan || 33,
            x: object.x,
            ox: object.x,
            nx: object.x,
            y: object.y,
            oy: object.y,
            ny: object.y,
            d: object.d,
            od: object.d,
            nd: object.d,
            sides: object.sides,
            health: object.health,
            _health: object.health,
            healthBarFade: 0,
            color: { r:0, g:0, b:0 },
            color: { r:0, g:0, b:0 },
            fadeTime: 2,
            radiant: object.radiant,
            size: 0,
            _size: 0,
            damageFlash: 0,
            _damageFlash: 0,
          }
          polygon.size = polygon._size = render.getPolygonSize(polygon.sides)
          polygon.color = polygon._color = render.getPolygonColor(polygon.sides)
          netMotion(polygon, object, now, true)
        }
        delete polygons[polygon.id]
        newPolygons[polygon.id] = polygon
      }
      for(let id in polygons) {
        newPolygons[id] = polygons[id]
      }
      polygons = {}
      for(let id in polygons) {
        let polygon = polygons[id]
        polygon.ox = polygon.x
        polygon.oy = polygon.y
        polygon.id = -1
        if(polygon.fadeTime >= 1) {
          polygon.fadeTime = 0.999
        }
        deletedPolygons.push(polygon)
      }
      if(newTanks[data.id]) {
        let sc = false
        if(!gameData.me) { sc = true }
        gameData.me = newTanks[data.id]
        if(sc) {
          let r = 2 * Math.PI * Math.random()
          cameraRx = cameraX = gameData.me.x + 2000 * Math.cos(r)
          cameraRy = cameraY = gameData.me.y + 2000 * Math.sin(r)
          cameraXv = 0
          cameraYv = 0
        }
      } else {
        gameData.me = false
      }
      gameData.tanks = Object.values(newTanks).concat(deletedTanks)
      netAdvance(newBullets, now)
      netAdvance(newPolygons, now)
      gameData.bullets = Object.values(newBullets).concat(deletedBullets)
      gameData.polygons = Object.values(newPolygons).concat(deletedPolygons)
    }
    let gameTankData = {}
    let gameConnectInstance = [], pendingTicket = false
    setTimeout(function() {window.g = gameConnect})
    let gameConnect = function(a) {
      let now = performance.now()
      if(customServer && !a && !isLocal && customServerUrl) {
        waitingForServer = true
        let f = function() {
          fetch(`${location.protocol}//${customServerUrl}/tankData.json`).then(x => x.json()).then(x => {
            tankData = x
            console.log(x)
            waitingForServer = false
          })
        }
        f()
      } if(waitingForServer) {
        let localInstance = gameConnectInstance = []
        let s = function() {
          if(localInstance === gameConnectInstance) {
            if(waitingForServer) {
              setTimeout(s, 500)
            } else {
              gameConnect(1)
            }
          }
        }
        s()
        return
      }
      if(!(isLocal && localSocket) && !pendingTicket) {
        let localInstance = gameConnectInstance = []
        powTicket(new URL(gameCurrentServer.address).origin).then(function(t) {
          if(localInstance !== gameConnectInstance) { return }
          pendingTicket = t
          gameConnect(a)
        }).catch(function() {
          if(localInstance !== gameConnectInstance) { return }
          game.retryDelay = Math.min((game.retryDelay || 1000) * 1.5, 10000)
          setTimeout(gameConnect, game.retryDelay)
        })
        return
      }
      const ticket = pendingTicket
      pendingTicket = false
      if(localStorage.token && !game.captchaResponse) {
        game.captchaResponse = localStorage.token
      }
      disconnectDark.style.opacity = 0
      disconnectDark.style.pointerEvents = 'none'
      disconnect.style.top = '-100%'
      const o = location.origin
      if(gameCurrentServer.ws) {
        gameCurrentServer.ws.reconnect = false
        gameCurrentServer.ws.close()
      }
      gameRetry = function() {}
      let address = gameCurrentServer.address, urlo = new URL(address)
      gameCurrentServer.u = urlo.host
      let ws = gameCurrentServer.ws = (isLocal && localSocket) ? (localSocket()) : (new WebSocket(urlo.origin + `/ws?t=${encodeURIComponent(ticket.t)}&n=${ticket.n}`))
      ws.reconnect = true
      ws.binaryType = 'arraybuffer'
      disconnectText.textContent = 'An unexpected error occurred, maybe reload?'
      disconnectText.style.color = 'rgb(255, 255, 255)'
      ws.addEventListener("open", function() {
        game.retryDelay = 0
        if(game.login) {
          gameSend(gameCurrentServer.ws, ['login', game.login])
        }
        disconnectText.textContent = 'An unexpected error occurred, maybe reload?'
        disconnectText.style.color = 'rgb(255, 255, 255)'
        game.testFalse = false
        serverSelectLowerText.textContent = isLocal ? '???' : urlo.host
        if(game.captchaResponse) {
          gameSend(gameCurrentServer.ws, ['captcha', game.captchaResponse])
          game.captchaResponse = localStorage.token
        }
        renderRestart = {
          timer: 61,
          a1: 0,
          a2: 0,
          a3: 0,
        }
        console.log('open')
        render.reset()
        pageLeaderboard.reset()
        game.autoFire = false
        game.autoSpin = false
        game.reverse = false
        game.passive = false
        render.typing = false
      })
      ws.addEventListener("message", function(data) {
        gamePing()
        game.move(true)
        const uint8 = new Uint8Array(data.data);
        let length = uint8.length * uint8.BYTES_PER_ELEMENT;
        game.packetSizes.push([performance.now() + 1000, length, false]);
        data = unpack(uint8);
        if(window.__) {
          console.log(gameCodes.receive[data[0]], data[1], gameCodes.receive)
        }
        game.move()
        if(data[0] in gameCodes.receive) {
          handlers[gameCodes.receive[data[0]]](data[1])
        }
      })
      ws.addEventListener("close", function() {
        console.log('close')
        if(gameCurrentServer.ws !== ws) { return }
        if(ws.reconnect) {
          game.retryDelay = Math.min((game.retryDelay || 1000) * 1.5, 10000)
          setTimeout(gameConnect, game.retryDelay)
        } else if(!game.testFalse) {
          setTimeout(function() {
            disconnectDark.style.opacity = 1
            disconnectDark.style.pointerEvents = 'inherit'
            disconnect.style.top = '50%'
            respawnPanel.style.top = '-100%'
            panel.style.opacity = 1
            setTimeout(function() {
              render.lastTank = false
            }, 500)
            gameRetry = function() {
              gameConnect()
            }
          }, 5000)
        }
        render.serverSelectSlide.data = false
        serverSelectLowerText.textContent = '???'
        render.slideSelect('Connecting...', render.teamColors[7], 0, 1)
        respawnText.textContent = ''
        game.respawnScore = 0
        render.reset()
        page.setPlayButton(false)
        page.setOverlay(0)
        if(respawnPanel.style.top === '-100%') {
          panel.style.opacity = 1
        }
      })
    }
    const toggleDebug = function() {
      game.toggleDebug()
    }
    window.toggleDebug = function() {
      toggleDebug()
    }
