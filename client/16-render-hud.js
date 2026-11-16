      slide: function(a, b, c) {
        if(a === b) { return a }
        return (a + (b - a) * c)
      },
      announcements: [],
      addAnnouncement: function(text, duration) {
        let now = performance.now()
        render.announcements.push({
          showTime: now,
          removeTime: now + duration,
          text: text
        })
      },
      healthBarWidth: 12,
      drawHealthBar: function(object) {
        if(object.invisible) {
          return
        }
        object.health = util.average(object.health, object._health, 4)
        if(object.health <= 0.99) {
          object.healthBarFade = util.average(object.healthBarFade, 1, 5)
        } else {
          object.healthBarFade = util.average(object.healthBarFade, 0, 5)
        }
        if(object.healthBarFade > 0.02 && object.renderColor) {
          let fade = object.healthBarFade
          let alpha = 1 - (1 - fade) * (1 - fade)
          let m = cameraSize > 1 ? 1 + (cameraSize - 1) * 0.5 : cameraSize
          let r = render.healthBarWidth * m
          let x = object.x
          let y = object.y + object.size * 1.025 + r + 5
          let w = object.size * fade
          ctx.lineWidth = r
          ctx.lineCap = 'round'
          ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`
          ctx.beginPath()
          ctx.moveTo(x - w, y)
          ctx.lineTo(x + w, y)
          ctx.stroke()
          ctx.closePath()
          ctx.lineWidth = r * 0.5
          let color = {
            r: object.renderColor.r < 60 ? 60 : object.renderColor.r,
            g: object.renderColor.g < 60 ? 60 : object.renderColor.g,
            b: object.renderColor.b < 60 ? 60 : object.renderColor.b
          }
          ctx.strokeStyle = render.rgb(color, alpha * 0.2)
          ctx.beginPath()
          ctx.moveTo(x - w, y)
          ctx.lineTo(x + w, y)
          ctx.stroke()
          ctx.closePath()
          ctx.strokeStyle = render.rgb(color, alpha)
          ctx.beginPath()
          ctx.moveTo(x - w, y)
          ctx.lineTo(x + w * (object.health * 2 - 1), y)
          ctx.stroke()
          ctx.closePath()
        }
      },
      debugFade: [0, 0, 0, 0],
      updateDebugFade: function(dt) {
        let k = dt > 0 ? Math.min(1, dt / 150) : 1
        for(let i=1;i<4;i++) {
          let t = game.debug >= i ? 1 : 0
          let f = render.debugFade[i] += (t - render.debugFade[i]) * k
          if(Math.abs(t - f) < 0.005) { render.debugFade[i] = t }
        }
      },
      debugId: function(str, x, y, size, color, alpha) {
        if(!(alpha > 0)) { return }
        ctx.save()
        ctx.globalAlpha *= alpha
        ctx.font = `800 ${size}px Roboto`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.lineJoin = 'round'
        ctx.miterLimit = 2
        ctx.lineWidth = 5 * cameraSize
        ctx.strokeStyle = 'rgb(0, 0, 0)'
        ctx.strokeText(str, x, y)
        ctx.fillStyle = render.rgb(color)
        ctx.fillText(str, x, y)
        ctx.restore()
      },
      debugLabels: function(object, id, name, maxHealth, color) {
        let f = render.debugFade
        if(!(f[1] > 0) || object.invisible) { return }
        let c = color || object.renderColor || object.color || { r:255, g:255, b:255 }
        render.debugId(String(id), object.x, object.y, Math.max(object.size * 0.8, 14 * cameraSize), c, f[1])
        if(!(f[2] > 0)) { return }
        let ga = ctx.globalAlpha
        let m = cameraSize > 1 ? 1 + (cameraSize - 1) * 0.5 : cameraSize
        let y = object.y + object.size * 1.025 + render.healthBarWidth * m * 2 + 5 + 26 * cameraSize
        if(name) {
          ctx.globalAlpha = ga * f[2]
          text.drawText(name, object.x, y, 26, cameraSize)
          y += 28 * cameraSize
        }
        if(f[3] > 0 && maxHealth > 0) {
          let h = Math.max(0, Math.min(1, object._health >= 0 ? object._health : object.health))
          ctx.globalAlpha = ga * f[3]
          text.drawText(`${render.formatScore(Math.round(h * maxHealth))}/${render.formatScore(Math.round(maxHealth))}`, object.x, y, 24, cameraSize)
        }
        ctx.globalAlpha = ga
      },
      debugHitboxes: function(data) {
        let a = render.debugFade[1]
        if(!(a > 0)) { return }
        ctx.save()
        ctx.lineWidth = 2.5 * cameraSize
        const ring = function(x, y, r, color, alpha) {
          if(!(r > 0) || !(alpha > 0)) { return }
          ctx.globalAlpha = a * alpha
          ctx.strokeStyle = color
          ctx.beginPath()
          ctx.arc(x, y, r, 0, 2 * Math.PI)
          ctx.stroke()
        }
        const fade = function(o) {
          return o.fadeTime < 1 ? o.fadeTime : 1
        }
        const auras = function(o, alpha) {
          if(!o.auras || !o.auras[0]) { return }
          let cos = Math.cos(o.d), sin = Math.sin(o.d)
          for(let i=0,l=o.auras.length;i<l;i++) {
            let aura = o.auras[i]
            if(!(aura.auraSize > 0)) { continue }
            ring(o.x + o.size * (aura.x * cos + aura.y * sin), o.y + o.size * (aura.x * sin - aura.y * cos), aura.auraSize * o.size, 'rgb(0, 0, 0)', alpha)
          }
        }
        for(let i=data.polygons.length-1;i>=0;i--) {
          let p = data.polygons[i]
          ring(p.x, p.y, p.size, 'rgb(255, 255, 255)', fade(p))
        }
        for(let i=data.bullets.length-1;i>=0;i--) {
          let b = data.bullets[i]
          if(b.invisible) { continue }
          ring(b.x, b.y, b.size, 'rgb(255, 60, 60)', fade(b))
          auras(b, fade(b))
        }
        for(let i=data.tanks.length-1;i>=0;i--) {
          let t = data.tanks[i]
          if(t.invisible) { continue }
          ring(t.x, t.y, t.size, 'rgb(255, 255, 255)', fade(t))
          auras(t, fade(t))
        }
        ctx.restore()
      },
      lerpOf: function(e) {
        if(!(e.lt > 0)) { return game.lerp }
        let l = (render.now - e.lt) / (e.span || 33)
        return l < 1 ? (l > 0 ? l : 0) : (l < 2 ? 1 + (l - 1) * 0.2 : 1.2)
      },
      polygonMaxHealth: function(sides) {
        return sides >= 3 ? 15 * Math.pow(3.5, sides - 3) : 50000 * Math.pow(2, -sides - 1)
      },
      reset: function() {
        render.announcements = []
        cameraZoom = 0
        cameraZoomScale = 1
        gameData.tanks = []
        gameData.me = false
        gameData.polygons = []
        gameData.walls = []
        gameData.wormholes = {}
        gameData.bullets = []
        gameData.bases = []
        pageLeaderboard.reset()
        for(let i=0;i<8;i++) {
          page.statBars[i](0)
        }
        gameUpgrades = [0, 0, 0, 0, 0, 0, 0, 0]
      },
      bulletShape: {},
      isPlainBullet: function(bullet) {
        return bullet.sides >= 0 && !bullet.highlight && !bullet.outerSize
          && !(bullet.barrels && bullet.barrels[0]) && !(bullet.turrets && bullet.turrets[0])
          && !(bullet.weaponTurrets && bullet.weaponTurrets[0]) && !(bullet.auras && bullet.auras[0])
          && !(bullet.visualElements && bullet.visualElements[0]) && !(bullet.weaponVisualElements && bullet.weaponVisualElements[0])
      },
      drawBullet: function(bullet) {
        if(bullet.invisible) { return }
        if(!render.isPlainBullet(bullet)) {
          render.drawTank(bullet)
          return
        }
        let color = render.getRadiantColor(bullet.color, bullet.radiant)
        bullet.renderColor = color
        if(bullet.damageFlash > 0.05) {
          color = render.lighten(color, bullet.damageFlash * (60 + 5 * (2 * Math.random() - 1)))
        }
        if(bullet.invincible) {
          color = render.averageColors(color, { r:255, g:255, b:255 }, (1 + Math.sin(render.now / 25)) * 0.1)
        }
        let fade = bullet.fadeTime
        let alpha = fade <= 1 ? fade : 2 - fade
        let scale = 1
        if(alpha < 1) {
          scale = 1 + (1 - alpha) / 5
          ctx.globalAlpha = alpha * render.drawAlpha
        }
        let sides = bullet.sides
        let shape = render.bulletShape
        shape.sides = sides
        shape.star = bullet.star
        shape.size = bullet.size * scale
        shape.color = color
        shape.x = bullet.x
        shape.y = bullet.y
        shape.d = bullet.d + ((sides !== 8 && sides !== 4 && sides !== 0) ? Math.PI / sides : 0)
        render.drawRegularPolygon(shape)
        if(ctx.globalAlpha !== render.drawAlpha) { ctx.globalAlpha = render.drawAlpha }
      },
      inFOVPad: function(obj, pad) {
        let w = render.width * 0.5 * cameraSize + pad
        let h = render.height * 0.5 * cameraSize + pad
        let s = obj.size || 0
        return (obj.x - s < cameraX + w && obj.y - s < cameraY + h && obj.x + s > cameraX - w && obj.y + s > cameraY - h)
      },
      inFOV: function(obj) {
        let w = render.width * 0.5 * cameraSize
        let h = render.height * 0.5 * cameraSize
        let ow = obj.w || obj.size
        let oh = obj.h || obj.size
        return (obj.x - ow < cameraX + w && obj.y - oh < cameraY + h && obj.x + ow > cameraX - w && obj.y + oh > cameraY - h)
      },
      wallCount: 0,
      wallType: 0,
      drawWall: function(wall, id, data) {
        if(wall && render.inFOV(wall)) {
          render.wallCount ++
          if(data.wallType === 1 && !wall.color) {
            render.setFillStroke({ r:166, g:167, b:174 })
            ctx.beginPath()
            ctx.rect(wall.x - wall.w + 2.5, wall.y - wall.h + 2.5, wall.w * 2 - 5, wall.h * 2 - 5)
            ctx.fill()
            ctx.closePath()
            ctx.beginPath()
            ctx.rect(wall.x - wall.w, wall.y - wall.h, wall.w * 2, wall.h * 2)
            ctx.stroke()
            ctx.closePath()
          } else {
            if(wall.color) {
              ctx.fillStyle = render.rgb(wall.color, 0.25)
            } else {
              ctx.fillStyle = render.rgb(render.wallColor, render.wallOpacity)
            }
            ctx.fillRect(wall.x - wall.w, wall.y - wall.h, wall.w * 2, wall.h * 2)
          }
          if(render.debugFade[1] > 0) {
            let a = render.debugFade[1]
            ctx.globalAlpha = render.hudOpacity * render.opacity.hud * a
            ctx.beginPath()
            ctx.rect(wall.x - wall.w, wall.y - wall.h, wall.w * 2, wall.h * 2)
            ctx.strokeStyle = 'rgb(255, 255, 255)'
            ctx.lineWidth = 2.5 * cameraSize
            ctx.lineJoin = ctx.lineCap = 'round'
            ctx.stroke()
            ctx.closePath()
            ctx.globalAlpha = render.hudOpacity * render.opacity.hud
            render.debugId(String(id), wall.x, wall.y, Math.max(Math.min(wall.w, wall.h) * 0.6, 15 * cameraSize), render.lighten(wall.color || render.wallColor, 120), a)
            ctx.globalAlpha = 1
          }
        }
      },
      typing: false,
      frames: [],
      getTankColor: function(team, b) {
        let sides = b
        b = tankData.bodies[b]
        if(b && !(b >= 0)) { sides = b.sides }
        if(team === 5) {
          if(sides >= 3) {
            return render.getPolygonColor(sides)
          } else {
            return { r:255, g:255, b:255 }
          }
        } else {
          if(render.teamColors[team]) {
            return render.teamColors[team]
          }
          return render.teamColors[0]
        }
      },
      serverSelectColor: { r:0, g:0, b:0 },
      serverSelectSlide: {
        left: 'FFA',
        right: 'Connecting...',
        leftColor: [{ r:240, g:79, b:84 }, 0],
        rightColor: [{ r:192, g:192, b:192 }, 0],
        p: 1,
        _p: 1,
        selected: 0,
        name: '',
        data: false,
        sLeft: function() {
          let r = render.serverSelectSlide
          if(r.data) {
            let n = r.selected - 1
            if(n < 0) {
              n = r.data.length - 1
            }
            let k = r.data[n]
            render.slideSelect(k[1], getColorCode(k[2]), k[3], 0)
            r.name = k[0]
            r.selected = n
          }
        }, sRight: function() {
          let r = render.serverSelectSlide
          if(r.data) {
            let n = r.selected + 1
            if(n >= r.data.length) {
              n = 0
            }
            let k = r.data[n]
            render.slideSelect(k[1], getColorCode(k[2]), k[3], 1)
            r.name = k[0]
            r.selected = n
          }
        }
      },
      slideSelect: function(text, color, radiant, dir) {
        let d = ['left', 'right'][render.serverSelectSlide._p]
        let cText = render.serverSelectSlide[d]
        let cColor = render.serverSelectSlide[d + 'Color']
        d = ['left', 'right'][dir]
        let r = ['right', 'left'][dir]
        render.serverSelectSlide._p = dir
        render.serverSelectSlide.p = 1 - dir
        render.serverSelectSlide[r] = cText
        render.serverSelectSlide[r + 'Color'] = cColor
        render.serverSelectSlide[d] = text
        render.serverSelectSlide[d + 'Color'] = [color, radiant]
      },
      lastSendD: 0,
      lastSendControlPosition: 0,
