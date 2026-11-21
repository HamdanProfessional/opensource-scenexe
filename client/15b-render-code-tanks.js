      codeTanks: {},
      codeTank: function(name) {
        let entry = render.codeTanks[name]
        if(entry !== undefined) { return entry }
        render.codeTanks[name] = null
        let retry = function() {
          setTimeout(function() { delete render.codeTanks[name] }, 30000)
        }
        fetch('/tankcode?n=' + encodeURIComponent(name), { cache: 'no-cache' }).then(function(r) { return r.ok ? r.json() : null }).then(function(tree) {
          if(tree && Array.isArray(tree.render)) {
            render.codeTanks[name] = render.prepareCode(tree)
          } else {
            retry()
          }
        }).catch(retry)
        return null
      },
      codeColor: function(c) {
        if(typeof c !== 'number') { return c }
        return { r: (c >> 16) & 255, g: (c >> 8) & 255, b: c & 255 }
      },
      prepareCode: function(tree) {
        let flatten = function(list) {
          let items = []
          let walk = function(nodes, parent, layer) {
            for(let i=0,l=nodes.length;i<l;i++) {
              let node = nodes[i]
              let item = { node: node, parent: parent, layer: node.t === 'section' ? node.layer : layer }
              if(node.color !== undefined) { node.rgb = render.codeColor(node.color) }
              if(node.strokeColor >= 0) { node.strokeRgb = render.codeColor(node.strokeColor) }
              if(node.passiveColor !== undefined) { node.passiveRgb = render.codeColor(node.passiveColor) }
              if(node.gradient) {
                node.gradientRgb = node.gradient.map(function(g) { return [g[0], render.rgb(render.codeColor(g[1]))] })
              }
              items.push(item)
              if(node.t === 'section') {
                walk(node.children, items.length - 1, node.layer)
              }
            }
          }
          walk(list, -1, 0)
          let order = []
          for(let i=0,l=items.length;i<l;i++) {
            if(items[i].node.t !== 'section') { order.push(i) }
          }
          order.sort(function(a, b) { return items[a].layer - items[b].layer || a - b })
          return {
            items: items,
            order: order,
            frames: items.map(function() { return { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, x: 0, y: 0, angle: 0, k: 1, color: null } })
          }
        }
        return {
          name: tree.name,
          rgb: render.codeColor(tree.color),
          reach: tree.reach,
          shots: tree.shots,
          main: flatten(tree.render),
          looks: tree.looks.map(flatten)
        }
      },
      codeFill: function(rgb, inherited, top) {
        if(rgb === undefined || rgb === 'inherit') { return inherited }
        if(rgb === 'inherit-top') { return top }
        return rgb
      },
      codeWrap: function(a) {
        a = a % (2 * Math.PI)
        if(a > Math.PI) { a -= 2 * Math.PI }
        if(a < -Math.PI) { a += 2 * Math.PI }
        return a
      },
      drawCodeTree: function(flat, tank, scale, color, facing, base) {
        let items = flat.items, frames = flat.frames, time = render.now / 1000
        let top = { a: base.a, b: base.b, c: base.c, d: base.d, e: base.e, f: base.f, x: 0, y: 0, angle: 0, k: 1, color: color }
        for(let i=0,l=items.length;i<l;i++) {
          let item = items[i], node = item.node
          if(node.t !== 'section') { continue }
          let p = item.parent >= 0 ? frames[item.parent] : top
          let f = frames[i]
          let ps = Math.sin(p.angle), pc = Math.cos(p.angle)
          f.x = p.x + p.k * (node.x * pc - node.y * ps)
          f.y = p.y + p.k * (node.x * ps + node.y * pc)
          f.k = p.k * node.size
          let free = node.relative === 'none', angle
          if(node.turn === 'constant') {
            let spin = node.d + node.speed * time
            angle = free ? spin - facing : p.angle + spin
          } else if(node.turn === 'mouse') {
            angle = node.d
          } else if(node.turn === 'auto') {
            angle = p.angle + node.rest
          } else {
            angle = free ? node.d - facing : p.angle + node.d
          }
          let synced = node.sync >= 0 && tank.turretData && tank.turretData[tank._turrets.length + node.sync]
          if(synced && (synced._d >= 0 || synced._d <= 0)) {
            if(synced.codeFrame !== render.now) {
              synced.codeFrame = render.now
              let miss = render.codeWrap(synced._d - facing + Math.PI / 2 - angle)
              synced.codeOffset = synced.codeOffset === undefined ? miss : synced.codeOffset + render.codeWrap(miss - synced.codeOffset) * 0.2
            }
            angle += synced.codeOffset
          }
          f.angle = angle
          f.color = render.codeFill(node.rgb, p.color, color)
          let s = Math.sin(f.angle), c = Math.cos(f.angle), tx = f.x * scale, ty = f.y * scale
          f.a = base.a * c + base.c * s
          f.b = base.b * c + base.d * s
          f.c = base.c * c - base.a * s
          f.d = base.d * c - base.b * s
          f.e = base.a * tx + base.c * ty + base.e
          f.f = base.b * tx + base.d * ty + base.f
        }
        let order = flat.order
        ctx.lineJoin = ctx.lineCap = 'round'
        for(let i=0,l=order.length;i<l;i++) {
          let item = items[order[i]], node = item.node
          let f = item.parent >= 0 ? frames[item.parent] : top
          ctx.setTransform(f.a, f.b, f.c, f.d, f.e, f.f)
          let k = f.k * scale
          let fill = render.codeFill(node.rgb, f.color, color)
          if(node.t === 'polygon') {
            render.drawCodePolygon(node, k, fill)
          } else if(node.t === 'barrel') {
            render.drawCodeBarrel(node, k, fill)
          } else if(node.t === 'path') {
            render.drawCodePath(node, k, fill)
          } else if(node.t === 'aura') {
            render.drawCodeAura(node, k, fill, tank)
          }
        }
      },
      codeStroke: function(node, fill) {
        if(node.lineWidth === 0 || node.strokeAlpha === 0) { return false }
        ctx.lineWidth = node.lineWidth > 0 ? node.lineWidth : render.lineWidth
        ctx.strokeStyle = render.rgb(node.strokeRgb || render.darken(fill, node.stroke >= 0 ? node.stroke : 30), node.strokeAlpha >= 0 ? node.strokeAlpha : 1)
        return true
      },
      codeShape: function(sides, inner, r, x, y, d) {
        ctx.beginPath()
        if(sides === 0 || sides === 1 || sides === 2 || sides === -1) {
          ctx.arc(x, y, r, 0, 2 * Math.PI)
          return
        }
        if(sides > 0) {
          for(let i=0;i<sides;i++) {
            let a = d + 2 * Math.PI * i / sides
            ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a))
          }
        } else {
          let points = -sides, ir = r * inner
          for(let i=0;i<points;i++) {
            let a = d + 2 * Math.PI * i / points, b = a + Math.PI / points
            ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a))
            ctx.lineTo(x + ir * Math.cos(b), y + ir * Math.sin(b))
          }
        }
        ctx.closePath()
      },
      drawCodePolygon: function(node, k, fill) {
        let r = node.size * k
        if(r <= 0) { return }
        let x = node.x * k, y = node.y * k
        render.codeShape(node.sides, node.inner, r, x, y, node.d)
        if(node.gradientRgb) {
          let g = ctx.createRadialGradient(x, y, 0, x, y, r)
          for(let i=0,l=node.gradientRgb.length;i<l;i++) {
            g.addColorStop(node.gradientRgb[i][0], node.gradientRgb[i][1])
          }
          ctx.fillStyle = g
        } else {
          ctx.fillStyle = render.rgb(fill)
        }
        ctx.fill()
        if(render.codeStroke(node, fill)) { ctx.stroke() }
      },
      drawCodeBarrel: function(node, k, fill) {
        let shape = render.barrelData[node.shape]
        if(!shape || !shape[0]) { return }
        let s = Math.sin(node.d), c = Math.cos(node.d)
        let bx = (node.x * c - node.y * s) * k, by = (node.x * s + node.y * c) * k
        let w = 2 * node.w * k, h = 2 * node.h * k
        ctx.beginPath()
        let parts = shape[0].points
        for(let i=0,l=parts.length;i<l;i++) {
          let part = parts[i]
          for(let j=0,m=part.length;j<m;j++) {
            let along = part[j][1] * h, side = part[j][0] * w
            let px = bx + along * c - side * s, py = by + along * s + side * c
            if(j === 0) { ctx.moveTo(px, py) } else { ctx.lineTo(px, py) }
          }
          ctx.closePath()
        }
        ctx.fillStyle = render.rgb(fill)
        ctx.fill('evenodd')
        if(render.codeStroke(node, fill)) { ctx.stroke() }
      },
      drawCodePath: function(node, k, fill) {
        let points = node.points
        ctx.beginPath()
        for(let i=0,l=points.length;i<l;i++) {
          let p = points[i]
          if(p[2] || i === 0) { ctx.moveTo(p[0] * k, p[1] * k) } else { ctx.lineTo(p[0] * k, p[1] * k) }
        }
        ctx.closePath()
        ctx.fillStyle = render.rgb(fill)
        ctx.fill()
        if(render.codeStroke(node, fill)) { ctx.stroke() }
      },
      drawCodeAura: function(node, k, fill, tank) {
        let x = node.x * k, y = node.y * k
        if(!node.hideAura && node.size > 0) {
          let passive = tank.passiveFade || 0
          let pc = render.codeFill(node.passiveRgb, fill, fill)
          let alpha = render.slide(node.alpha, node.passiveAlpha, passive)
          render.codeShape(node.sides, 0.5, node.size * k, x, y, 0)
          if(node.inner > 0) {
            ctx.moveTo(x + node.inner * k, y)
            ctx.arc(x, y, node.inner * k, 0, 2 * Math.PI, true)
          }
          ctx.fillStyle = render.rgb(render.averageColors(fill, pc, passive), alpha)
          ctx.fill()
        }
        if(!node.hideBase && node.baseSize > 0) {
          render.codeShape(node.baseSides, 0.5, node.baseSize * k, x, y, 0)
          ctx.fillStyle = render.rgb(fill)
          ctx.fill()
          ctx.lineWidth = render.lineWidth
          ctx.strokeStyle = render.rgb(render.darken(fill))
          ctx.stroke()
        }
      },
      codeShot: function(tank, barrelId) {
        if(!tank || !tank.code) { return null }
        let code = render.codeTank(tank.code)
        if(!code) { return null }
        return code.shots[barrelId - tank._barrels.length] || null
      },
      drawCodeBullet: function(bullet) {
        let code = render.codeTank(bullet.code)
        let look = code && code.looks[bullet.codeLook]
        if(!look) { return false }
        let m = ctx.getTransform()
        render.scaleFade(bullet.fadeTime, false)
        ctx.translate(bullet.x, bullet.y)
        ctx.rotate(bullet.d)
        let t = ctx.getTransform()
        let base = { a: t.c, b: t.d, c: -t.a, d: -t.b, e: t.e, f: t.f }
        render.drawCodeTree(look, bullet, bullet.size, bullet.color, (bullet.d || 0) + Math.PI / 2, base)
        ctx.setTransform(m)
        if(ctx.globalAlpha !== render.drawAlpha) { ctx.globalAlpha = render.drawAlpha }
        return true
      },
      drawCodeTank: function(tank, color) {
        let code = render.codeTank(tank.code)
        if(!code) { return false }
        let m = ctx.getTransform()
        let base = { a: m.c, b: m.d, c: -m.a, d: -m.b, e: m.e, f: m.f }
        render.drawCodeTree(code.main, tank, tank.size, color || code.rgb, (tank.d || 0) + Math.PI / 2, base)
        ctx.setTransform(m)
        return true
      },
