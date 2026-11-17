      staticCamera: true,
      chat: true,
      lineWidth: 5,
      radiantStyle: (function() {
        const style = document.createElement('style')
        document.body.appendChild(style)
        return style
      })(),
      showUpgrades: false,
      clientTickTime: 0,
      serverTickTime: 0,
      _serverTickTime: 0,
      style: function(element, styles) {
        for(let key in styles) { element.style[key] = styles[key] }
        return element
      },
      lastTank: false,
      flash: false,
      quality: 1,
      rq: 1,
      autoRes: true,
      autoScale: 1,
      autoGood: 0,
      bestFps: 0,
      lastAutoCheck: 0,
      particles: 1,
      opacity: { tanks: 1, bullets: 1, polygons: 1, hud: 1 },
      drawAlpha: 1,
      showGrid: true,
      customGrid: { on: false, hex: '#c8c8c8', r: 200, g: 200, b: 200, a: 1 },
      gridLines: function(lines) {
        const c = render.customGrid
        if(!c.on) { return lines }
        return {
          r: lines.r + (c.r - lines.r) * c.a,
          g: lines.g + (c.g - lines.g) * c.a,
          b: lines.b + (c.b - lines.b) * c.a
        }
      },
      damageFlash: true,
      screenShake: true,
      extrapolate: true,
      cameraSmooth: 15,
      darkness: 0,
      unusedUpgrades: 0,
      hudOpacity: 1,
      f: 1,
      wallColor: { r:0, g:0, b:0 },
      wallOpacity: 1,
      lastRadiant: 0,
      round: function(n) {
        if(render.f < 1) {
          n = n * render.f
        }
        let f = Math.floor(n)
        let r = n - f
        if(r === 0 || Math.random() > r) { return f }
        return f + 1
      },
      getColor: function(c, c2, v, v2) {
        if(v !== 0 && c2) {
          let r = false
          if(c2 === 'inherit') {
            r = v2 || c
          } if(c2 === 'spike') {
            r = render.spikeColor
          } else if(c2 === 'barrel') {
            r = render.barrelColor
          } else if(c2 === 'radiant') {
            r = render.radiantColor
          } else if(c2.r >= 0 && c2.g >= 0 && c2.b >= 0) {
            r = {
              r: c2.r < 255 ? c2.r : 255,
              g: c2.g < 255 ? c2.g : 255,
              b: c2.b < 255 ? c2.b : 255
            }
          }
          if(r) {
            if(v < 1) {
              c = render.averageColors(c, r, v)
            } else {
              c = r
            }
          }
        }
        return c || { r:0, g:0, b:0 }
      },
      portalParticles: function(wormhole) {
        if(!render.inFOV({ x: wormhole.x, y: wormhole.y, size: wormhole.size * 2 + 120 })) {
          return
        }
        let r = wormhole.size
        for(let i=0,l=render.round(40 * render.particles);i<l;i++) {
          let a = Math.random() * 2 * Math.PI, sin = Math.sin(a), cos = Math.cos(a), s = 5 + r / 3 * Math.random(), k = r - s, d = 50 + 50 * Math.random() + k
          render.particlesOver.push(render.createParticle({
            ox: wormhole.x + sin * k,
            oy: wormhole.y + cos * k,
            nx: wormhole.x + sin * d,
            ny: wormhole.y + cos * d,
            size: s,
            d: 1 / 50,
            fade: 20,
            color: wormhole.color,
            radiant: wormhole.cRadiant,
            sides: 4,
            alpha: 1,
            rotate: false
          }))
        }
      },
      tankSpawnParticles: function(tank, o) {
        if(tank.invisible || (firstUpdate && !o) || !render.inFOV({ x: tank.x, y: tank.y, size: tank.size + 470 })) {
          return
        }
        let r = tank.size
        for(let i=0,l=render.round(40 * render.particles);i<l;i++) {
          let a = Math.random() * 2 * Math.PI, sin = Math.sin(a, 1), cos = Math.cos(a, 1), s = 5 + r / 3 * Math.random(), k = r - s, d = 50 + 50 * Math.random() + k
          render.particlesOver.push(render.createParticle({
            ox: tank.x + sin * k,
            oy: tank.y + cos * k,
            nx: tank.x + sin * d,
            ny: tank.y + cos * d,
            size: s,
            d: 1 / 70,
            fade: 50,
            color: tank.color,
            radiant: tank.radiant,
            alpha: 1
          }))
        }
        if(render.darkness > 0) {
          for(let i=0,l=render.round(50 * render.darkness * render.particles);i<l;i++) {
            let a = Math.random() * 2 * Math.PI, sin = Math.sin(a, 1), cos = Math.cos(a, 1), s = 5 + 10 * Math.random(), k = r - s, d = 200 + 250 * Math.random() + k
            render.particlesOver.push(render.createParticle({
              ox: tank.x + sin * k,
              oy: tank.y + cos * k,
              nx: tank.x + sin * d,
              ny: tank.y + cos * d,
              size: s,
              d: 1 / 90,
              fade: 20,
              color: tank.color,
              radiant: tank.radiant,
              alpha: 1,
              sides: Math.random() < 0.5 ? 4 : -1
            }))
          }
        }
      },
      getRadiantMultiplier: function(radiant) {
        let radiantMultiplier = 1
        if(radiant > 0) {
          radiantMultiplier = (radiant >= 1 ? 25 : Math.pow(25, radiant))
          if(radiant > 1) {
            radiantMultiplier *= Math.pow(4, radiant - 1)
          }
        }
        return radiantMultiplier
      },
      formatPacketSize: function(size) {
        size /= 1000
        let whole = Math.floor(size)
        let part = '' + Math.round((size - whole) * 100)
        let length = part.length
        if(length > 2) {
          part = part.slice(0, 2)
        } else if(length < 2) {
          part += ['00', '0'][length]
        }
        return `${whole}.${part}`
      },
      particlesOver: [],
      particlesUnder: [],
      createParticle: function(options) {
        return {
          x: options.ox,
          y: options.oy,
          ox: options.ox,
          oy: options.oy,
          nx: options.nx,
          ny: options.ny,
          dt: options.d,
          d: Math.random() * 2 * Math.PI,
          sides: options.sides || 0,
          alpha: options.alpha || 0,
          maxAlpha: options.maxAlpha || 1,
          fade: options.fade * options.d,
          fadeD: 1 / options.fade,
          size: options.size,
          rotate: options.rotate === false ? false : true,
          t: 0,
          color: options.color,
          radiant: options.radiant || 0,
          type: options.type || 0
        }
      },
      particleCount: 0,
      drawParticle: function(particle, list, f) {
        particle.t += particle.dt * f
        if(particle.t >= 1) {
          let i = list.indexOf(particle)
          if(i >= 0) {
            list.splice(i, 1)
          }
          return
        }
        let t = particle.t
        if(particle.type === 0) {
          t = 1 - t
          t = 1 - t * t
        }
        particle.x = render.slide(particle.ox, particle.nx, t)
        particle.y = render.slide(particle.oy, particle.ny, t)
        if(render.inFOV(particle)) {
          render.particleCount ++
          if(particle.t >= 1 - particle.fade) {
            particle.alpha -= particle.fadeD * render.f
          } else if(particle.t <= particle.fade) {
            particle.alpha += particle.fadeD * render.f
          } if(particle.alpha < 0) {
            particle.alpha = 0
          } else if(particle.alpha > 1) {
            particle.alpha = 1
          }
          let color = render.getRadiantColor(particle.color, particle.radiant)
          let alpha = particle.alpha * particle.maxAlpha
          if(particle.sides >= 0) {
            render.drawRegularPolygon({
              x: particle.x,
              y: particle.y,
              size: particle.size,
              sides: particle.sides,
              color: color,
              alpha: alpha,
              d: particle.d
            })
            if(particle.sides > 0 && particle.rotate) {
              particle.d += (1 - particle.t) * 0.15 * render.f
            }
          } else {
            render.setFillStroke(color, alpha)
            ctx.beginPath()
            let x = particle.x, y = particle.y, s = particle.size
            if(particle.sides === -1) {
              let d = particle.d, sin = Math.sin(d), cos = Math.cos(d)
              ctx.lineCap = 'round'
              ctx.lineWidth = render.lineWidth
              ctx.moveTo(x + sin * s, y + cos * s)
              ctx.lineTo(x - sin * s, y - cos * s)
              ctx.moveTo(x + cos * s, y - sin * s)
              ctx.lineTo(x - cos * s, y + sin * s)
              particle.d += (1.2 - particle.t) * 0.1 * render.f
            }
            ctx.stroke()
            ctx.closePath()
          }
        } else {
          let i = list.indexOf(particle)
          if(i >= 0) {
            list.splice(i, 1)
          }
        }
      },
      now: performance.now(),
      radiantColor: { r: 255, g: 0, b: 0 },
      barrelColor: { r: 153, g: 153, b: 153 },
      spikeColor: { r: 95, g: 103, b: 108 },
      passiveColor: { r: 127, g: 127, b: 127 },
      teamColors: {
        0: { r: 240, g: 79, b: 84 },
        1: { r: 0, g: 176, b: 225 },
        2: { r: 240, g: 79, b: 84 },
        3: { r: 10, g: 234, b: 118 },
        4: { r: 190, g: 127, b: 245 },
        5: { r:255, g:255, b:255 },
        6: { r: 241, g: 119, b: 221 },
        7: { r: 192, g: 192, b: 192 },
        8: { r: 255, g: 228, b: 107 },
        9: { r: 0, g: 0, b: 0 },
      },
      polygonColors: [
        { r: 255, g: 228, b: 107 },
        { r: 252, g: 118, b: 118 },
        { r: 118, g: 140, b: 252 },
        { r: 252, g: 166, b: 68 },
        { r: 56, g: 183, b: 100 },
        { r: 74, g: 102, b: 189 },
        { r: 93, g: 39, b: 93 },
        { r: 26, g: 28, b: 44 },
        { r: 6, g: 0, b: 17 },
        { r: 64, g: 54, b: 69 },
        { r: 237, g: 237, b: 255 },
        { r: 0, g: 0, b: 0 },
      ],
      getPolygonColor: function(sides) {
        if(sides < 0) {
          return { r:255, g:255, b:255 }
        }
        if (sides < 14) {
          if (sides > 2) {
            return render.polygonColors[sides - 3];
          } else {
            return render.polygonColors[11];
          }
        } else {
          return render.polygonColors[11];
        }
      },
      getPolygonSize: function(sides) {
        if(sides >= 3) {
          return 20 * Math.pow(1.5, sides - 3)
        } else {
          return 50 * Math.pow(1.4, -sides - 1)
        }
      },
      getRadiantName: function(radiant) {
        if(radiant < 1) {
          return ''
        } else if (radiant < 5) {
          return [
            'Radiant',
            'Gleaming',
            'Luminous',
            'Lustrous'
          ][radiant - 1]
        } else {
          return 'Highly Radiant'
        }
      },
      getPolygonName: function(sides) {
        if(sides < 0) {
          return [
            'Tetrahedron',
            'Cube',
            'Octahedron',
            'Dodecahedron',
            'Icosahedron'
          ][-sides - 1]
        }
        if(sides <= 20) {
          return [
            'Triangle',
            'Square',
            'Pentagon',
            'Hexagon',
            'Heptagon',
            'Octagon',
            'Nonagon',
            'Decagon',
            'Hendecagon',
            'Dodecagon',
            'Tridecagon',
            'Tetradecagon',
            'Pentadecagon',
            'Hexadecagon',
            'Heptadecagon',
            'Octadecagon',
            'Nonadecagon',
            'Icosagon'
          ][sides - 3]
        } else {
          return sides
        }
      },
      getFullPolygonName(polygon) {
        let name = render.getPolygonName(polygon.sides)
        if(polygon.radiant < 1) {
          return name
        } else {
          return render.getRadiantName(polygon.radiant) + ' ' + name
        }
      },
      numberEndings: [
        "k",
        "m",
        "b",
        "t",
        "qa",
        "qi",
        "sx",
        "sp",
        "oc",
        "no",
        "dc",
        "ud",
        "dd",
        "td",
        "qad",
        "qid",
        "sxd",
        "spd",
        "ocd",
        "nod",
        "vg",
        "uvg",
        "dvg",
        "tvg",
        "qavg",
        "qivg",
        "sxvg",
        "spvg",
        "ocvg",
        "novg",
        "tg",
        "utg",
        "dtg",
        "ttg",
        "qatg",
        "qitg",
        "sxtg",
        "sptg",
        "octg",
        "notg",
        "qd",
        "uqd",
        "dqd",
        "tqd",
        "qaqd",
        "qiqd",
        "sxqd",
        "spqd",
        "ocqd",
        "noqd",
        "qq",
        "uqq",
        "dqq",
        "tqq",
        "qaqq",
        "qiqq",
        "sxqq",
        "spqq",
        "ocqq",
        "noqq",
        "sg",
        "usg",
        "dsg",
        "tsg",
        "qasg",
        "qisg",
        "sxsg",
        "spsg",
        "ocsg",
        "nosg",
        "st",
        "ust",
        "dst",
        "tst",
        "qast",
        "qist",
        "sxst",
        "spst",
        "ocst",
        "nost",
        "og",
        "uog",
        "dog",
        "tog",
        "qaog",
        "qiog",
        "sxog",
        "spog",
        "ocog",
        "noog",
        "nm",
        "unm",
        "dnm",
        "tnm",
        "qanm",
        "qinm",
        "sxnm",
        "spnm",
        "ocnm",
        "nonm",
        "ct",
        "udct",
      ],
      formatScore: function (score) {
        if(!(score >= 0 || score <= 0)) { return 'NaN' }
        if (score <= 995) {
          return "" + Math.round(score);
        } else if (score <= 1000) {
          return "1k";
        }
        let p = score.toPrecision(3).split('e+')
        p[0] = Math.round(p[0] * 100) * 0.01
        let t = p[1] % 3
        let q = Math.floor(p[1] / 3) - 1
        if(q < 0) {
          return 'NaN'
        }
        let e = render.numberEndings[q]
        if(!e) {
          return 'Infinity'
        }
        return `${(p[0] * [1, 10, 100][t]).toPrecision(3)}${e}`
      },
      fillStrokeCache: new Map(),
      setFillStroke: function (color, alpha, alphaStroke) {
        let a = alpha >= 0 ? alpha : 1
        let as = alphaStroke >= 0 ? alphaStroke : a
        let key = -1
        if(color && (color.r | 0) === color.r && (color.g | 0) === color.g && (color.b | 0) === color.b && color.r >= 0 && color.r < 256 && color.g >= 0 && color.g < 256 && color.b >= 0 && color.b < 256) {
          key = ((color.r * 256 + color.g) * 256 + color.b) * 1048576 + Math.round(a * 1000) * 1024 + Math.round(as * 1000)
          let hit = render.fillStrokeCache.get(key)
          if(hit) {
            ctx.fillStyle = hit[0]
            ctx.strokeStyle = hit[1]
            return
          }
        }
        let fill = render.rgb(color, a)
        let stroke = render.rgb(render.darken(color), as)
        ctx.fillStyle = fill
        ctx.strokeStyle = stroke
        if(key >= 0) {
          if(render.fillStrokeCache.size > 4000) { render.fillStrokeCache.clear() }
          render.fillStrokeCache.set(key, [fill, stroke])
        }
      },
      darken: function (color, a) {
        a = a || 30
        if (color) {
          return {
            r: color.r < a ? 0 : color.r - a,
            g: color.g < a ? 0 : color.g - a,
            b: color.b < a ? 0 : color.b - a,
          };
        } else {
          return { r: 0, g: 0, b: 0 };
        }
      },
      lighten: function (color, amount) {
        if (color) {
          let u = 255 - amount
          return {
            r: color.r > u ? 255 : color.r + amount,
            g: color.g > u ? 255 : color.g + amount,
            b: color.b > u ? 255 : color.b + amount,
          };
        } else {
          return { r: 0, g: 0, b: 0 };
        }
      },
      scaleFade: function(fade, scale) {
        let alpha = fade <= 1 ? fade : 2 - fade
        if(scale !== false) {
          let scale = 1 + (1 - alpha) / 5
          if(scale > 1) {
            ctx.scale(scale, scale)
          }
        } if(alpha < 1) {
          ctx.globalAlpha = alpha * render.drawAlpha
        } else if(ctx.globalAlpha !== render.drawAlpha) {
          ctx.globalAlpha = render.drawAlpha
        }
      },
      rgb: function (color, alpha) {
        if (color) {
          color.r > 255 && (color.r = 255);
          color.g > 255 && (color.g = 255);
          color.b > 255 && (color.b = 255);
          color.a > 1 && (color.a = 1);
          color.r < 0 && (color.r = 0);
          color.g < 0 && (color.g = 0);
          color.b < 0 && (color.b = 0);
          color.a < 0 && (color.a = 0);
          return `rgb${alpha < 1 ? "a" : ""}(${color.r},${color.g},${color.b}${
          alpha < 1 ? `,${alpha}` : ""
        })`;
        } else {
          return `rgba(0, 0, 0, ${alpha >= 0 ? alpha : 1})`;
        }
      },
      averageColors: function (color1, color2, ratio) {
        if (color1 && color2) {
          return {
            r: color1.r + (color2.r - color1.r) * ratio,
            g: color1.g + (color2.g - color1.g) * ratio,
            b: color1.b + (color2.b - color1.b) * ratio,
          };
        } else {
          return color1 || color2 || { r: 0, g: 0, b: 0 };
        }
      },
      grid: gameData.grid,
      formatForHTML: function (string) {
        if(!string || !string.replaceAll) { return '' }
        return string
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll("\n", "<br>");
      },
      defaultWidth: 1920,
      defaultHeight: 1080,
      defaultTransform: false,
      width: 0,
      height: 0,
      scale: 1,
      _scale: 1,
      lw: 0,
      lh: 0,
      resize: function () {
        document.documentElement.scrollTo(0, 0)
        render.lw = window.innerWidth
        render.lh = window.innerHeight
        render.quality = render.rq * (render.autoRes ? render.autoScale : 1) * Math.min(devicePixelRatio || 1, 2)
        render.width =
          gameCanvas.width =
          hudCanvas.width =
          darknessCanvas.width =
          window.innerWidth * render.quality;
        render.height =
          gameCanvas.height =
          hudCanvas.height =
          darknessCanvas.height =
          window.innerHeight * render.quality;
        renderCtx.gameCanvas.translate(render.width / 2, render.height / 2);
        renderCtx.gameCanvas.scale(render.quality * 0.75, render.quality * 0.75);
        renderCtx.darknessCanvas.translate(render.width / 2, render.height / 2);
        renderCtx.darknessCanvas.scale(
          render.quality * 0.75,
          render.quality * 0.75
        );
        renderCtx.hudCanvas.translate(render.width / 2, render.height / 2);
        renderCtx.hudCanvas.scale(render.quality * 0.75, render.quality * 0.75);
        render.width = window.innerWidth;
        render.height = window.innerHeight;
        let w = render.width / render.defaultWidth;
        let h = render.height / render.defaultHeight;
        let r = 1, _r = 1;
        if (w < h) {
          r = render.defaultHeight / render.height;
          _r = render.defaultWidth / render.width;
        } else {
          r = render.defaultWidth / render.width;
          _r = render.defaultHeight / render.height;
        }
        _r *= 1.2
        render.scale = r
        render._scale = _r
        let ir = 1 / r, _ir = 1 / _r;
        renderCtx.gameCanvas.scale(ir, ir);
        renderCtx.darknessCanvas.scale(ir, ir);
        renderCtx.hudCanvas.scale(ir, ir);
        overlay1.style.width = overlay1.style.height = `${100 * r}%`;
        overlay1.style.transform = `scale(${ir})`;
        overlay2.style.width = overlay2.style.height = `${100 * _r}%`;
        overlay2.style.transform = `scale(${_ir})`;
        modals.style.width = modals.style.height = `${100 * _r}%`;
        modals.style.transform = `scale(${_ir})`;
        render.width *= (r * 4) / 3;
        render.height *= (r * 4) / 3;
        render.defaultTransform = renderCtx.gameCanvas.getTransform();
        renderDarknessTransform = renderCtx.darknessCanvas.getTransform();
      },
