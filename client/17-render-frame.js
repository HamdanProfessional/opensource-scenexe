      drawFrame: function() {
        if(window.innerWidth !== render.lw || window.innerHeight !== render.lh) {
          render.resize()
        }
        let timeStart = performance.now()
        const overriding = (game.override ? true : false)
        const data = overriding ? game.override : gameData
        renderAmbientParticles = data.ambientParticles
        render.grid = data.grid
        render.wallType = data.wallType
        render.darkness = data.darkness || 0
        for(let i=renderAmbientParticles.length-1;i>=0;i--) {
          let item = renderAmbientParticles[i]
          for(let i=0,l=render.round(render.particles * item.amount * 0.01);i<l;i++) {
            let size = item.size[0] + [item.size[1] - item.size[0]] * Math.random();
            let d = item.d * 0.02 * Math.PI + item.range * 0.02 * (Math.random() - 0.5) * Math.PI
            let cos = Math.cos(d);
            let sin = Math.sin(d);
            let speed = item.speed * 0.01
            let w = render.width * cameraSize
            let h = render.height * cameraSize
            let ox = cameraX + w * (Math.random() - 0.5)
            let oy = cameraY + h * (Math.random() - 0.5)
            render.particlesOver.push(render.createParticle({
              ox: ox,
              oy: oy,
              nx: ox + cos * speed * 60,
              ny: oy + sin * speed * 60,
              size: size,
              d: 1 / item.t,
              fade: item.fade,
              color: item.color,
              radiant: item.radiant || 0,
              type: 1,
              maxAlpha: item.opacity * 0.01
            }))
          }
        }
        gameData.mapSize = util.average(gameData.mapSize, gameData._mapSize, 5)
        render.serverSelectSlide.p = util.average(render.serverSelectSlide.p, render.serverSelectSlide._p, 5)
        let spct = `${(-render.serverSelectSlide.p * 100).toFixed(0)}%`
        setStyleC(serverSelectSlide, 'left', spct)
        render.serverSelectColor = render.averageColors(render.getRadiantColor(render.serverSelectSlide.leftColor[0], render.serverSelectSlide.leftColor[1]), render.getRadiantColor(render.serverSelectSlide.rightColor[0], render.serverSelectSlide.rightColor[1]), render.serverSelectSlide.p)
        if(page.overlay !== 2) {
          setTextC(serverSelectLeft, render.serverSelectSlide.left)
          setTextC(serverSelectRight, render.serverSelectSlide.right)
          let lop = '' + Math.round(((1 - render.serverSelectSlide.p) * 100) * 0.01)
          let rop = '' + Math.round((render.serverSelectSlide.p * 100) * 0.01)
          setStyleC(serverSelectLeft, 'opacity', lop)
          setStyleC(serverSelectRight, 'opacity', rop)
          setStyleC(serverSelect, 'background', rgbRound(render.serverSelectColor))
          setStyleC(serverSelectLower, 'background', rgbRound(render.darken(render.serverSelectColor)))
        }
        render.particleCount = 0
        render.wallCount = 0
        render.polygonCount = 0
        render.imageCount = 0
        let v = Math.max(render.grid.background.r, render.grid.background.g, render.grid.background.b)
        let q = v > 70 ? v - 70 : 0
        render.wallOpacity = v > 12 ? (v < 30 ? 1 - 0.7 * (v - 12) / 18 : 0.3) : 1
        render.wallColor = {
          r: q,
          g: q,
          b: q
        }
        let upgrades = 0;
        for(let i=0;i<8;i++) {
          upgrades += gameUpgrades[i]
        }
        if(page.overlay === 2) {
          game.override = false
        } else {
          if(!game.override && !firstUpdate) {
            if(window.__k) { window.__k() }
          }
          render.hudOpacity = 0
          game.override = game.splash
          cameraZoom = 0
          cameraZoomScale = 1
          game.override.update()
        }
        if(!admin) {
          cameraZoomScale = 1
          cameraZoom = 0
        }
        cameraSize = util.average(cameraSize, 1.25 * cameraBaseSize * cameraZoomScale, render.cameraSmooth)
        if(game.animations._part < game.animations.part) {
          game.animations._part = util.average(game.animations._part, game.animations.part, 5)
        } else {
          game.animations._part = game.animations.part
        }
        if(game.animations._whole < game.animations.whole) {
          game.animations._whole = util.average(game.animations._whole, game.animations.whole, 5)
        } else {
          game.animations._whole = game.animations.whole
        }
        if(game.animations._score < game.animations.score) {
          game.animations._score = util.average(game.animations._score, game.animations.score, 5)
        } else {
          game.animations._score = game.animations.score
        }
        game.animations._tankLevelBar = util.average(game.animations._tankLevelBar, game.animations.tankLevelBar, 5)
        let radiantMultiplier = render.getRadiantMultiplier(gameData.me.radiant)
        setTextC(tankLevelDisplay, `${render.formatScore(radiantMultiplier * game.animations._part)} / ${render.formatScore(radiantMultiplier * game.animations._whole)}`)
        setStyleC(tankLevelBar, 'width', `${Math.round(game.animations._tankLevelBar * 2) / 2}px`)
        setTextC(tankScoreDisplay, `Score: ${render.formatScore(radiantMultiplier * game.animations._score)}`)
        let dt = (-render.now + (render.now = timeStart))
        render.flash = render.damageFlash && (render.now % 300 < 150)
        if(render.now - render.lastRadiant > 200) {
          render.lastRadiant = render.now
          render.radiantParticles = true
        } else {
          render.radiantParticles = false
        }
        util.powers = {}
        render.f = dt / 1000 * 60
        render.frames.push(render.now + 1000)
        let l = 0
        while(render.frames[l] < render.now) { l ++ }
        render.frames.splice(0, l)
        l = 0
        while(game.packetSizes[l] && game.packetSizes[l][0] < render.now) { l ++ }
        game.packetSizes.splice(0, l)
        render.updateDebugFade(dt)
        let k = dt / (game.packetSpan || 100)
        if(k > 2) { k = 2 }
        k = game.l = (game.l + k) / 2
        if(game.lerp < 1) {
          game.lerp += k
          if(!render.extrapolate && game.lerp > 1) { game.lerp = 1 }
        } else if(render.extrapolate) {
          game.lerp += k * (1.2 - game.lerp) / (1.2 - 1)
          if(game.lerp > 1.2) { game.lerp = 1.2 }
        } else {
          game.lerp = 1
        }
        let idTanks = {}, k2 = dt / 20
        for(let i=gameData.tanks.length-1;i>=0;i--) {
          let tank = gameData.tanks[i]
          idTanks[tank.id] = tank
          render.updateTank(tank, k2, dt)
        }
        if(gameData.me && gameData === data) {
          cameraTargetX = data.me.x
          cameraTargetY = data.me.y
        } else if(game.spectate && gameData === data) {
          let t = idTanks[game.spectate[0]]
          cameraTargetX = t ? t.x : game.spectate[1]
          cameraTargetY = t ? t.y : game.spectate[2]
        }
        if(render.staticCamera) {
          cameraRx = cameraTargetX
          cameraRy = cameraTargetY
        } else {
          cameraXv = cameraXv * 0.5 + (cameraTargetX - cameraRx) / render.cameraSmooth
          cameraYv = cameraYv * 0.5 + (cameraTargetY - cameraRy) / render.cameraSmooth
          cameraRx += cameraXv * render.f
          cameraRy += cameraYv * render.f
        }
        for(let i=gameData.bullets.length-1;i>=0;i--) {
          render.updateBullet(gameData.bullets[i], dt)
        }
        for(let i=gameData.walls.length-1;i>=0;i--) {
          render.updateWall(gameData.walls[i])
        }
        let idPolygons = {}
        for(let i=gameData.polygons.length-1;i>=0;i--) {
          let polygon = gameData.polygons[i]
          idPolygons[polygon.id] = polygon
          render.updatePolygon(polygon, dt)
        }
        let showUpgrades = false
        let mouseX = util.mouse.screenX / window.innerWidth * render.width
        let mouseY = util.mouse.screenY / window.innerHeight * render.height
        let gx = 0, gy = 0
        if(gameData.me && !overriding) {
          let weapon = gameData.me.weapon
          if(tankData.overrideWeapons) {
            weapon = '@@override'
          }
          if(weapon in tankData.weaponUpgradeMap && (render.now - page.weaponUpgradeTimer > 1000 || weapon !== page.lastWeapon)) {
            let _ = tankData.weaponUpgradeMap[weapon]
            let weaponOptions = _ ? (_.levels ? _.upgrades.filter((u, i) => gameData.me.level >= _.levels[i]) : _.upgrades) : []
            let weaponLabel = _ && _.levels ? weapon + '#' + weaponOptions.length : weapon
            if(_ && gameData.me.level >= _.level && weaponOptions[0]) {
              if(page.currentWeaponUpgrades) {
                if(page.currentWeaponUpgrades.label !== weaponLabel) {
                  page.currentWeaponUpgrades.remove()
                  page.createWeaponUpgrades(weaponOptions, weaponLabel)
                }
              } else {
                page.createWeaponUpgrades(weaponOptions, weaponLabel)
              }
            } else if(page.currentWeaponUpgrades) {
              page.currentWeaponUpgrades.remove()
            }
          } else if(page.currentWeaponUpgrades) {
            page.currentWeaponUpgrades.remove()
          }
          let body = gameData.me.body
          if(tankData.overrideBodies) {
            body = '@@override'
          }
          if(body in tankData.bodyUpgradeMap && (render.now - page.bodyUpgradeTimer > 1000 || body !== page.lastBody)) {
            let _ = tankData.bodyUpgradeMap[body]
            if(_ && gameData.me.level >= _.level && _.upgrades[0]) {
              if(page.currentBodyUpgrades) {
                if(page.currentBodyUpgrades.label !== body) {
                  page.currentBodyUpgrades.remove()
                  page.createBodyUpgrades(_.upgrades, body)
                }
              } else {
                page.createBodyUpgrades(_.upgrades, body)
              }
            } else if(page.currentBodyUpgrades) {
              page.currentBodyUpgrades.remove()
            }
          } else if(page.currentBodyUpgrades) {
            page.currentBodyUpgrades.remove()
          }
          let unusedUpgrades = gameData.me.level - upgrades - 1
          let max = 120 - upgrades
          let _b = tankData.bodies[gameData.me.body]
          if(_b && _b.celestial) {
            unusedUpgrades -= 14
          } if(unusedUpgrades > max) {
            unusedUpgrades = max
          }
          if(unusedUpgrades >= render.unusedUpgrades) {
            render.unusedUpgrades = util.average(render.unusedUpgrades, unusedUpgrades, 10)
            let display = Math.round(render.unusedUpgrades)
            if(display > 0) {
              page.setStatDisplay(display)
              showUpgrades = true
            } else {
              page.setStatDisplay(0)
              showUpgrades = false
            }
          } else {
            render.unusedUpgrades = unusedUpgrades
            if(unusedUpgrades > 0) {
              page.setStatDisplay(Math.floor(unusedUpgrades))
              showUpgrades = true
            } else {
              showUpgrades = false
            }
          }
          if(!showUpgrades || unusedUpgrades <= 0) {
            for(let i=0;i<8;i++) { page.statBarButtons[i](false) }
          } else {
            for(let i=0;i<8;i++) {
              page.statBarButtons[i](gameUpgrades[i] < 15)
            }
          }

          let q1 = mouseX + render.width/2
          let q2 = render.width/2 - mouseX
          let q = q1 < q2 ? q1 : q2
          if(q < (render.showUpgrades ? 450 : 10) && mouseY - render.height/2 > -200) { showUpgrades = true }
          render.showUpgrades = showUpgrades
          if(gameData.me.name !== page.state.tankName) {
            tankName.textContent = gameData.me.name
            page.state.tankName = gameData.me.name
          }
          let levelWeapon = tankData.weapons[gameData.me.weapon]
          let tankLevelText = `Level ${gameData.me.level} ${levelWeapon && levelWeapon.label ? levelWeapon.label : gameData.me.className}`
          if(tankLevel.textContent !== tankLevelText) {
            tankLevel.textContent = tankLevelText
          }
          cameraBaseSize = Math.sqrt(data.me.size / 75)
          if(data.me.weapon in tankData.weapons) {
            cameraBaseSize *= tankData.weapons[data.me.weapon].cameraSizeMultiplier || 1
          } if(data.me.body in tankData.bodies) {
            cameraBaseSize *= tankData.bodies[data.me.body].cameraSizeMultiplier || 1
          }
          if(game.autoSpin === false) {
            gameData.me.d = (game.spinLock === false ? util.mouse.d + (game.reverse ? Math.PI : 0) : game.spinLock)
          } else {
            game.autoSpin += dt * 0.00075 * game.autoSpinDirection
            if(game.autoSpin >= 2 * Math.PI) {
              game.autoSpin -= 2 * Math.PI
            } else if(game.autoSpin < 0) {
              game.autoSpin += 2 * Math.PI
            }
            gameData.me.d = game.autoSpin
          }
          let typing = (document.activeElement === chat)
          if(typing) {
            gameData.me.typing = true
          } if(typing !== render.typing) {
            render.typing = typing
            gameSend(gameCurrentServer.ws, ['typing', typing ? true : false])
          }
          gameData.me.passive = game.passive
          gameData.me._d = false
          let d = gameData.me.d / Math.PI * 100
          if(d !== util.mouse.sent && render.now - render.lastSendD > 40) {
            render.lastSendD = render.now
            util.mouse.sent = d
            gameSend(gameCurrentServer.ws, ['d', d])
          }
          let firing = ((util.mouse.down || game.autoFire || game.keys[32]) ? 1 : 0) + ((util.mouse.right || game.keys[16]) ? 2 : 0)
          if(firing !== util.mouse.lastSent) {
            util.mouse.lastSent = firing
            gameSend(gameCurrentServer.ws, ['firing', firing])
          }
          let gameX = Math.round(mouseX * cameraSize)
          let gameY = Math.round(mouseY * cameraSize)
          gx = gameX
          gy = gameY
          if(cpo.o) {
            let r = render.width > render.height ? render.width : render.height
            gx = cpo.x * r * cameraSize * 0.5
            gy = cpo.y * r * cameraSize * 0.5
          }
          let dist = [gameControlPosition[0] - gx, gameControlPosition[1] - gy]
          dist = Math.sqrt(dist[0] * dist[0] + dist[1] * dist[1])
          if((dist > 5 && render.now - render.lastSendControlPosition > 40) || (dist > 0 && render.now - render.lastSendControlPosition > 100)) {
            render.lastSendControlPosition = render.now
            gameControlPosition = [gx, gy]
            gameSend(gameCurrentServer.ws, ['controlPosition', gameControlPosition])
          }
          cameraShake = 0
          for(let i in gameData.wormholes) {
            let w = gameData.wormholes[i]
            if(w.type === 0) {
              let dx = w.x - gameData.me.x, dy = w.y - gameData.me.y
              let d = Math.sqrt(dx * dx + dy * dy) - w.size - gameData.me.size
              let m = w.ruptured ? 2 : 1
              if(d < 0) {
                cameraShake += m
              } else {
                cameraShake += 100 / (d + 100) * m
              }
            }
          }
        }
        if(cameraShake && render.screenShake) {
          let m = cameraShake * cameraSize
          cameraX = cameraRx + (2 * Math.random() - 1) * m
          cameraY = cameraRy + (2 * Math.random() - 1) * m
        } else {
          cameraX = cameraRx
          cameraY = cameraRy
        }
        let sl = (showUpgrades ? '10px' : '-400px')
        setStyleC(statUpgradesRight, 'right', sl)
        setStyleC(statUpgradesLeft, 'left', sl)
        let t = render.now / 500

        render.radiantColor.r = 127.5 * (1 + Math.sin(t))
        render.radiantColor.g = 127.5 * (1 + Math.sin(t + Math.PI / 3))
        render.radiantColor.b = 127.5 * (1 + Math.sin(t + 2 * Math.PI / 3))
        ctx.setTransform(render.defaultTransform)
        renderCtx.hudCanvas.setTransform(render.defaultTransform)
        renderCtx.darknessCanvas.setTransform(render.defaultTransform)
        let w = render.width * cameraSize * 0.5
        let h = render.height * cameraSize * 0.5
        ctx.clearRect(-w, -h, w * 2, h * 2)
        let w0 = w / cameraSize
        let h0 = h / cameraSize
        renderCtx.hudCanvas.clearRect(-w0, -h0, w0 * 2, h0 * 2)
        let s = 1 / cameraSize
        ctx.scale(s, s)
        ctx.translate(-cameraX, -cameraY)
        let transform = ctx.getTransform()
        ctx.fillStyle = render.rgb(render.grid.background)
        text.filter = false
        ctx.fillRect(cameraX - w, cameraY - h, w * 2, h * 2)
        let gridWidth = 5 / cameraSize
        if(gridWidth < 1) {
          ctx.globalAlpha = gridWidth * gridWidth
        }
        if(render.showGrid) {
          ctx.fillStyle = render.grid.pattern
          ctx.fillRect(cameraX - w, cameraY - h, w * 2, h * 2)
        }
        if(ctx.globalAlpha < 1) { ctx.globalAlpha = 1 }
        let particlesUnder = render.particlesUnder.length
        for(let i=particlesUnder-1;i>=0;i--) {
          render.drawParticle(render.particlesUnder[i], render.particlesUnder, render.f)
        }
        ctx.fillStyle = render.rgb(render.wallColor, render.wallOpacity)
        ctx.beginPath()
        let j = h - cameraY - data.mapSize
        if(j > 0) {
          ctx.rect(cameraX - w, cameraY - h, w * 2, j)
        }
        j = w - cameraX - data.mapSize
        if(j > 0) {
          ctx.rect(cameraX - w, cameraY - h, j, h * 2)
        }
        j = h + cameraY - data.mapSize
        if(j) {
          ctx.rect(cameraX - w, cameraY + h - j, w * 2, j)
        }
        j = w + cameraX - data.mapSize
        if(j) {
          ctx.rect(cameraX + w - j, cameraY - h, j, h * 2)
        }
        ctx.fill()
        ctx.closePath()
        j = true
        let lengthWalls = data.walls.length, lengthGates = data.gates.length
        let lengthTanks = data.tanks.length, lengthBullets = data.bullets.length, lengthPolygons = data.polygons.length
        ctx.lineWidth = 5
        for(let i=0;i<lengthWalls;i++) {
          render.drawWall(data.walls[i], i, data)
        }
        if(gameData.me && gameData === data) {
          render.setFillStroke({ r:166, g:167, b:174 })
          ctx.lineWidth = 10
          ctx.lineCap = ctx.lineJoin = 'round'
          ctx.beginPath()
          for(let x=flat(cameraRx - render.width * 0.5 * cameraSize),l=flat(cameraRx + render.width * 0.5 * cameraSize);x<=l;x++) {
            for(let y=flat(cameraRy - render.height * 0.5 * cameraSize),l=flat(cameraRy + render.height * 0.5 * cameraSize);y<=l;y++) {
              if(!walls[x] || !walls[x][y]) { continue }
              let gameX = x * 50, gameY = y * 50
              ctx.rect(gameX, gameY, 50, 50)
            }
          }
          ctx.stroke()
          ctx.fill()
          ctx.closePath()
        }
        for(let i=0;i<lengthTanks;i++) {
          let tank = data.tanks[i]
          render.drawRadiantAura(tank, true, true)
        }
        for(let i=0;i<lengthBullets;i++) {
          let bullet = data.bullets[i]
          render.drawRadiantAura(bullet, true, true, 0.1)
        }
        for(let i=0;i<lengthPolygons;i++) {
          render.drawRadiantAura(data.polygons[i])
        } if(ctx.globalAlpha < 1) { ctx.globalAlpha = 1 }
        for(let i in data.wormholes) {
          render.drawWormhole(data.wormholes[i])
        }
        for(let i=0;i<lengthGates;i++) {
          render.drawGate(data.gates[i])
        }
        render.drawAlpha = render.opacity.polygons
        for(let i=0;i<lengthPolygons;i++) {
          let polygon = data.polygons[i]
          if(render.inFOV(polygon)) {
            render.polygonCount ++
            ctx.globalAlpha = render.drawAlpha
            render.drawPolygon(polygon)
          } else {
            let color = polygon.color;
            if (polygon.radiant) {
              color = render.getRadiantColor(color, polygon.radiant)
            }
            polygon.renderColor = color
          }
        }
        for(let i=0;i<lengthTanks;i++) {
          let tank = data.tanks[i]
          ctx.globalAlpha = render.drawAlpha = render.opacity.tanks * render.stealthAlpha(tank)
          if(render.drawAlpha > 0.01) {
            render.drawTank(tank)
          }
        }
        ctx.globalAlpha = render.drawAlpha = render.opacity.bullets
        for(let i=0;i<lengthBullets;i++) {
          let bullet = data.bullets[i]
          if(render.inFOVPad(bullet, bullet.size * 2)) {
            render.drawBullet(bullet)
          }
        }
        ctx.globalAlpha = render.drawAlpha = 1
        if(gameData.me && gameData === data && wallEdit) {
          render.setFillStroke(gameData.me.renderColor, 0.3)
          let x = flat(mouseX * cameraSize + gameData.me.x)
          let y = flat(mouseY * cameraSize + gameData.me.y)
          ctx.fillRect(50 * x, 50 * y, 50, 50)
          ctx.beginPath()
          ctx.rect(50 * x, 50 * y, 50, 50)
          ctx.stroke()
          ctx.closePath()
        }
        if(gameData.me) {
          if(cpo.o) {
            ctx.fillStyle = 'rgb(255, 255, 255)'
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
            let x = gx + gameData.me.x, y = gy + gameData.me.y, s = cameraSize * 30
            ctx.globalCompositeOperation = 'difference'
            let w = s * 0.07
            ctx.beginPath()
            ctx.moveTo(gameData.me.x, gameData.me.y)
            ctx.lineTo(x, y)
            ctx.lineWidth = s * 0.07
            ctx.stroke()
            ctx.rect(x - w, y - s, w * 2, s * 2)
            ctx.rect(x - s, y - w, s * 2, w * 2)
            ctx.fill()
            ctx.closePath()
            ctx.globalCompositeOperation = 'source-over'
          }
        }
        ctx = renderCtx.hudCanvas
        ctx.setTransform(transform)
        render.debugHitboxes(data)
        for(let i in data.wormholes) {
          let w = data.wormholes[i]
          if(render.debugFade[1] > 0) {
            render.debugLabels(w, w.id, false, 0, { r:255, g:255, b:255 })
            let left = w.lifeMs >= 0 ? Math.max(0, Math.round(w.lifeMs - (performance.now() - w.lifeAt))) : -1
            let ga = ctx.globalAlpha
            ctx.globalAlpha = ga * render.debugFade[1]
            text.drawText(left >= 0 ? `${left} ms` : 'never closes', w.x, w.y + Math.max(w.size * 0.8, 14 * cameraSize) * 0.5 + 22 * cameraSize, 24, cameraSize)
            ctx.globalAlpha = ga
          }
        }
        for(let i=0;i<lengthTanks;i++) {
          let tank = data.tanks[i]
          let shown = render.stealthAlpha(tank)
          if(shown < 0.05) { continue }
          render.scaleFade(tank.fadeTime, false)
          ctx.globalAlpha *= shown
          render.drawHealthBar(tank)
        }
        ctx.globalAlpha = 1
        for(let i=0;i<lengthPolygons;i++) {
          let polygon = data.polygons[i]
          render.scaleFade(polygon.fadeTime, false)
          render.drawHealthBar(polygon)
          if(render.debugFade[1] > 0) {
            render.debugLabels(polygon, 'p' + polygon.id, render.getFullPolygonName(polygon), render.polygonMaxHealth(polygon.sides))
          }
        }
        if(game.showBulletHealthBars) {
          for(let i=0;i<lengthBullets;i++) {
            let bullet = data.bullets[i]
            render.scaleFade(bullet.fadeTime, false)
            render.drawHealthBar(bullet)
          }
        }
        for(let i=0;i<lengthTanks;i++) {
          let tank = data.tanks[i]
          let shown = render.stealthAlpha(tank)
          if(tank.invisible || tank.hide || shown < 0.05) {
            continue
          }
          let y = 20
          render.scaleFade(tank.fadeTime, false)
          ctx.globalAlpha *= shown
          if(render.debugFade[1] > 0) {
            render.debugLabels(tank, 't' + tank.id, (tank.name || tank.className) + (tank.accountName ? ` (${tank.accountName})` : ''), tank.maxHealth)
          }
          if(tank === data.me) { continue }
          text.drawText("lv. "+tank.level, tank.x, tank.y - tank.size - y * cameraSize, 30, cameraSize)
          y += 30
          if(tank.name) {
            text.drawText(tank.name, tank.x, tank.y - tank.size - y * cameraSize, 50, cameraSize)
            y += 50
          }
        }
        ctx.globalAlpha = 1
        for(let i=0;i<lengthTanks;i++) {
          let tank = data.tanks[i]
          if(tank.invisible || !render.chat) {
            continue
          }
          if(tank === gameData.me && render.typing && render.chatBox) {
            render.scaleFade(tank.fadeTime, false)
            render.chatBox.draw(tank, cameraSize)
            continue
          }
          let chatMessages = tank.chat, typing = tank.typingFade
          tank.typingFade = util.average(tank.typingFade, tank.typing ? 1 : 0, 5)
          if(chatMessages[0] || typing > 0) {
            let first = true
            render.scaleFade(tank.fadeTime, false)
            let y = 130
            if(tank === data.me) { y -= 80 }
            if(typing > 0.01 || tank.typing) {
              text.drawTextBox('...', tank.x, tank.y - tank.size - (y - 25 * (1 - typing) * (1 - typing)) * cameraSize, 36, cameraSize, typing, typing)
              y += 63 * typing
              if(tank.typing) {
                first = false
              }
            } else {
              tank.typingFade = 0
            }
            for(let i=chatMessages.length - 1;i>=0;i--) {
              let message = chatMessages[i]
              let timeShown = render.now - message[1]
              let timeLeft = message[2] - render.now
              let alpha = 1, offsetY = 0
              if(timeShown < 250) {
                alpha = 1 - (timeShown / 250)
                alpha = 1 - alpha * alpha
                offsetY = -25 * (alpha - 1) * (1 - alpha)
              } else if(timeLeft < 250) {
                alpha = timeLeft / 250
                offsetY = 25 * (alpha - 1) * (1 - alpha)
                alpha = alpha * alpha
              }
              if(timeLeft <= 0) {
                chatMessages.slice(i, 1)
              } else {
                if(first) {
                  message[3] = util.average(message[3], 1, 3)
                  first = false
                } else if(message[3] > 0.01) {
                  message[3] = util.average(message[3], 0, 3)
                } else {
                  message[3] = 0
                }
                text.drawTextBox(message[0], tank.x, tank.y - tank.size - (y - offsetY) * cameraSize, 36, cameraSize, alpha, message[3])
                y += 63 * alpha
              }
            }
          }
        } if(ctx.globalAlpha < 1) { ctx.globalAlpha = 1 }
        text.filter = true
        ctx.setTransform(render.defaultTransform)
        if(gameData.me) {
          const mapOff = !!game.noMinimap
          if(mapCanvas.__off !== mapOff) { mapCanvas.__off = mapOff; mapCanvas.classList.toggle('dimHidden', mapOff) }
          const noMap = mapOff || mapCanvas.style.display === 'none'
          if(mapInfo.__noMap !== noMap) { mapInfo.__noMap = noMap; mapInfo.classList.toggle('noMap', noMap) }
          setTextC(coords, `X ${Math.round(gameData.me.x)}   Y ${Math.round(gameData.me.y)}`)
        }
        if(gameData.me) {
          let color = rgbRound(gameData.me.renderColor)
          setStyleC(tankScoreBar, 'background', color)
          setStyleC(tankLevelBar, 'background', color)
        }
        for(let id in pageLeaderboard.entries) {
          pageUpdateEntry(pageLeaderboard.entries[id], idTanks, idPolygons)
        }
        for(let i=pageLeaderboard.removedEntries.length-1;i>=0;i--) {
          pageUpdateEntry(pageLeaderboard.removedEntries[i], idTanks, idPolygons)
        }
        ctx = renderCtx.mapCanvas
        ctx.resetTransform()
        ctx.clearRect(0, 0, 500, 500)
        ctx.fillStyle = render.rgb(render.grid.background, 0.82)
        ctx.fillRect(0, 0, 500, 500)
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)'
        ctx.lineWidth = 2
        ctx.beginPath()
        for(let i=1;i<8;i++) {
          ctx.moveTo(i * 62.5, 0)
          ctx.lineTo(i * 62.5, 500)
          ctx.moveTo(0, i * 62.5)
          ctx.lineTo(500, i * 62.5)
        }
        ctx.stroke()
        ctx.translate(250, 250)
        let m = 250 / data.mapSize
        let mapTransform = ctx.getTransform()
        if((render.wallType === 0 && !renderHideNames) || admin) {
          for(let i=0,l=data.walls.length;i<l;i++) {
            let wall = data.walls[i]
            if(!wall) { continue }
            if(wall.color) {
              ctx.fillStyle = render.rgb(wall.color, 0.25)
            } else {
              ctx.fillStyle = render.rgb(render.wallColor, render.wallOpacity)
            }
            ctx.fillRect(m * (wall.x - wall.w), m * (wall.y - wall.h), m * wall.w * 2, m * wall.h * 2)
          }
          for(let i in data.wormholes) {
            let wormhole = data.wormholes[i]
            if(wormhole.type === 2) {
              ctx.fillStyle = render.rgb(render.averageColors(wormhole.mapColor, { r:255, g:255, b:255 }, 0.5 - wormhole.fadeTime * 0.5))
            } else if(wormhole.type === 1 || wormhole.radiant > 0) {
              ctx.fillStyle = render.rgb(render.averageColors(render.radiantColor, { r:0, g:0, b:0 }, 0.5))
            } else {
              ctx.fillStyle = render.rgb(render.averageColors(wormhole.mapColor, { r:255, g:255, b:255 }, 0.5 - wormhole.fadeTime * 0.5))
            }
            ctx.beginPath()
            ctx.ellipse(wormhole.x * m, wormhole.y * m, 7, 7, 0, 0, 2 * Math.PI)
            ctx.fill()
            ctx.closePath()
            const ring = (render.now / 1500) % 1
            ctx.strokeStyle = ctx.fillStyle
            ctx.globalAlpha = 1 - ring
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.ellipse(wormhole.x * m, wormhole.y * m, 7 + ring * 12, 7 + ring * 12, 0, 0, 2 * Math.PI)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
        if(gameData.me) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)'
          ctx.lineWidth = 2
          ctx.setLineDash([8, 6])
          ctx.strokeRect(m * (cameraX - w), m * (cameraY - h), m * w * 2, m * h * 2)
          ctx.setLineDash([])
        }
        ctx.fillStyle = 'rgb(0, 0, 0)'
        let me = gameData.me || { x:0, y:0 }
        for(let i=data.tanks.length-1;i>=0;i--) {
          let tank = data.tanks[i]
          if(tank.invisible || tank.hide || tank.weapon === 'defender' || tank === gameData.me) { continue }
          let dx = tank.x - me.x
          let dy = tank.y - me.y
          let d = Math.sqrt(dx * dx + dy * dy)
          let o = 1
          let r = (tank.team && tank.team === gameData.me.team) ? 800 : 200
          if(d > r && !admin && !tank.alwaysShowOnMinimap) {
            o = (d + r) / (d) - 1
            o = o * o
          }
          if(o < 0.05 || (!tank.alwaysShowOnMinimap && renderHideNames)) { continue }
          ctx.fillStyle = render.rgb(render.averageColors(tank.renderColor, { r:0, g:0, b:0 }, 0.5), o)
          ctx.translate(tank.x * m, tank.y * m)
          ctx.rotate(tank.d)
          ctx.beginPath()
          ctx.moveTo(-6.3, -8.4)
          ctx.lineTo(6.3, -8.4)
          ctx.lineTo(0, 14)
          ctx.lineTo(-6.3, -8.4)
          ctx.fill()
          ctx.closePath()
          ctx.setTransform(mapTransform)
        }
        if(gameData.me && !gameData.me.invisible) {
          const pulse = 1 + 0.08 * Math.sin(render.now / 250)
          ctx.translate(me.x * m, me.y * m)
          ctx.rotate(me.d)
          ctx.scale(1.35 * pulse, 1.35 * pulse)
          ctx.fillStyle = render.rgb(render.averageColors(me.renderColor, { r:0, g:0, b:0 }, 0.3))
          ctx.strokeStyle = 'rgb(255, 255, 255)'
          ctx.lineWidth = 2.5
          ctx.lineJoin = 'round'
          ctx.beginPath()
          ctx.moveTo(-6.3, -8.4)
          ctx.lineTo(6.3, -8.4)
          ctx.lineTo(0, 14)
          ctx.closePath()
          ctx.fill()
          ctx.stroke()
          ctx.setTransform(mapTransform)
        }
        if(render.darkness > 0) {
          ctx = renderCtx.darknessCanvas
          let pulse = (1 + 0.1 * Math.sin(render.now / 1000)) * 1
          let _0 = (Math.sin(render.now / 2500) + 1) / 2
          ctx.setTransform(render.defaultTransform)
          ctx.clearRect(-w0, -h0, 2 * w0, 2 * h0)
          ctx.scale(s, s)
          ctx.translate(-cameraX, -cameraY)
          ctx = renderCtx.gameCanvas
          renderCtx.darknessCanvas.fillStyle = 'rgb(0, 0, 0)'
          let darknessTransform = renderCtx.darknessCanvas.getTransform()
          for(let i=0;i<lengthGates;i++) {
            let gate = data.gates[i]
            if(gate.type === 1) {
              renderCtx.darknessCanvas.translate(gate.x, gate.y)
              renderCtx.darknessCanvas.rotate(gate.d * Math.PI / 2)
              renderCtx.darknessCanvas.beginPath();
              renderCtx.darknessCanvas.rect(-30, -gate.length, 60, gate.length * 2);
              renderCtx.darknessCanvas.fill();
              renderCtx.darknessCanvas.closePath();
              renderCtx.darknessCanvas.setTransform(darknessTransform)
            }
          }
          if(data.me) {
            let size = data.me.size
            render.darknessPolygon({
              x: data.me.x,
              y: data.me.y,
              size: (size + 150) * pulse,
              sides: 0,
              d: data.me.d,
              alpha: 1
            }, true)
            render.darknessPolygon({
              x: data.me.x,
              y: data.me.y,
              size: 1.5 * (size + 150) * pulse,
              sides: 0,
              d: data.me.d,
              alpha: 0.5
            }, true)
            let a = Math.PI / 2
            for(let i=0,l=data.me.barrels.length;i<l;i++) {
              let barrel = data.me.barrels[i]
              let forward = barrel.y + barrel.height * 2
              let angle = barrel.d + data.me.d
              let x = data.me.x - (forward * Math.sin(angle) + barrel.x * Math.sin(angle + a)) * data.me.size;
              let y = data.me.y + (barrel.x * Math.cos(angle + a) + forward * Math.cos(angle)) * data.me.size;
              let w = 8 * barrel.width * data.me.size / pulse
              let r = 8 * barrel.height * data.me.size / pulse
              let d = w * 0.25
              render.darknessPolygon({
                x: x,
                y: y,
                size: w,
                sides: 0,
                d: data.me.d,
                alpha: 0.5
              }, true)
              let c = ctx
              ctx = renderCtx.darknessCanvas
              ctx.lineJoin = ctx.lineCap = "round";
              ctx.fillStyle = 'rgb(0, 0, 0)'
              let t = ctx.getTransform()
              ctx.lineJoin = "round";
              ctx.lineWidth = w / 0x2;
              ctx.translate(x, y);
              ctx.rotate(angle + a);
              ctx.beginPath();
              ctx.moveTo(0x0, d / 0x2);
              ctx.lineTo(r, w / 0x2);
              ctx.lineTo(r, w / -0x2);
              ctx.lineTo(0x0, d / -0x2);
              ctx.fill();
              ctx.stroke();
              ctx.setTransform(t)
              ctx = c
            }
          }
          let _1 = render.now / 2500
          for(let i in data.wormholes) {
            let wormhole = data.wormholes[i]
            if(wormhole.type === 2) {
              render.darknessPolygon({
                x: wormhole.x,
                y: wormhole.y,
                size: wormhole.size * (4 + _0),
                sides: 4,
                d: _1,
                alpha: 1
              })
              render.darknessPolygon({
                x: wormhole.x,
                y: wormhole.y,
                size: wormhole.size * (5 + _0),
                sides: 4,
                d: _1,
                alpha: 0.1
              })
            } else if(wormhole.type === 1) {
              render.darknessPolygon({
                x: wormhole.x,
                y: wormhole.y,
                size: wormhole.size * (1.5 + _0),
                sides: 0,
                d: _1,
                alpha: 1
              })
              render.darknessPolygon({
                x: wormhole.x,
                y: wormhole.y,
                size: wormhole.size * (3 + _0),
                sides: 0,
                d: _1,
                alpha: 0.1
              })
            } else {
              render.darknessPolygon({
                x: wormhole.x,
                y: wormhole.y,
                size: wormhole.size * (1.5 + _0 * 0.5),
                sides: 0,
                d: _1,
                alpha: 0.1
              })
            }
          }
          j = false
          for(let i=render.particlesUnder.length-1;i>=0;i--) {
            render.drawAura(render.particlesUnder[i], false, _0)
          }
          for(let i=0;i<lengthTanks;i++) {
            let tank = data.tanks[i]
            render.drawAura(tank, true, _0)
            render.drawAuras(tank, 1.1 + _0 * 0.1)
          }
          for(let i=0;i<lengthBullets;i++) {
            let bullet = data.bullets[i]
            render.drawAura(bullet, true, _0)
            render.drawAuras(bullet, 1.1 + _0 * 0.1)
          } if(ctx.globalAlpha < 1) { ctx.globalAlpha = 1 }
          for(let i=0;i<lengthPolygons;i++) {
            render.drawAura(data.polygons[i], false, _0)
          }
          let particlesOver = render.particlesOver.length
          for(let i=particlesOver-1;i>=0;i--) {
            render.drawParticle(render.particlesOver[i], render.particlesOver, render.f)
          }
          ctx.setTransform(render.defaultTransform)
          ctx.globalAlpha = render.hudOpacity * render.opacity.hud
          render.imageCount ++
          ctx.drawImage(hudCanvas, -w0, -h0, w0 * 2, h0 * 2)
          renderCtx.hudCanvas.clearRect(-w0, -h0, w0 * 2, h0 * 2)
          let m = 1, b = data.me ? tankData.bodies[data.me.body] : false
          if(b && b.darknessMultiplier >= 0) {
            m = b.darknessMultiplier
          }
          renderCtx.hudCanvas.fillStyle = `rgba(0, 0, 0, ${m * render.darkness})`
          renderCtx.hudCanvas.fillRect(-w0, -h0, w0 * 2, h0 * 2)
          renderCtx.hudCanvas.globalCompositeOperation = 'destination-out'
          render.imageCount ++
          renderCtx.hudCanvas.drawImage(darknessCanvas, -w0, -h0, w0 * 2, h0 * 2)
          renderCtx.hudCanvas.globalCompositeOperation = 'source-over'
          ctx.globalAlpha = 1
          render.imageCount ++
          ctx.drawImage(hudCanvas, -w0, -h0, w0 * 2, h0 * 2)
          ctx = renderCtx.hudCanvas
          ctx.clearRect(-w0, -h0, w0 * 2, h0 * 2)
        } else {
          ctx = renderCtx.gameCanvas
          for(let i=0;i<lengthTanks;i++) {
            render.drawAuras(data.tanks[i], 0)
          }
          for(let i=0;i<lengthBullets;i++) {
            render.drawAuras(data.bullets[i], 0)
          } if(ctx.globalAlpha < 1) { ctx.globalAlpha = 1 }
          let particlesOver = render.particlesOver.length
          for(let i=particlesOver-1;i>=0;i--) {
            render.drawParticle(render.particlesOver[i], render.particlesOver, render.f)
          }
          ctx = renderCtx.hudCanvas
        }
        let hh = render.height / 2
        k = 62 - hh
        for(let i=render.announcements.length-1;i>=0;i--) {
          let announcement = render.announcements[i]
          let timeLeft = announcement.removeTime - render.now
          let timeShown = render.now - announcement.showTime
          let alpha = 1, offsetY = 0
          if(timeShown < 250) {
            alpha = 1 - (timeShown / 250)
            alpha = 1 - alpha * alpha
          } else if(timeLeft < 250) {
            alpha = timeLeft / 250
            offsetY = 25 * (alpha - 1) * (1 - alpha)
            alpha = alpha * alpha
          }
          if(timeLeft <= 0) {
            render.announcements.slice(i, 1)
          } else {
            text.drawTextBox(announcement.text, 0, k + offsetY, 36, 1, alpha)
            k += 63 * alpha
          }
        }
        if(renderRestart.timer <= 60) {
          if(renderRestart.timer < 37) {
            if(renderRestart.a1 < 1) {
              renderRestart.a1 += 0.01
            } else {
              renderRestart.a1 = 1
            }
          } else {
            renderRestart.a1 = 0
          }
          if(renderRestart.a2 > 0) {
            renderRestart.a2 -= 0.04
          } else {
            renderRestart.a2 = 0
          }
          let a1 = renderRestart.a1 * renderRestart.a1
          let a2 = renderRestart.a2 * renderRestart.a2 * 500
          renderRestart.a3 *= 0.98
          let a3 = renderRestart.a3
          if(a1 < 0.9) {
            ctx.globalAlpha = 1 - a1
            text.drawText('SERVER UPDATING', 0, 120 - hh - 170 * a1 - a2, 70, 1)
            text.drawText('NO PLAYERS CAN JOIN', 0, 170 - hh - 210 * a1 - a2, 35, 1)
            text.drawText('-', 380 + 100 * a1, 104 - hh - 170 * a1 - a2, 70, 1)
            text.drawText('-', -380 - 100 * a1, 104 - hh - 170 * a1 - a2, 70, 1)
            text.drawText('-', 230 + 100 * a1, 166 - hh - 210 * a1 - a2, 35, 1)
            text.drawText('-', -230 - 100 * a1, 166 - hh - 210 * a1 - a2, 35, 1)
            ctx.globalAlpha = 1
          }
          text.drawText('you will be terminated in', 0, 240 - hh - 120 * a1 - a2, 45, 1)
          text.drawText(renderRestart.timer,  a3 * (Math.random() - 0.5), 310 - hh - 120 * a1 - a2 + a3 * (Math.random() - 0.5), 65, 1, { r:255, g:255 - a3 * 15, b:255 - a3 * 15 })
        }
        ctx = renderCtx.gameCanvas
        let size = [0, 0]
        for(let i=game.packetSizes.length-1;i>=0;i--) {
          let arr = game.packetSizes[i]
          size[arr[2] ? 1 : 0] += arr[1]
        }
        let fps = render.frames.length
        let info = render.serverInfo || ['?', '?', '?']
        let entries = [
          [`Server TPS: ${info[0]}`, info[0] >= 0 ? (info[0] - 54) / 6 : 0],
          [`Client FPS: ${fps}`, (fps - 50) / 10],
          [`Ping: ${game.ping >= 0 ? Math.round(game.ping) + ' ms' : '...'}`, game.ping >= 0 ? (150 - game.ping) / 70 : 0],
          [`Send: ${render.formatPacketSize(size[1])} kb/s`, (1000 - size[1]) / (size[1] > 1000 ? 200 : 750)],
          [`Receive: ${render.formatPacketSize(size[0])} kb/s`, (15000 - size[0]) / (size[0] > 15000 ? 5000 : 2000)],
          [`Players in this dim: ${info[1]}`],
          [`Total players: ${info[2]}`],
        ]
        t = ''
        if(game.debug || render.now - game.debugTime < 500) {
          for(let i=0,l=entries.length;i<l;i++) {
            let arr = entries[i]
            let h = 0, s = 100, l = 100
            if(arr[1] > 0) {
              let k = arr[1] < 1 ? arr[1] : 1
              h = 180 - 40 * k
              l = 100 - 50 * k
            } else if(arr[1] < 0) {
              let k = arr[1] > -1 ? arr[1] : -1
              h = 60 + 60 * k
              l = 100 + 50 * k
            }
            t += `<div style="color:hsl(${h}, ${s}%, ${l}%)">${arr[0]}</div>`
          }
          debugText.innerHTML = t
        }
        for(let i=page.upgradeList.length-1;i>=0;i--) {
          let upgrades = page.upgradeList[i]
          for(let u in upgrades.buttons) {
            page.updateUpgradeBox(upgrades.buttons[u])
          }
        }
        if(render.lastTank) {
          ctx = renderCtx.respawnCanvas
          ctx.resetTransform()
          ctx.scale(1.5, 1.5)
          ctx.translate(250, 250)
          ctx.clearRect(-250, -250, 500, 500)
          ctx.scale(1.2, 1.2)
          render.lastTank.d = (render.now / 4000) % (2 * Math.PI)
          render.drawRadiantAura(render.lastTank)
          render.drawTank(render.lastTank)
        }
        ctx = renderCtx.gameCanvas
        render.clientTickTime = (render.clientTickTime * 19 + (performance.now() - timeStart)) / 20
        render.serverTickTime = (render.serverTickTime * 19 + render._serverTickTime) / 20
      },
      loop: function() {
        if(title.textContent !== title._textContent) {
          let s = title.textContent
          if(!s.includes('Open-Scenexe')) {
            s = 'Open-Scenexe'
          }
          title._textContent = title.textContent = s
        }
        const chatMax = chat.value.startsWith('/') ? 100000000 : 100
        if(chat.maxLength !== chatMax) { chat.maxLength = chatMax }
        try {
          render.drawFrame()
        } catch(e) { console.warn(e); }
        requestAnimationFrame(render.loop)
      },
      getTankData: function(w, b) {
        let weapon = tankData.weapons[w] || {}
        let body = tankData.bodies[b] || {}
        let tank = {
          weapon: w,
          body: b,
          x: 0,
          y: 0,
          d: 0,
          size: 45,
          color: render.teamColors[0],
          radiant: 0,
          sides: body.sides || 0,
          outerSides: body.outerSides || 0,
          outerSize: body.outerSize || 0,
          barrels: weapon.barrels || [],
          weaponTurrets: weapon.weaponTurrets || [],
          turrets: body.turrets || [],
          auras: body.auras || [],
          visualElements: body.visualElements || [],
          weaponVisualElements: weapon.weaponVisualElements || [],
          fadeTime: 1,
          passive: false,
          passiveFade: 0,
        }
        return tank
      }
    }

