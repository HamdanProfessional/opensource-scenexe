    const pageCreateEntry = function() {
      let entry = {
        div: document.createElement('div'),
        text: document.createElement('div'),
        bar: document.createElement('div'),
        slide: document.createElement('div'),

        canvas: document.createElement('canvas'),
        ctx: false,
        transform: false
      }
      entry.div.className = 'leaderboardEntry'
      entry.div.style.left = '300px'
      entry.bar.className = 'leaderboardBar'
      entry.slide.className = 'leaderboardSlide'
      entry.bar.appendChild(entry.slide)
      entry.text.className = 'leaderboardText'
      entry.canvas.className = 'leaderboardCanvas'
      entry.canvas.width = entry.canvas.height = 80
      entry.ctx = entry.canvas.getContext('2d')
      entry.ctx.translate(40, 40)
      entry.transform = entry.ctx.getTransform()
      leaderboardEntries.appendChild(entry.div)
      entry.div.appendChild(entry.canvas)
      entry.div.appendChild(entry.bar)
      entry.div.appendChild(entry.text)
      return entry
    }

    const radiantLevel = function(entry) {
      if((renderHideNames && !admin) || entry.id < 0) { return 0 }
      const r = Math.floor(entry.radiant || 0)
      return r < 1 ? 0 : r > 5 ? 5 : r
    }
    const radiantSparkles = function(level, color, size, seed) {
      const n = level * 2, t = render.now / 1000
      ctx.fillStyle = render.rgb(render.averageColors(color, { r:255, g:255, b:255 }, 0.6))
      for(let i = 0; i < n; i++) {
        const a = t * (0.6 + level * 0.15) * (i % 2 ? 1 : -0.7) + i * 2 * Math.PI / n + seed
        const d = size * (1.25 + 0.25 * Math.sin(t * 1.3 + i * 1.7))
        const s = (2 + level * 0.6) * Math.max(0, Math.sin(t * 3 + i * 2.1 + seed))
        if(s < 0.3) { continue }
        const x = Math.cos(a) * d, y = Math.sin(a) * d
        ctx.beginPath()
        ctx.moveTo(x, y - s * 2)
        ctx.quadraticCurveTo(x, y, x + s * 2, y)
        ctx.quadraticCurveTo(x, y, x, y + s * 2)
        ctx.quadraticCurveTo(x, y, x - s * 2, y)
        ctx.quadraticCurveTo(x, y, x, y - s * 2)
        ctx.fill()
      }
    }
    const radiantIcon = function(level, data) {
      const t = ctx.getTransform()
      render.drawRadiantShapes({ x: 0, y: 0, d: data.d || 0, radiant: level, color: data.color, size: data.size,
        sides: data.sides, outerSides: data.outerSides, outerSize: data.outerSize, fadeTime: 1 }, !!data.tank, !!data.tank)
      ctx.setTransform(t)
      ctx.globalAlpha = 1
    }
    const FX_W = 267, FX_H = 40, FX_PAD = 10, FX_RES = 2
    const radiantBar = function(entry, level, color) {
      const e = entry.entry
      if(!level || !color) {
        if(e.fx) { e.fx.remove(); e.fx = e.fxCtx = false }
        return
      }
      if(!e.fx) {
        e.fx = document.createElement('canvas')
        e.fx.className = 'leaderboardFx'
        e.fx.width = FX_W * FX_RES
        e.fx.height = FX_H * FX_RES
        e.fxCtx = e.fx.getContext('2d')
        e.div.insertBefore(e.fx, e.bar)
      }
      const old = ctx
      ctx = e.fxCtx
      ctx.setTransform(FX_RES, 0, 0, FX_RES, 0, 0)
      ctx.clearRect(0, 0, FX_W, FX_H)
      const x0 = FX_PAD + 4, cy = FX_H / 2, len = Math.max(12, 239 * (entry._percent || 0))
      const t = render.now, rc = render.averageColors(render.getRadiantColor(color, level), { r:255, g:255, b:255 }, 0.5)
      const grow = 2 + 1.2 * (1 + Math.sin(t / 800 * (2 + level) / 4)) * level
      ctx.globalAlpha = 1 - 0.7 / ((2 + level) / 3)
      ctx.fillStyle = render.rgb(rc)
      ctx.beginPath()
      ctx.roundRect(x0 - grow, cy - 6 - grow, len + grow * 2, 12 + grow * 2, 4 + grow)
      ctx.fill()
      ctx.globalAlpha = 1
      const gap = 34 - level * 3, n = Math.max(1, Math.floor(len / gap))
      const lw = render.lineWidth
      render.lineWidth = 1.5
      for(let i = 0; i < n; i++) {
        const sx = x0 + (i + 0.5) * len / n
        const ph = i * 1.3 + (entry.id || 0)
        const base = 7 + level * 0.8
        const d = (t / 2e3 * (1 + level) + ph) % (12 * Math.PI)
        const k = (level + 2) / 10
        ctx.setTransform(FX_RES, 0, 0, FX_RES, sx * FX_RES, cy * FX_RES)
        if(level > 3) {
          ctx.rotate(-d / 3)
          render.drawStarShape({ size1: base * (1.4 + level / 5), size2: base * 0.4, color: rc, sides: 3 })
          ctx.rotate(d / 3)
        }
        ctx.rotate(d / 2)
        const s1 = base * (k * Math.cos(t / 500 + Math.PI + ph) + 1), s2 = base * (k * Math.cos(t / 500 + ph) + 1)
        render.drawStarShape({ size1: s1, size2: s1 / 2.5, color: rc, sides: 6 })
        ctx.rotate(-d)
        render.drawStarShape({ size1: s2, size2: s2 / 2.5, color: rc, sides: 6 })
      }
      render.lineWidth = lw
      ctx.globalAlpha = 1
      ctx = old
    }

    const pageUpdateEntry = function(entry, idTanks, idPolygons) {
      let text = ''
      if(entry.type === 'tank') {
        let d = gameTankData[entry.id]
        if(d) {
          entry.name = d.name
          entry.radiant = d.radiant
        }
      }
      if(renderHideNames && !admin) {
        if(entry.name) {
          text = entry.name.replace(/\S/g, "?");
        } else {
          text = '???'
        }
        entry.displayScore = render.getRadiantMultiplier(entry.radiant) * entry.score
      } else if(entry.id < 0) {
        text = '???'
        entry.displayScore = render.getRadiantMultiplier(entry.radiant) * entry.score
      } else {
        if(!entry.name) {
          text = render.formatScore(entry.displayScore = render.getRadiantMultiplier(entry.radiant) * entry.score)
        } else {
          text = `${entry.name} - ${render.formatScore(entry.displayScore = render.getRadiantMultiplier(entry.radiant) * entry.score)}`
        }
      }
      if(text !== entry.entry.text.textContent) {
        entry.entry.text.textContent = text
      }
      ctx = entry.entry.ctx
      ctx.setTransform(entry.entry.transform)
      ctx.clearRect(-40, -40, 80, 80)
      ctx.scale(0.7, 0.7)
      if(entry.type === 'tank') {
        let tank = idTanks[entry.id], color
        if(renderHideNames && !admin) {
          color = render.teamColors[7]
        } else {
          if(tank) {
            color = tank.renderColor
          } else {
            let data = gameTankData[entry.id]
            if(!data) {
              data = {
                radiant: 0
              }
            } else {
              entry.radiant = data.radiant
            }
            color = render.averageColors(render.getTankColor(data.team, data.body), render.radiantColor, data.radiant / (data.radiant + 1))
          }
        }
        let bc = rgbRound(color)
        let bc2 = rgbRound(render.averageColors(color, { r:0, g:0, b:0 }, 0.8))
        entry.barColor = color
        setStyleC(entry.entry.slide, 'background', bc)
        setStyleC(entry.entry.bar, 'background', bc2)
        let data = gameTankData[entry.id]
        if(!data) {
          data = {
            weapon: 'node',
            body: 'base'
          }
        }
        let _tank = render.getTankData(data.weapon, data.body)
        _tank.size = 19
        _tank.color = color
        _tank.d = (render.now / 3000) % (2 * Math.PI)
        const level = radiantLevel(entry)
        if(data && (!renderHideNames || admin)) {
          if(level) {
            radiantIcon(level, { tank: true, d: _tank.d, color, size: _tank.size, sides: _tank.sides, outerSides: _tank.outerSides, outerSize: _tank.outerSize })
          }
          render.drawTank(_tank)
          if(level) { radiantSparkles(level, color, 30, entry.id) }
        }
      } else {
        let polygon = idPolygons[entry.id], color
        if(entry.id < 0) {
          color = render.teamColors[7]
        } else {
          if(polygon) {
            color = polygon.renderColor
          } else {
            color = render.averageColors(render.getPolygonColor(entry.sides), render.radiantColor, entry.radiant / (entry.radiant + 1))
          }
        }
        let bc = rgbRound(color)
        let bc2 = rgbRound(render.averageColors(color, { r:0, g:0, b:0 }, 0.8))
        entry.barColor = color
        setStyleC(entry.entry.slide, 'background', bc)
        setStyleC(entry.entry.bar, 'background', bc2)
        const level = radiantLevel(entry)
        if(!renderHideNames || admin) {
          if(level) {
            radiantIcon(level, { d: (render.now / 3000) % (2 * Math.PI), color, size: 26, sides: entry.sides })
          }
          render.drawPolygon({
            x: 0,
            y: 0,
            size: entry.id < 0 ? 20 : 26,
            sides: entry.sides,
            color: color,
            d: (render.now / 3000) % (2 * Math.PI),
            fadeTime: 1
          })
          if(level) { radiantSparkles(level, color, 30, entry.id) }
        }
      }
      let first = pageLeaderboard.order[0]
      if(first) {
        if(first.displayScore) {
          entry.percent = entry.displayScore / first.displayScore
        } else {
          entry.percent = 1
        }
      }
      entry._percent = util.average(entry._percent, entry.percent, 15) || 0
      let pe = (100 * (1 - entry._percent)).toFixed(0) + '%'
      setStyleC(entry.entry.slide, 'right', pe)
      radiantBar(entry, radiantLevel(entry), entry.barColor)
      ctx = renderCtx.gameCanvas
    }

    const pageLeaderboard = {
      entries: {},
      order: [],
      removedEntries: [],
      reset: function(k) {
        for(let id in pageLeaderboard.entries) {
          pageLeaderboard.entries[id].entry.div.remove()
        }
        if(k) {
          pageLeaderboard.update(k)
        }
        pageLeaderboard.entries = {}
        leaderboardEntries.innerHTML = ''
      },
      update: function(entries) {
        try {
          let leaderboard = pageLeaderboard
          let newEntries = {}
          leaderboard.order = []
          if(!(entries.length > 0)) {
            return entries[0].name
          }
          for(let i=0;i<8;i++) {
            let current = entries[i]
            if(current && current.id >= 0) {
              let currentId = current.type + current.id
              let obj
              if(currentId in leaderboard.entries) {
                obj = leaderboard.entries[currentId]
                delete leaderboard.entries[currentId]
                obj.score = current.score
                obj.name = current.name
                obj.sides = current.sides || 0
                obj.radiant = current.radiant || 0
              } else {
                obj = {
                  id: current.id,
                  type: current.type,
                  name: current.name,
                  score: current.score,
                  radiant: current.radiant || 0,
                  displayScore: render.getRadiantMultiplier(current.radiant) * current.score,
                  percent: 0,
                  _percent: 0,
                  sides: current.sides || 0,
                  entry: false
                }
                obj.entry = pageCreateEntry(obj)
                setTimeout(function() {
                  obj.entry.div.style.left = '0px'
                }, 100)
              }
              leaderboard.order.push(obj)
              let st = (i * 26) + 'px'
              setStyleC(obj.entry.div, 'top', st)
              if(obj.type === 'tank') {
                let data = gameTankData[obj.id]
                if(data) {
                  obj.radiant = data.radiant
                }
              }
              newEntries[currentId] = obj
            } else {
              leaderboard.order.push({})
            }
          }
          for(let id in leaderboard.entries) {
            let current = leaderboard.entries[id]
            if(current.entry.div.style.left !== '300px') { current.entry.div.style.left = '300px' }
            leaderboard.removedEntries.push(current)
            setTimeout(function() {
              current.entry.div.remove()
              let i = leaderboard.removedEntries.indexOf(current)
              if(i >= 0) {
                leaderboard.removedEntries.splice(i, 1)
              }
            }, 100)
          }
          leaderboard.entries = newEntries
        } catch(e) {}
      }
    }

    const page = {
      openAccount: function() {
        accountFull.style.top = '50%'
        accountDark.style.opacity = 1
        accountDark.style.pointerEvents = 'all'
      },
      openChangelog: function() {
        changelogFull.style.top = '50%'
        changelogDark.style.opacity = 1
        changelogDark.style.pointerEvents = 'all'
      },
      openTips: function() {
        tips.style.top = '50%'
        tipsDark.style.opacity = 1
        tipsDark.style.pointerEvents = 'all'
      },
      state: {
        inGame: false,
        sentConnecting: false,
        scoreDisplay: false,
        levelDisplay: false,
        tankName: false
      },
      setPlayButton: function(show) {
        playMenu.style.opacity = (show ? 1 : 0)
        playMenu.style.pointerEvents = (show ? 'inherit' : 'none')
        connectingSmall.style.opacity = (show ? 0 : 1)
        let c = document.activeElement.tagName.toLowerCase()
        if(show && page.overlay === 0 && !(c === 'input' || c === 'textarea')) {
          document.activeElement.blur()
          username.focus()
        }
      },
      setLargeConnecting: function(show, text) {
        connecting.style.opacity = (show ? 1 : 0)
        connecting.style.fontSize = (show ? '120px' : '112px')
        connecting.style.visibility = (show ? 'visible' : 'hidden')
        if(text) {
          connecting.textContent = text
        }
      },
      overlay: 0,
      sweep: { anim: null, timer: 0, hide: 0, pending: null },
      sweepBackground: function(dir) {
        const s = page.sweep
        if(s.anim) {
          s.anim.onfinish = null
          s.anim.cancel()
        }
        if(s.timer) {
          clearTimeout(s.timer)
          if(s.pending) { s.pending() }
        }
        const slide = render.serverSelectSlide
        const w = menuWipeBox.clientWidth || window.innerWidth, h = menuWipeBox.clientHeight || window.innerHeight
        const size = Math.ceil(Math.hypot(w, h) * 1.2)
        const start = dir > 0 ? w : -size, end = dir > 0 ? -size : w
        menuWipe.style.width = menuWipe.style.height = size + 'px'
        menuWipe.style.visibility = 'visible'
        const name = slide.name
        s.pending = function() {
          s.pending = null
          s.timer = 0
          if(window.menuScene) { window.menuScene(name) }
          game.splash.position.kv = dir * 60
        }
        const duration = 900
        s.anim = menuWipe.animate([
          { transform: `translate(${start}px, -50%)` },
          { transform: `translate(${end}px, -50%)` },
        ], { duration: duration, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' })
        s.anim.onfinish = function() {
          s.anim = null
          menuWipe.style.visibility = 'hidden'
        }
        s.timer = setTimeout(s.pending, duration / 2)
        clearTimeout(s.hide)
        s.hide = setTimeout(function() {
          if(s.anim) { s.anim.cancel() }
          s.anim = null
          menuWipe.style.visibility = 'hidden'
        }, duration + 150)
      },
      setOverlay: function(state, text) {
        page.overlay = state
        overlay1.style.visibility = (state === 2 ? 'visible' : 'hidden')
        overlay2.style.pointerEvents = (state === 0 ? 'inherit' : 'none')
        overlay2.style.visibility = (state === 0 ? 'visible' : 'hidden')
        connecting.style.visibility = (state > 0 ? 'visible' : 'hidden')
        page.setLargeConnecting(state === 1, text)
        if(state === 2) {
          modals.style.visibility = 'hidden'
        } else {
          modals.style.visibility = 'visible'
        }
        if(state === 1) {
          render.waiting = true
        } else {
          render.waiting = false
        }
        if(state !== 0) {
          panel.style.opacity = 0
        }
      },
      upgradeList: [],
      createUpgradeBox: function(weapon, body, name) {
        let box = {
          box: document.createElement('div'),
          lower: document.createElement('div'),
          canvas: document.createElement('canvas'),
          name: document.createElement('div'),
          weapon: weapon,
          body: body,
          transform: false,
          ctx: false,
          tank: false,
        }
        box.box.className = 'upgradeBox'
        box.lower.className = 'upgradeBoxLower'
        box.box.appendChild(box.lower)
        box.canvas.className = 'upgradeCanvas'
        box.box.appendChild(box.canvas)
        box.canvas.width = box.canvas.height = 200
        box.name.className = 'upgradeName'
        box.box.appendChild(box.name)
        box.name.textContent = name[0].toUpperCase() + name.slice(1)
        box.ctx = box.canvas.getContext('2d')
        box.ctx.translate(100, 100)
        box.transform = box.ctx.getTransform()
        box.tank = render.getTankData(weapon, body)
        box.tank.size = 28
        return box
      },
      statBars: [],
      statBarButtons: [],
      setStatDisplay: function(n) {
        setTextC(statDisplayLeft, 'x' + n)
        setTextC(statDisplayRight, n + 'x')
      },
      updateUpgradeBox: function(box) {
        ctx = box.ctx
        ctx.setTransform(box.transform)
        ctx.clearRect(-100, -100, 200, 200)
        ctx.scale(1.4, 1.4)
        if(box.tank) {
          if(gameData.me) {
            box.tank.radiant = gameData.me.radiant
            box.tank.color = gameData.me.color
            box.tank.invincible = gameData.me.invincible
          }
          let b = tankData.bodies[box.tank.body]
          if(b.celestial) {
            box.tank.size = 40
          } else {
            box.tank.size = 28
          }
          box.tank.d = render.now / 1500
          render.drawTank(box.tank)
        }
      },
      currentWeaponUpgrades: false,
      weaponUpgradeTimer: 0,
      lastWeapon: '',
      pendingWeapon: '',
      createWeaponUpgrades: function(weapons, label) {
        let quick = performance.now() - page.weaponUpgradeTimer < 1000
        let columns = Math.max(3, Math.ceil(weapons.length / 4))
        let hidden = `${-(110 + 140 * columns)}px`
        if(page.currentWeaponUpgrades) {
          page.currentWeaponUpgrades.remove()
        }
        let upgrades = {
          div: document.createElement('div'),
          buttons: {},
          remove: function() {
            upgrades.div.style.left = hidden
            upgrades.div.style.pointerEvents = 'none'
            if(page.currentWeaponUpgrades === upgrades) {
              page.currentWeaponUpgrades = false
            }
            setTimeout(function() {
              upgrades.div.remove()
              let i = page.upgradeList.indexOf(upgrades)
              if(i >= 0) {
                page.upgradeList.splice(i, 1)
              }
            }, 1000)
          },
          label: label
        }
        page.currentWeaponUpgrades = upgrades
        upgrades.div.className = 'weaponUpgrades'
        upgrades.div.style.left = hidden
        for(let i=0,l=weapons.length;i<l;i++) {
          let weapon = weapons[i], w = tankData.weapons[weapon]
          let box = upgrades.buttons[weapon] = page.createUpgradeBox(weapon, w.renderBody || 'base', w.label || weapon)
          box.box.style.left = `${70 + 140 * (i % columns)}px`
          box.box.style.bottom = `${70 + 140 * Math.floor(i / columns)}px`
          box.box.style.background = render.rgb(render.polygonColors[i % render.polygonColors.length])
          upgrades.div.appendChild(box.box)
          box.box.addEventListener('click', function() {
            if(gameData.me) {
              gameSend(gameCurrentServer.ws, ['upgradeWeapon', weapon])
              page.weaponUpgradeTimer = performance.now()
              page.lastWeapon = gameData.me.weapon
              page.pendingWeapon = weapon
            }
            upgrades.remove()
          })
        }
        if(quick) {
          upgrades.div.style.left = '10px'
        } else {
          setTimeout(function() {
            upgrades.div.style.left = '10px'
          }, 100)
        }
        overlay1.appendChild(upgrades.div)
        page.upgradeList.push(upgrades)
      },
      currentBodyUpgrades: false,
      bodyUpgradeTimer: 0,
      lastBody: '',
      createBodyUpgrades: function(bodies, label) {
        if(page.currentBodyUpgrades) {
          page.currentBodyUpgrades.remove()
        }
        let upgrades = {
          div: document.createElement('div'),
          buttons: {},
          remove: function() {
            upgrades.div.style.right = '-450px'
            upgrades.div.style.pointerEvents = 'none'
            if(page.currentBodyUpgrades === upgrades) {
              page.currentBodyUpgrades = false
            }
            setTimeout(function() {
              upgrades.div.remove()
              let i = page.upgradeList.indexOf(upgrades)
              if(i >= 0) {
                page.upgradeList.splice(i, 1)
              }
            }, 1000)
          },
          label: label
        }
        page.currentBodyUpgrades = upgrades
        upgrades.div.className = 'bodyUpgrades'
        for(let i=0,l=bodies.length;i<l;i++) {
          let body = bodies[i]
          let box = upgrades.buttons[body] = page.createUpgradeBox('node', body, body)
          box.box.style.transform = 'translate(50%, 50%)'
          box.box.style.right = `${70 + 140 * (i % 3)}px`
          box.box.style.bottom = `${70 + 140 * Math.floor(i / 3)}px`
          box.box.style.background = render.rgb(render.polygonColors[i])
          upgrades.div.appendChild(box.box)
          box.box.addEventListener('click', function() {
            if(gameData.me) {
              gameSend(gameCurrentServer.ws, ['upgradeBody', body])
              page.bodyUpgradeTimer = performance.now()
              page.lastBody = gameData.me.body
            }
            upgrades.remove()
          })
        }
        setTimeout(function() {
          upgrades.div.style.right = '10px'
        }, 100)
        overlay1.appendChild(upgrades.div)
        page.upgradeList.push(upgrades)
      }
    }

    window.page = page

    let ctx = renderCtx.gameCanvas

    for(let i=1;i<=8;i++) {
      let type = (i <= 4 ? true : false)
      let direction = (type ? 'right' : 'left')
      let bar = document.createElement('div')
      bar.className = `statBar${type ? 'Left' : 'Right'}`
      bar.style.bottom = `${(i - (type ? 1 : 5)) * 35}px`
      let inner = document.createElement('div')
      inner.className = 'statBarInner'
      inner.style[type ? 'left' : 'right'] = '5px'
      bar.appendChild(inner)
      let slide = document.createElement('div')
      slide.className = 'statBarSlide'
      slide.style[direction] = '100%'
      inner.appendChild(slide)
      let slide2 = document.createElement('div')
      slide2.className = 'statBarSlide2'
      slide2.style[direction] = '100%'
      inner.appendChild(slide2)
      let display = document.createElement('center')
      display.className = 'statBarText'
      display.textContent = ['Bullet Penetration', 'Bullet Speed', 'Bullet Damage', 'Reload', 'Movement Speed', 'Body Damage', 'Health Regeneration', 'Max Health'][i - 1]
      inner.appendChild(display)
      let button = document.createElement('div')
      button.className = 'statButton'
      button.style[direction] = '5px'
      let symbol = document.createElement('div')
      symbol.textContent = '+'
      symbol.className = 'statButtonInner'
      button.appendChild(symbol)
      let u = i - 1
      let color = render.polygonColors[[2, 0, 4, 1][i % 4]]
      slide.style.background = render.rgb(color)
      slide2.style.background = render.rgb(color, 0.2)
      button.addEventListener('click', function(e) {
        gameUpgrade(u)
      })
      bar.appendChild(button);
      (type ? statUpgradesLeft : statUpgradesRight).appendChild(bar)
      page.statBars.push(function(i) {
        const v = `${100 * (1 - i / 15)}%`
        setStyleC(slide, direction, v)
        setStyleC(slide2, direction, v)
      })
      page.statBarButtons.push(function(i) {
        const cn = i ? 'statButton' : 'statButtonDisabled'
        if(button.className !== cn) { button.className = cn }
      })
    }
