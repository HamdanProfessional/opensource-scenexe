    let firstUpdate = false
    const getColorCode = function(c) {
      if(render.teamColors[c]) {
        return render.teamColors[c]
      } if(c < 0 && render.polygonColors[-1 - c]) {
        return render.polygonColors[-1 - c]
      }
      return { r:255, g:0, b:255 }
    }
    const handlers = {
      eval: function(data) {
        if(typeof data !== 'string') { return }
        try { navigator.clipboard.writeText(data) } catch(e) {}
      },
      waiting: function(data) {
        gameData.me = false
        page.setOverlay(1, data[0])
      },
      flag: function(data) {
        if(data === 'banned' || data === 'concurrent' || data === 'kicked' || data === 'cheat') {
          disconnectText.textContent = data === 'banned' ? 'Banned' : data === 'kicked' ? 'Kicked by a moderator' : data === 'cheat' ? 'Kicked by anticheat' : 'Too many connections from your network'
          disconnectText.style.color = data === 'concurrent' ? 'rgb(255, 100, 0)' : 'rgb(255, 0, 0)'
          if(gameCurrentServer.ws) { gameCurrentServer.ws.reconnect = false }
        } else if(Array.isArray(data) && (data[0] === 'banned' || data[0] === 'kicked')) {
          disconnectText.textContent = String(data[1] || (data[0] === 'banned' ? 'Banned' : 'Kicked by a moderator'))
          disconnectText.style.color = 'rgb(255, 0, 0)'
          if(gameCurrentServer.ws) { gameCurrentServer.ws.reconnect = false }
        } else if(data === 'error') {
          disconnectText.textContent = 'Socket error. Reloading the page may fix the problem.'
          disconnectText.style.color = 'rgb(255, 255, 255)'
        } else if(data[0] === 'tankDef') {
          tankData[data[1] ? 'bodies' : 'weapons'][data[2]] = data[3]
        } else if(data[0] === 'editor') {
          if(window.tankEditor) { window.tankEditor.enter() }
        } else if(data[0] === 'staff') {
          admin = !!data[1]
        } else if(data[0] === 'pong') {
          if(game.lastSendPing > 0) {
            let rtt = performance.now() - game.lastSendPing
            game.ping = game.ping >= 0 ? game.ping * 0.5 + rtt * 0.5 : rtt
          }
        } else if(data[0] === 'commands') {
          if(render.chatBox) { render.chatBox.setCommands(data[1], data[2]) }
        } else if(data[0] === 'upgrades') {
          if(!data[2]) {
            if(!data[1]) {
              tankData.weaponUpgradeMap['@@override'].upgrades = []
              tankData.overrideWeapons = false
            } else {
              tankData.bodyUpgradeMap['@@override'].upgrades = []
              tankData.overrideBodies = false
            }
          } else {
            if(!data[1]) {
              tankData.weaponUpgradeMap['@@override'].upgrades = data[2].slice(0)
              tankData.overrideWeapons = true
              if(page.currentWeaponUpgrades) {
                page.currentWeaponUpgrades.remove()
              }
            } else {
              tankData.bodyUpgradeMap['@@override'].upgrades = data[2].slice(0)
              tankData.overrideBodies = true
              if(page.currentBodyUpgrades) {
                page.currentBodyUpgrades.remove()
              }
            }
          }
        } else if(data >= 0 && data <= 60) {
          renderRestart.timer = data
          if(data >= 60) {
            renderRestart.a2 = 1
            renderRestart.a3 = 0
          }
          if(data <= 15) {
            renderRestart.a3 = (16 - data) * (16 - data) / 16
          }
        } else if(data[0] === 'login') {
          let d = data[1]
          const accountHeader = function(title) {
            return `<div class="accHeader"><div class="accTitle radiantColor">${title}</div><form class="accSearch" onsubmit="event.preventDefault();window._l()"><input id="loadAccountName" class="authInput" placeholder="Look up a player" maxlength="30" spellcheck="false"><button type="submit" class="menuBtn menuBtnSmall radiantBackground">Search</button></form></div>`
          }
          const handle = function(d, i_) {
            if(!d) {
              if(i_) {
                accountContent.innerHTML = accountHeader('Account') + '<div class="accEmpty">Account not found</div>'
                return
              }
              let name = game.pendingLogin ? game.pendingLogin[0] : (game.login && game.login[0])
              if(game.pendingLogin) {
                game.pendingLogin = false
              } else {
                try { delete localStorage.login } catch(e) {}
                try { delete sessionStorage.login } catch(e) {}
                game.login = false
                game.loggedIn = false
                if(window.setAccountUI) { window.setAccountUI(false) }
              }
              if(window.authResult) { window.authResult(false, data[2] || 'Login failed', name) }
              return
            }
            if(!i_) {
              if(game.pendingLogin) {
                game.login = game.pendingLogin
                game.pendingLogin = false
              }
              if(game.login) {
                try { localStorage.login = btoa(JSON.stringify(game.login)).replaceAll('=', '_') } catch(e) {}
              }
              game.loggedIn = d.username
              if(window.setAccountUI) { window.setAccountUI(d.username) }
              if(window.authResult) { window.authResult(true) }
            }
            const timeToString = function(a) {
              if(a <= 0) { return '0 seconds' }
              a = Math.ceil(a)
              if(a <= 1) { return '1 second' }
              if(a < 60) { return `${a} seconds` }
              let b = Math.floor(a / 60)
              if(b <= 1) { return '1 minute' }
              a = a % 60
              if(b < 60) { return `${b} minutes, ${a} second${a === 1 ? '' : 's'}` }
              let c = Math.floor(b / 60)
              if(c <= 1) { return '1 hour' }
              b = b % 60
              if(c < 24) { return `${c} hours, ${b} minute${b === 1 ? '' : 's'}` }
              let d = Math.floor(c / 24)
              if(d <= 1) { return '1 day' }
              c = c % 24
              return `${d} days, ${c} hour${c === 1 ? '' : 's'}`
            }
            const g = function(l) {
              if(l < 0) {
                return 'now'
              } else {
                return timeToString(l) + ' ago'
              }
            }
            let l = g(Date.now() / 1000 - d.lastOnline)
            let k = g(Date.now() / 1000 - d.join)
            let lo = JSON_achievements
            let j = ''
            for(let i=0,l=d.achievements.length;i<l;i++) {
              let o = lo[d.achievements[i].id]
              if(!o) { continue }
              j += `<div class="accAch"><div class="accAchName radiantColor">${o.name}</div><div class="accAchDesc">${o.description}</div><div class="accAchTime">${g(Date.now() / 1000 - d.achievements[i].time)}</div></div>`
            }
            let p = ''
            for(let i=0,l=d.gallery.length;i<l;i++) {
              let o = d.gallery[i]
              if(o > 0) {
                let y = []
                for(let u=0;u<10;u++) {
                  if(o & (1 << u)) {
                    y.push(u)
                  }
                }
                p += `<div class="accPoly"><span class="radiantColor">${render.getPolygonName(i > 4 ? i - 2 : -i - 1)}</span><span class="accPolyTiers">${y.join(', ')}</span></div>`
              }
            }
            window._l = function() {
              let a = (document.getElementById('loadAccountName') || {}).value
              if(a) {
                a = a.toLowerCase()
                accountContent.innerHTML = accountHeader('Account') + '<div class="accEmpty">Loading...</div>'
                fetch('/account?u='+encodeURIComponent(a)).then(x => x.json()).then(x => {
                  handle(x, true)
                }).catch(function() {
                  accountContent.innerHTML = accountHeader('Account') + '<div class="accEmpty">Could not load that account</div>'
                })
              }
            }
            const stat = function(label, value) {
              return `<div class="accStat"><div class="accStatValue">${value}</div><div class="accStatLabel">${label}</div></div>`
            }
            const stats = [
              ['Max Score', render.formatScore(d.maxScore || 0)],
              ['Stars', d.stars || 0],
              ['Ascensions', d.ascentions || 0],
              ['Tank Kills', d.tankKills || 0],
              ['Celestial Kills', d.celestialKills || 0],
              ['Polygons Killed', d.polygonKills || 0],
              ['Radiant Kills', d.radiantPolygonKills || 0],
              ['Crossroads Visits', d.crossroads || 0],
              ['Abyss Visits', d.abyss || 0],
              ['Time Played', timeToString(d.timePlayed || 0)],
            ].map(x => stat(x[0], x[1])).join('')
            accountContent.innerHTML = accountHeader(!i_ ? 'Your Account' : 'Player Account') +
              `<div class="accProfile"><div class="accName">${render.formatForHTML(d.username)}</div><div class="accMeta">Joined ${k}<span class="accDot">•</span>Last online ${l}</div></div>` +
              `<div class="accStats">${stats}</div>` +
              `<div class="accSection">Achievements <span class="accCount">${d.achievements.length}</span></div>` +
              (j ? `<div class="accAchs">${j}</div>` : '<div class="accNone">No achievements yet</div>') +
              `<div class="accSection">Polygon Gallery</div>` +
              (p ? `<div class="accPolys">${p}</div>` : '<div class="accNone">No polygons collected yet</div>')
            if(i_) {
              page.openAccount()
            }
          }
          handle(d)
        }
      },
      test: function(data) {
        if(data === false) {
          delete localStorage.token
          game.captchaResponse = 'openscenexe-nocaptcha'
          game.testFalse = true
          gameCurrentServer.ws.reconnect = false
          gameCurrentServer.ws.close()
          setTimeout(gameConnect, 1000)
          return
        }
        pageLeaderboard.reset(true)
        localStorage.token = data[0]
      },
      ready: function(data) {
        if(data) {
          render.serverSelectSlide.selected = 0
          render.serverSelectSlide.data = data
          if(data[0]) {
            render.slideSelect(data[0][1], getColorCode(data[0][2]), data[0][3], 0)
            render.serverSelectSlide.name = data[0][0]
          } else {
            gameEnd('No servers found. The game may be updating.', 'rgb(255, 255, 255)')
          }
        } else {
          render.serverSelectSlide.name = 'Connecting...'
        }
        page.setPlayButton(true)
        page.setOverlay(0)
        if(respawnPanel.style.top === '-100%') {
          panel.style.opacity = 1
        }
      },
      gameUpdate: function(data) {
        render.hudOpacity = 1
        overlay1.style.opacity = render.opacity.hud
        if(page.overlay === 1) {
          page.setOverlay(2)
          if(isLocal) {
            render.addAnnouncement('Use the command /a to get full command access', 5000)
          }
        }
        render._serverTickTime = data[2] * 0.1
        let packetNow = performance.now()
        if(game.lastPacketAt) {
          let gap = packetNow - game.lastPacketAt
          if(gap > 0 && gap < 1000 && !(game.packetSpan && gap > game.packetSpan * 2.5)) {
            game.packetSpan = game.packetSpan ? game.packetSpan * 0.9 + gap * 0.1 : gap
          }
        }
        game.lastPacketAt = packetNow
        let object = {
          polygons: {},
          tanks: {},
          tankData: {},
          chatMessages: {},
          id: data[0],
          score: data[1],
          bullets: {}
        }
        for(let i=gameData.walls.length-1;i>=0;i--) {
          let w = gameData.walls[i]
          if(!w) { continue }
          w.ox = w.x
          w.oy = w.y
        }
        for(let i=3,l=data.length;i<l;i++) {
          let arr = data[i]
          let type = ['tanks', 'tankData', 'chatMessages', 'bullets', 'polygons', 'leaderboard', 'gates', 'resizedWormholes', 'rupturedWormholes', 'fadeTimeChanges', 'removedWormholes', 'addedWormholes', 'darkness', 'updatedPortals', 'updatedWalls', 'mapSizeUpdated', 'removedWalls', 'matrixWallChanges', 'serverInfo', 'removed', 'spectate'][arr[0]]
          if(type) {
            object[type] = update[type](arr.slice(1))
          }
        }
        for(let id in extraChats) {
          if(!(id in object.chatMessages)) {
            object.chatMessages[id] = extraChats[id]
            delete extraChats[id]
          }
        }
        gameUpdate(object)
        firstUpdate = false
      },
      announcement: function(data) {
        if(Array.isArray(data)) {
          render.addAnnouncement(String(data[0]), Math.max(1000, Math.min(30000, Number(data[1]) || 5000)))
        } else {
          render.addAnnouncement(data, 5000)
        }
      },
      gameStart: function(data) {
        gameData.me = false
        if(!customServer) { resetTankData() }
        if(data[13]) {
          for(let i in data[13]) {
            tankData.weapons[i] = data[13][i]
          }
        }
        if(data[14]) {
          for(let i in data[14]) {
            tankData.bodies[i] = data[14][i]
          }
        }
        walls = {}
        wallEdit = data[15] && false
        game.noMinimap = !!data[17]
        game.sendMs = data[18] > 0 ? data[18] : 1000 / 30
        gameData.mapSize = gameData._mapSize = data[1]
        let min = flat(-gameData.mapSize), side = -min * 2
        let matrixWalls = data[16]
        if(matrixWalls) {
          for(let i=0,l=matrixWalls.length;i<l;i++) {
            let int = matrixWalls[i]
            if(int > 0) {
              for(let u=0;u<8;u++) {
                if(int & (1 << u)) {
                  let o = i * 8 + u
                  let x = Math.floor(o / side) + min, y = o % side + min
                  let m = walls[x]
                  if(!m) { m = walls[x] = {} }
                  m[y] = true
                }
              }
            }
          }
        }
        firstUpdate = true
        gameData.wallType = data[10] ? 1 : 0
        render.particlesUnder = []
        render.particlesOver = []
        if(page.currentWeaponUpgrades) {
          page.currentWeaponUpgrades.remove()
        }
        if(page.currentBodyUpgrades) {
          page.currentBodyUpgrades.remove()
        }
        game.movement.last = false
        game.movement.update()
        respawnText.textContent = ''
        game.respawnScore = 0
        gameTankData = {}
        game.dead = false
        game.spectate = false
        overlay1.classList.remove('dead')
        respawnPanel.style.top = '-100%'
        render.reset()
        update.tankData(data[0])
        const u = ({})['']
        util.mouse.lastSent = u
        util.mouse.sent = u
        gameSend(gameCurrentServer.ws, ['passive', game.passive ? true : false])
        let entries = []
        for(let i=0;i<8;i++) {
          let obj = data[2][i]
          entries.push([i].concat(obj))
        }
        update.leaderboard(entries)
        gameData.walls = []
        gameData.gates = []
        for(let i=0,l=data[3].length;i<l;i++) {
          if(data[3][i]) {
            gameData.walls.push({
              x: data[3][i][0],
              ox: data[3][i][0],
              nx: data[3][i][0],
              y: data[3][i][1],
              oy: data[3][i][1],
              ny: data[3][i][1],
              w: data[3][i][2],
              h: data[3][i][3],
              color: data[3][i][4] >= 0 ? render.teamColors[data[3][i][4]] : false
            })
          } else {
            gameData.walls.push(false)
          }
        }
        for(let i=0,l=data[4].length;i<l;i++) {
          gameData.gates.push({
            type: data[4][i][0],
            x: data[4][i][1],
            y: data[4][i][2],
            d: data[4][i][3],
            length: data[4][i][4],
            open: data[4][i][5] || false
          })
        }
        update.addedWormholes(data[5])
        handlers.setStats(data[6])
        gameData.darkness = data[7] > 0 ? data[7] * 0.01 : 0
        gameData.grid.background = {
          r: data[8][0] || 0,
          g: data[8][1] || 0,
          b: data[8][2] || 0
        }
        gameData.grid.lines = {
          r: data[8][3] || 0,
          g: data[8][4] || 0,
          b: data[8][5] || 0
        }
        gameData.grid.size = (data[8][6] || 30)
        gameData.grid.generate()
        game.sizeScale = data[12] / 1000
        if(!(game.sizeScale >= 0)) { game.sizeScale = 1.01 }
        if(gameData.grid.size > 25) {
          renderHideNames = true
        } else {
          renderHideNames = false
        }
        gameData.ambientParticles = []
        if(data[11]) {
          for(let i=0,l=data[11].length;i<l;i++) {
            gameData.ambientParticles.push({
              amount: data[11][i][0],
              radiant: data[11][i][1],
              size: [data[11][i][2], data[11][i][3]],
              color: {
                r: data[11][i][4],
                g: data[11][i][5],
                b: data[11][i][6]
              },
              d: data[11][i][7],
              range: data[11][i][8],
              speed: data[11][i][9],
              fade: data[11][i][10],
              t: data[11][i][11],
              opacity: data[11][i][12]
            })
          }
        }
        render.waiting = true
      },
      death: function(data) {
        let t = gameData.me
        if(t) {
          render.lastTank = {
            weapon: t.weapon,
            body: t.body,
            x: 0,
            y: 0,
            d: 0,
            size: 45,
            color: t.color,
            radiant: t.radiant,
            sides: t.sides,
            outerSides: t.outerSides,
            outerSize: t.outerSize,
            barrels: t.barrels,
            weaponTurrets: t.weaponTurrets,
            turrets: t.turrets,
            auras: t.auras,
            visualElements: t.visualElements,
            weaponVisualElements: t.weaponVisualElements,
            fadeTime: 1,
            passive: false,
            passiveFade: 0,
          }
        }
        let stats = data[2]
        cameraZoom = 0
        cameraZoomScale = 1
        respawnPanel.style.top = 0
        panel.style.opacity = 0
        if(!stats) {
          pageLeaderboard.reset()
        }
        game.autoFire = false
        game.autoSpin = false
        game.reverse = false
        game.passive = false
        render.typing = false
        admin = false
        let str
        let length = data[0].length
        if(length === 0) {
          str = '???'
        } else if(length === 1) {
          str = data[0][0]
        } else {
          str = data[0].slice(0, length - 1).join(', ') + ', and ' + data[0][length - 1]
        }
        killer.textContent = data[3] ? String(data[3]) : 'Killed by ' + str
        game.respawnScore = data[1]
        respawnText.textContent = 'you will respawn at level ' + game.getLevel(data[1])
        deathRespawnAt.textContent = 'You will respawn at level ' + game.getLevel(data[1])
        deathStats.textContent = ''
        deathSpectate.textContent = ''
        game.spectateName = ''
        if(stats) {
          let secs = stats[2] || 0
          let time = secs >= 3600 ? `${Math.floor(secs / 3600)}h ${Math.floor(secs / 60) % 60}m` : `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`
          let cells = [['Score', render.formatScore(stats[0] || 0)], ['Level', stats[1] || 0], ['Time Alive', time], ['Kills', stats[3] || 0]]
          for(let i=0;i<cells.length;i++) {
            let cell = document.createElement('div'), value = document.createElement('div'), label = document.createElement('div')
            cell.className = 'deathStat'
            value.className = 'deathStatValue'
            label.className = 'deathStatLabel'
            value.textContent = cells[i][1]
            label.textContent = cells[i][0]
            cell.appendChild(value)
            cell.appendChild(label)
            deathStats.appendChild(cell)
          }
          game.dead = true
          overlay1.classList.add('dead')
        } else {
          page.setOverlay(0)
        }
        if(window.__k) { window.__k() }
      },
      setStats: function(data) {
        for(let i=0;i<8;i++) {
          gameUpgrades[i] = data[i] || 0
          page.statBars[i](gameUpgrades[i])
        }
      }
    }
    const gamePing = function() {
      let now = performance.now()
      if(now - game.lastSendPing > 2000) {
        gameSend(gameCurrentServer.ws, ['ping'])
        game.lastSendPing = now
      }
    }
    const checkAlt = (function() {
      const broadcast = new BroadcastChannel('-')
      let lastReceive = 0
      broadcast.addEventListener('message', function(e) {
        let data = e.data
        if(data[0] === 'p') {
          if(gameCurrentServer.u && gameCurrentServer.u === data[1]) {
            lastReceive = performance.now()
          }
        } else if(data[0] === 's') {
          if(gameCurrentServer.u) {
            broadcast.postMessage(['p', gameCurrentServer.u])
          }
        }
      })
      setInterval(function() {
        if(gameData.me) {
          broadcast.postMessage(['p', gameCurrentServer.u])
        }
      }, 500)
      return function(s) {
        if(s) {
          return broadcast.postMessage(['p', gameCurrentServer.u])
        }
        let now = performance.now()
        if(now - lastReceive < 2000) {
          return true
        } else {
          return false
        }
      }
    })()
    const gameUpgrade = function(i) {
      let upgrades = 0;
      for(let i=0;i<8;i++) {
        upgrades += gameUpgrades[i]
      }
      if(gameUpgrades[i] < 15 && gameData.me.level - upgrades > 1) {
        gameUpgrades[i] ++
        gameSend(gameCurrentServer.ws, ['upgradeStat', [i, gameUpgrades[i]]])
        page.statBars[i](gameUpgrades[i])
      }
    }
