      drawElement: function(element, tank, color) {
        let c = element.color
        if(element.flashColor && render.flash) { c = element.flashColor }
        c = render.getColor(color, c, element.colorAverage, color)
        if('sides' in element) {
          let d = element.d || 0, sin = Math.sin(d), cos = Math.cos(d), x = element.x || 0, y = element.y || 0
          if(element.rotationSpeed) {
            d += Math.PI * ((render.now / 500 * element.rotationSpeed) % 2)
          } if(element.fixRotation) {
            d -= tank.d
          }
          if(element.sides >= 0) {
            render.drawRegularPolygon({
              sides: element.sides || 0,
              size: tank.size * element.size,
              color: c,
              d: d + ((element.sides !== 8 && element.sides !== 4 && element.sides !== 0) ^ element.reflect ? Math.PI / element.sides : 0),
              x: tank.size * (x * cos - y * sin),
              y: tank.size * (y * cos + x * sin),
              alpha: 'alpha' in element ? element.alpha || 0 : 1,
              noStroke: element.noStroke,
              noFill: element.noFill
            });
          } else if(element.sides < 0) {
            render.drawStarShape({
              sides: -element.sides || 0,
              size1: tank.size * element.size * 0.4,
              size2: tank.size * element.size,
              color: c,
              d: d + ((element.sides !== 8 && element.sides !== 4 && element.sides !== 0) ^ element.reflect ? Math.PI / element.sides : 0),
              x: tank.size * (x * cos - y * sin),
              y: tank.size * (y * cos + x * sin),
              alpha: 'alpha' in element ? element.alpha || 0 : 1,
              noStroke: element.noStroke,
              noFill: element.noFill
            });
          }
        } else if('paths' in element) {
          render.setFillStroke(c)
          ctx.beginPath()
          for(let i=0,l=element.paths.length;i<l;i++) {
            let path = element.paths[i]
            let d = element.d || 0, sin = Math.sin(d), cos = Math.cos(d), x = element.x || 0, y = element.y || 0
            let s = [path[0][0] + x, path[0][1] + y]
            s = [s[0] * cos - s[1] * sin, s[1] * cos + s[0] * sin]
            ctx.moveTo(tank.size * s[0], tank.size * s[1])
            for(let u=1,l=path.length;u<l;u++) {
              let w = [path[u][0] + x, path[u][1] + y]
              ctx.lineTo(tank.size * (w[0] * cos - w[1] * sin), tank.size * (w[1] * cos + w[0] * sin))
            }
            ctx.lineTo(tank.size * s[0], tank.size * s[1])
          }
          ctx.fill()
          ctx.stroke()
          ctx.closePath()
        }
      },
      getAuraColor: function(aura, color) {
        let c = aura.color
        if(aura.flashColor && render.flash) { c = aura.flashColor }
        c = render.getColor(color, c, aura.colorAverage, color)
        return c
      },
      drawTurret: function(turret, tank) {
        let turretData = {}
        if(turret.id >= 0 && tank.turretData) {
          turretData = tank.turretData[turret.id] || {}
        }
        let a = (turretData.d >= 0 || turretData.d <= 0 ? turretData.d : turret.angle + tank.d)
        let d = ((tank.isTurret ? -tank.tankR : -tank.d) || 0) + a
        let c = tank.renderColor
        if(turret.flashColor && render.flash) { c = turret.flashColor }

        let color = render.getColor(render.barrelColor, c, turret.colorAverage || 0, turret.tankColor)
        render.drawTank({
          x: turret.x * tank.size,
          y: -turret.y * tank.size,
          d: d,
          size: turret.size * tank.size * 0.5,
          color: color,
          radiant: 0,
          sides: turret.sides || 0,
          isTurret: true,
          tankR: tank.isTurret ? a : a,
          barrels: turret.sectionWeapon ? turret.sectionWeapon.barrels : turret.barrels || [],
          turrets: turret.sectionBody ? turret.sectionBody.turrets : [],
          highlight: 0,
          turretData: tank.turretData
        })
      },
      drawAura: function(polygon, rotate, _0) {
        if(polygon.radiant > 0) {
          let particle = !('fadeTime' in polygon)
          let alpha = particle ? (polygon.alpha || 0) : (polygon.fadeTime < 1 ? polygon.fadeTime : 2 - polygon.fadeTime)
          let sides = polygon.outerSides || polygon.sides
          let layers = particle ? 1 : (polygon.radiant < 3 ? polygon.radiant : 3)
          for(let i=0;i<layers;i++) {
            let u = (i % 2 === 0 ? _0 : 1 - _0)
            render.darknessPolygon({
              x: polygon.x,
              y: polygon.y,
              size: (polygon.size + (particle ? 10 : 100)) * (1 + 0.3 * i + 0.1 * u) * (1 + layers * 0.25),
              sides: sides,
              d: polygon.d,
              alpha: particle ? (polygon.alpha * 0.1) : (0.05 * alpha * (1 - i / 5) * (1 + layers * 1.5))
            }, rotate)
          }
        }
      },
      noElements: [],
      selfStealthFloor: 0.15,
      stealthAlpha: function(tank) {
        if(tank.stealthFrame !== render.now) {
          tank.stealthFrame = render.now
          let target = 1 - (tank.stealth || 0)
          let shown = tank.stealthShown >= 0 ? tank.stealthShown : target
          tank.stealthShown = shown + (target - shown) * 0.2
        }
        if(tank === gameData.me && tank.stealthShown < render.selfStealthFloor) {
          return render.selfStealthFloor
        }
        return tank.stealthShown
      },
      drawTank: function(tank) {
        if(tank.invisible) {
          return
        }
        render.drawTankRaw(tank, tank.visualElements, tank.weaponVisualElements, tank.color, tank.radiant, tank.damageFlash, tank.invincible, tank.highlight, tank.isTurret, tank.x, tank.y, tank.d)
      },
      drawTankRaw: function(tank, visualElements, weaponVisualElements, color, radiant, damageFlash, invincible, highlight, isTurret, x, y, d) {
        let e = visualElements || render.noElements
        if(weaponVisualElements && weaponVisualElements.length) {
          e = e.length ? e.concat(weaponVisualElements) : weaponVisualElements
        }
        let transform = ctx.getTransform()
        color = render.getRadiantColor(color, radiant)
        if(tank) {
          tank.renderColor = color
        }
        if(tank.damageFlash > 0.05) {
          color = render.lighten(color, damageFlash * (60 + 5 * (2 * Math.random() - 1)))
        }
        if(invincible) {
          color = render.averageColors(color, { r:255, g:255, b:255 }, (1 + Math.sin(render.now / 25)) * 0.1)
        }
        if(highlight) {
          color = render.averageColors(color, { r:255, g:255, b:0 }, 0.2 + 0.1 * (1 + Math.sin(render.now / 300)))
          if(highlight === 2) { ctx.globalAlpha = 0.5 * render.drawAlpha }
        }
        if(isTurret) {
          ctx.translate(x, y)
          ctx.rotate(d)
        } else if(!highlight) {
          ctx.translate(x, y)
          ctx.rotate(d)
          render.scaleFade(tank.fadeTime)
        }
        if(tank.code && render.drawCodeTank(tank, color)) {
          ctx.setTransform(transform)
          if(ctx.globalAlpha !== render.drawAlpha) { ctx.globalAlpha = render.drawAlpha }
          return
        }
        if(tank.outerSize && tank.outerSides >= 0 && tank.sides !== 1) {
          let s = 0
          if (tank.outerSides && tank.outerSides !== 8 && tank.outerSides !== 4 && tank.outerSides !== 0) {
            s = Math.PI / tank.outerSides
          }
          render.drawRegularPolygon({
            sides: tank.outerSides,
            size: tank.outerSize * tank.size,
            color: render.spikeColor,
            d: s
          });
        }
        for(let i=0,l=e.length;i<l;i++) {
          let element = e[i]
          if(element.renderUnderBarrels) {
            render.drawElement(element, tank, color)
          }
        }
        if(tank.barrels && tank.barrels[0]) {
          for(let i=0,l=tank.barrels.length;i<l;i++) {
            let barrel = tank.barrels[i]
            render.drawBarrel({
              type: barrel.type,
              visualType: barrel.visualType,
              x: -barrel.x * tank.size,
              y: -barrel.y * tank.size,
              d: barrel.d,
              w: barrel.width * tank.size * 2,
              h: barrel.height * tank.size * 2,
              v: barrel.recoilLeader ? barrel.recoilLeader.v : barrel.v,
              recoilBase: barrel.recoilLeader ? barrel.recoilBase * tank.size : undefined,
              highlight: highlight ? highlight : 0,
              tankColor: color,
              color: barrel.color,
              colorAverage: barrel.colorAverage,
              flashColor: barrel.flashColor,
              customBarrel: barrel.customBarrel
            })
          }
        }
        for(let i=0,l=e.length;i<l;i++) {
          let element = e[i]
          if(element.renderWithBarrels) {
            render.drawElement(element, tank, color)
          }
        }
        let drawTurret = render.drawTurret
        if(true) {
          if(tank.weaponTurrets && tank.weaponTurrets[0]) {
            for(let i=0,l=tank.weaponTurrets.length;i<l;i++) {
              let turret = tank.weaponTurrets[i]
              drawTurret(turret, tank)
            }
          }
        }
        if(tank.sides >= 0) {
          render.drawRegularPolygon({
            sides: tank.sides,
            star: tank.star,
            size: tank.size,
            color: color,
            d: (tank.sides !== 8 && tank.sides !== 4 && tank.sides !== 0) ? Math.PI / tank.sides : 0
          });
        }
        for(let i=0,l=e.length;i<l;i++) {
          let element = e[i]
          if(!element.renderWithBarrels && !element.renderUnderBarrels) {
            render.drawElement(element, tank, color)
          }
        }
        if(true) {
          if(tank.turrets && tank.turrets[0]) {
            for(let i=0,l=tank.turrets.length;i<l;i++) {
              let turret = tank.turrets[i]
              drawTurret(turret, tank)
            }
          } if(tank.auras && tank.auras[0]) {
            for(let i=0,l=tank.auras.length;i<l;i++) {
              let aura = tank.auras[i]
              if(!aura.hideBase) {
                let size = aura.size * tank.size
                let d2 = (aura.rotate ? 0 : -d) + (aura.d || 0) + (aura.rotationSpeed ? Math.PI * ((render.now / 500 * aura.rotationSpeed) % 2) : 0)
                let r = render.getAuraColor(aura, color)
                let base = render.barrelColor, c = render.averageColors(r, render.spikeColor, tank.passiveFade)

                render.drawRegularPolygon({
                  sides: aura.sides,
                  size: size,
                  color: base,
                  d: d2,
                  x: aura.x * tank.size,
                  y: -aura.y * tank.size
                });
                render.drawRegularPolygon({
                  sides: aura.innerSides,
                  size: aura.innerSize * size,
                  color: c,
                  d: d2,
                  x: aura.x * tank.size,
                  y: -aura.y * tank.size
                });
              }
            }
          }
        }
        if(tank.weaponVisualElements) {
          for(let i=0,l=tank.weaponVisualElements.length;i<l;i++) {
            let element = tank.weaponVisualElements[i]
            if(!element.renderWithBarrels) {
              render.drawElement(element, tank, color)
            }
          }
        }

        ctx.setTransform(transform)
        if(ctx.globalAlpha !== render.drawAlpha) { ctx.globalAlpha = render.drawAlpha }
      },
      drawAuras: function(tank, k) {
        if(tank.invisible) {
          return
        }
        let transform = ctx.getTransform()
        let sin = Math.sin(tank.d)
        let cos = Math.cos(tank.d)
        render.scaleFade(tank.fadeTime, false)
        if(tank.auras && tank.auras[0]) {
          for(let i=0,l=tank.auras.length;i<l;i++) {
            let aura = tank.auras[i]
            let r = render.getAuraColor(aura, tank.renderColor)
            let auraX = tank.x + tank.size * (aura.x * cos + aura.y * sin)
            let auraY = tank.y + tank.size * (aura.x * sin - aura.y * cos)
            let size = aura.auraSize * tank.size
            if(!tank.passive && render.inFOV({ x: auraX, y: auraY, size: size + 20 })) {
              let particles = render.round(render.particles * size * 0.003) * (aura.particles >= 0 ? aura.particles : 1)
              for(let u=0;u<particles;u++) {
                let a = Math.random() * 2 * Math.PI
                let sin = Math.sin(a), cos = Math.cos(a)
                let ir = Math.random()
                let m = Math.random() * 2 * Math.PI
                let msin = Math.sin(m), mcos = Math.cos(m)
                ir = (1 - ir * ir) * (size - 5)
                let x = auraX + sin * ir, y = auraY + cos * ir
                render.particlesOver.push(render.createParticle({
                  ox: x,
                  oy: y,
                  nx: x + msin * 10,
                  ny: y + mcos * 10,
                  size: 5,
                  d: 1 / 20,
                  fade: 10,
                  color: r,
                  maxAlpha: 0.2
                }))
              }
            }
            let al = render.slide(aura.alpha, 0.1, tank.passiveFade)
            let d = (aura.rotate ? tank.d : 0) + (aura.d || 0) + (aura.rotationSpeed ? Math.PI * ((render.now / 500 * aura.rotationSpeed) % 2) : 0)
            render.drawRegularPolygon({
              sides: aura.innerSides,
              size: size,
              color: render.averageColors(r, render.passiveColor, tank.passiveFade),
              alpha: al,
              x: auraX,
              y: auraY,
              d: d,
              strokeAlpha: al < 0.9 ? 0.1 + al : 1
            }, 3.5);
            if(render.darkness > 0 && k) {
              let r = k * 1.5
              render.darknessPolygon({
                x: auraX,
                y: auraY,
                size: size * r + 5,
                sides: aura.innerSides,
                d: d,
                alpha: 1 - tank.passiveFade
              }, true)
              r *= 2
              render.darknessPolygon({
                x: auraX,
                y: auraY,
                size: size * r + 5,
                sides: aura.innerSides,
                d: d,
                alpha: 0.15 * (1 - tank.passiveFade)
              }, true)
            }
          }
        }
        ctx.setTransform(transform)
      },
