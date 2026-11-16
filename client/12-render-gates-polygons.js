      drawGate: function (gate) {
        ctx.lineJoin = ctx.lineCap = "round";
        ctx.lineWidth = render.lineWidth;
        let transform = ctx.getTransform();
        ctx.translate(gate.x, gate.y);
        ctx.rotate(gate.d * Math.PI / 2);
        let now = render.now;
        let w = gate.length
        let d = gate.d * Math.PI / 2
        switch (gate.type) {
          case 0:
            for(let i=0,l=render.round(render.particles * 0.2 * w / 100);i<l;i++) {
              let size = 25 + 10 * Math.random();
              let cos = Math.cos(d);
              let sin = Math.sin(d);
              let r = Math.random() * 2 * (w - size) - w + size;
              let speed = (2 + 2 * Math.random()) * (Math.random() > 0.5 ? 1 : -1);
              let ox = gate.x + r * sin
              let oy = gate.y + r * cos
              render.particlesUnder.push(render.createParticle({
                ox: ox,
                oy: oy,
                nx: ox + cos * speed * 60,
                ny: oy + sin * speed * 60,
                size: size,
                d: 1 / 60,
                fade: 10,
                color: { r: 255, g: 255, b: 255 }
              }))
            }
            now = now / 1500;
            now = now - Math.floor(now);
            for (let i = 0; i < 3; i++) {
              let n = 1 - (now + i) / 3;
              let width = 400 * (1 - Math.pow(n, 2.5));
              render.setFillStroke({ r: 255, g: 255, b: 255 }, n / 10);
              ctx.beginPath();
              ctx.rect(-30 - width / 2, -w, 60 + width, w * 2);
              ctx.fill();
              ctx.stroke();
              ctx.closePath();
            }
            ctx.fillStyle = ctx.strokeStyle = "rgb(0,0,0)";
            ctx.beginPath();
            ctx.rect(-30, -w, 60, w * 2);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            break;
          case 1:
            for(let i=0,l=render.round(render.particles * 0.2 * w / 100);i<l;i++) {
              let size = 25 + 10 * Math.random();
              let cos = Math.cos(d);
              let sin = Math.sin(d);
              let r = Math.random() * 2 * (w - size) - w + size;
              let speed =
                  (1 + Math.random()) *
                  (Math.random() > 0.5 ? 1 : -1) *
                  (gate.open ? 0.5 : 1);
              let ox = gate.x + r * sin
              let oy = gate.y + r * cos
              render.particlesUnder.push(render.createParticle({
                ox: ox,
                oy: oy,
                nx: ox + cos * speed * 75,
                ny: oy + sin * speed * 75,
                size: size,
                d: 1 / 75,
                fade: 10,
                color: { r:0, g:0, b:0 },
                radiant: gate.open ? 0.4286 : 99,
              }))
            }
            let color = render.averageColors(
              { r:0, g:0, b:0 },
              render.radiantColor,
              gate.open ? 0.3 : 0.99
            );
            now = now / 1500;
            now = now - Math.floor(now);
            for (let i = 0; i < 3; i++) {
              let n = 1 - (now + i) / 3;
              let width = 400 * (1 - Math.pow(n, 2.5));
              render.setFillStroke(color, n / 10);
              ctx.beginPath();
              ctx.rect(-30 - width / 2, -w, 60 + width, 2 * w);
              ctx.fill();
              ctx.stroke();
              ctx.closePath();
            }
            render.setFillStroke(color);
            ctx.beginPath();
            ctx.rect(-30, -w, 60, 2 * w);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            break;
          case 2:
            now = now / 2000;
            now = now - Math.floor(now);
            for (let i = 0; i < 3; i++) {
              let n = 1 - (now + i) / 3;
              let width = 200 * (1 - Math.pow(n, 2.5));
              render.setFillStroke({ r: 255, g: 255, b: 255 }, n / 15);
              ctx.beginPath();
              ctx.rect(0, -w, 16 + width, 2 * w);
              ctx.fill();
              ctx.stroke();
              ctx.closePath();
            }
            now += 0.25;
            for (let i = 0; i < 3; i++) {
              let n = (i - now) / 3 + 1;
              n = 1 - n + Math.floor(n);
              let width = 200 * (1 - Math.pow(n, 2.5));
              render.setFillStroke({ r: 255, g: 255, b: 255 }, n / 15);
              ctx.beginPath();
              ctx.rect(-30 - width, -w, 30 + width, 2 * w);
              ctx.fill();
              ctx.stroke();
              ctx.closePath();
            }
            ctx.fillStyle = ctx.strokeStyle = "rgb(0,0,0)";
            ctx.beginPath();
            ctx.rect(-30, -w, 60, 2 * w);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            now = Date.now() / 1000;
            now = now - Math.floor(now);
            ctx.lineWidth = 4;
            for (let i = 0; i < 5; i++) {
              let n = (i - now) / 5 + 1;
              n = n - Math.floor(n);
              let h = Math.cos(n * Math.PI);
              h = -80 * Math.sign(h) * Math.pow(Math.abs(h), 0.45);
              let x = 1.7 * (Math.abs(h) < 40 ? h : (2 * n - 1) * 85 + Math.sign(h) * 28);
              ctx.strokeStyle = render.rgb(
                { r: 255, g: 255, b: 255 },
                (1 - Math.abs(h) / 80) / 1.5
              );
              ctx.beginPath();
              let k = Math.floor((gate.length - 15) / 60)
              for (let u = -k; u <= k; u++) {
                ctx.moveTo(-x - 7.5, 15 + 60 * u);
                ctx.lineTo(7.5 - x, 60 * u);
                ctx.lineTo(-x - 7.5, 60 * u - 15);
              }
              ctx.stroke();
              ctx.closePath();
            }
            break;
          case 3:
            for(let i=0,l=render.round(render.particles * 0.2 * w / 100);i<l;i++) {
              let size = 20 + (gate.open ? 15 : 25) * Math.random();
              let cos = Math.cos(d);
              let sin = Math.sin(d);
              let r = Math.random() * 2 * (w - size) - w + size;
              let speed = (Math.random() < 0.5 ? 1 : -1) * (1 + Math.random()) * (gate.open ? 1 : 2);
              let ox = gate.x + r * sin
              let oy = gate.y + r * cos
              render.particlesUnder.push(render.createParticle({
                ox: ox,
                oy: oy,
                nx: ox + cos * speed * 60,
                ny: oy + sin * speed * 60,
                size: size,
                d: 1 / 60,
                fade: 10,
                color: gate.open
                ? { r: 0, g: 0, b: 0 }
                : { r: 255, g: 255, b: 255 },
              }))
            }
            now = now / 1500;
            now = now - Math.floor(now);
            for (let i = 0; i < 3; i++) {
              let n = 1 - (now + i) / 3;
              let width = 400 * (1 - Math.pow(n, 2.5));
              render.setFillStroke({ r: 0, g: 0, b: 0 }, n / 10);
              ctx.beginPath();
              ctx.rect(-30 - width / 4, -w, 30 + width / 4, 2 * w);
              ctx.fill();
              ctx.stroke();
              ctx.closePath();
            }
            for (let i = 0; i < 3; i++) {
              let n = 1 - (now + i) / 3;
              let width = 400 * (1 - Math.pow(n, 2.5));
              let j = gate.open ? 0 : 255;
              render.setFillStroke({ r: j, g: j, b: j }, n / 10);
              ctx.beginPath();
              ctx.rect(0, -w, 30 + width / (gate.open ? 4 : 2), 2 * w);
              ctx.fill();
              ctx.stroke();
              ctx.closePath();
            }
            ctx.fillStyle = ctx.strokeStyle = "rgb(0, 0, 0)";
            ctx.beginPath();
            ctx.rect(-30, -w, 60, 2 * w);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            now = (render.now / 5000) % (2 * Math.PI);
            let t = ctx.getTransform();
            let k = Math.floor((gate.length - 50) / 50)
            for (let i = -k; i <= k; i++) {
              ctx.setTransform(t);
              ctx.translate(32, 50 * i);
              ctx.rotate(now * (1 - 2 * (i % 2 === 0)));
              render.drawStarShape({
                color: { r: 0, g: 0, b: 0 },
                size1: 8,
                size2: 33,
                sides: 7,
              });
            }
            break;
        }
        ctx.setTransform(transform);
      },
      darknessPolygon: function (polygon, rotate) {
        const ctx = renderCtx.darknessCanvas
        ctx.lineJoin = ctx.lineCap = "round";
        ctx.lineWidth = render.lineWidth;
        let u = polygon.d || 0
        let sides = polygon.sides < 0 ? [3, 6, 6, 10, 6][-polygon.sides - 1] : polygon.sides
        if (rotate && sides && sides != 4 && sides != 8) {
          u += Math.PI / sides;
        }
        let x = polygon.x ? polygon.x : 0
        let y = polygon.y ? polygon.y : 0
        ctx.fillStyle = `rgba(0, 0, 0, ${polygon.alpha >= 0 ? polygon.alpha : 1})`
        ctx.beginPath();
        if (sides === 0 && polygon.size > 2.5) {
          ctx.arc(x, y, polygon.size - render.lineWidth * 0.5, 0, 2 * Math.PI);
        } else {
          for (let i = 0, l = 2 * Math.PI, d = l / sides; i < l; i += d) {
            ctx.lineTo(
              x + (polygon.size) * Math.sin(i + u),
              y - (polygon.size) * Math.cos(i + u)
            );
          }
        }
        ctx.fill();
        ctx.closePath();
      },
      polygonCorners: {},
      drawStar: function (polygon, lw) {
        let points = polygon.star
        let uw = 0.5 * (lw >= 0 ? lw : render.lineWidth)
        ctx.lineJoin = ctx.lineCap = "round";
        ctx.lineWidth = uw * 2;
        render.setFillStroke(polygon.color, polygon.alpha, polygon.strokeAlpha || polygon.alpha)
        let x = polygon.x || 0, y = polygon.y || 0, u = polygon.d || 0, size = polygon.size
        let pinch = size * (1 - 6 / (points * points))
        ctx.beginPath()
        ctx.moveTo(x + size * Math.sin(u), y - size * Math.cos(u))
        for(let k=0;k<points;k++) {
          let mid = u + (k + 0.5) / points * 2 * Math.PI
          let tip = u + (k + 1) / points * 2 * Math.PI
          ctx.quadraticCurveTo(x + pinch * Math.sin(mid), y - pinch * Math.cos(mid), x + size * Math.sin(tip), y - size * Math.cos(tip))
        }
        ctx.closePath()
        if(!polygon.noFill) { ctx.fill() }
        if(!polygon.noStroke) { ctx.stroke() }
      },
      drawRegularPolygon: function (polygon, lw) {
        if(polygon.star >= 3) {
          render.drawStar(polygon, lw)
          return
        }
        if(polygon.sides < 2 && polygon.sides !== 0) { return }
        let uw = 0.5 * (lw >= 0 ? lw : render.lineWidth)
        ctx.lineJoin = ctx.lineCap = "round";
        ctx.lineWidth = uw * 2;
        let u = polygon.d || 0, r = 0
        if(polygon.alpha < 1) {
          r = uw / Math.sin(Math.PI / 2 - Math.PI / polygon.sides);
        }
        let x = polygon.x ? polygon.x : 0
        let y = polygon.y ? polygon.y : 0
        render.setFillStroke(
          polygon.color,
          polygon.alpha,
          polygon.strokeAlpha || polygon.alpha
        );
        let p = Math.abs(1 / polygon.sides) || 0
        if(r === 0 && !polygon.noFill && !polygon.noStroke && (polygon.sides === 0 ? polygon.size > uw : (polygon.sides > 2 && polygon.sides <= 64 && (polygon.sides | 0) === polygon.sides))) {
          ctx.beginPath();
          if (polygon.sides === 0) {
            ctx.arc(x, y, polygon.size, 0, 2 * Math.PI);
          } else {
            let t = render.polygonCorners[polygon.sides]
            if(!t) {
              t = render.polygonCorners[polygon.sides] = []
              for(let k=0;k<polygon.sides;k++) {
                let a = 2 * Math.PI * k / polygon.sides
                t.push(Math.sin(a), Math.cos(a))
              }
            }
            let su = Math.sin(u), cu = Math.cos(u), size = polygon.size
            for(let k=0,l=t.length;k<l;k+=2) {
              let sa = t[k], ca = t[k + 1]
              ctx.lineTo(x + size * (sa * cu + ca * su), y - size * (ca * cu - sa * su));
            }
            ctx.closePath();
          }
          ctx.fill();
          ctx.stroke();
          return
        }
        if(!polygon.noFill) {
          ctx.beginPath();
          if (polygon.sides === 0 && polygon.size > uw) {
            ctx.arc(x, y, polygon.size - (polygon.alpha < 1 ? uw : 0), 0, 2 * Math.PI);
          } else {
            for (let i = 0, l = 2 * Math.PI, d = l * p; i < l; i += d) {
              ctx.lineTo(
                x + (polygon.size - r) * Math.sin(i + u),
                y - (polygon.size - r) * Math.cos(i + u)
              );
            }
          }
          ctx.fill();
          ctx.closePath();
        } if(!polygon.noStroke) {
          ctx.beginPath();
          if (polygon.sides === 0) {
            ctx.arc(x, y, polygon.size, 0, 2 * Math.PI);
          } else {
            let k = Math.sin(u), l = Math.cos(u)
            ctx.moveTo(x + polygon.size * k, y - polygon.size * l);
            for (let j = 2 * Math.PI, i = j * p, d = i; i < j; i += d) {
              ctx.lineTo(x + polygon.size * Math.sin(i + u), y - polygon.size * Math.cos(i + u));
            }
            ctx.lineTo(x + polygon.size * k, y - polygon.size * l);
          }
          ctx.stroke();
          ctx.closePath();
        }
      },
      getRadiantColor: function(color, radiant) {
        return radiant ? render.averageColors(color, render.radiantColor, radiant / (radiant + 1)) : color
      },
      solids: (function() {
        const p = (1 + Math.sqrt(5)) / 2, q = 1 / p
        const sets = {
          '-1': [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]],
          '-2': [[-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, -1], [1, -1, 1], [1, 1, -1], [1, 1, 1]],
          '-3': [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]],
          '-4': [[-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, -1], [1, -1, 1], [1, 1, -1], [1, 1, 1],
            [0, q, p], [0, q, -p], [0, -q, p], [0, -q, -p], [q, p, 0], [q, -p, 0], [-q, p, 0], [-q, -p, 0],
            [p, 0, q], [p, 0, -q], [-p, 0, q], [-p, 0, -q]],
          '-5': [[0, 1, p], [0, 1, -p], [0, -1, p], [0, -1, -p], [1, p, 0], [1, -p, 0], [-1, p, 0], [-1, -p, 0],
            [p, 0, 1], [p, 0, -1], [-p, 0, 1], [-p, 0, -1]]
        }
        const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
        const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
        const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
        const unit = a => { const l = Math.sqrt(dot(a, a)) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
        const out = {}
        for(const k in sets) {
          const v = sets[k].map(unit), faces = [], seen = {}
          for(let i = 0; i < v.length; i++) for(let j = i + 1; j < v.length; j++) for(let m = j + 1; m < v.length; m++) {
            let n = cross(sub(v[j], v[i]), sub(v[m], v[i]))
            if(dot(n, n) < 1e-9) { continue }
            n = unit(n)
            let d = dot(n, v[i])
            if(d < 0) { n = [-n[0], -n[1], -n[2]]; d = -d }
            let on = [], ok = true
            for(let t = 0; t < v.length; t++) {
              const e = dot(n, v[t]) - d
              if(e > 1e-6) { ok = false; break }
              if(e > -1e-6) { on.push(t) }
            }
            if(!ok) { continue }
            const key = on.join(',')
            if(seen[key]) { continue }
            seen[key] = true
            const c = [0, 0, 0]
            for(const t of on) { c[0] += v[t][0] / on.length; c[1] += v[t][1] / on.length; c[2] += v[t][2] / on.length }
            const ax = unit(sub(v[on[0]], c)), ay = cross(n, ax)
            on.sort((A, B) => { const a = sub(v[A], c), b = sub(v[B], c); return Math.atan2(dot(a, ay), dot(a, ax)) - Math.atan2(dot(b, ay), dot(b, ax)) })
            faces.push({ corners: on, normal: n })
          }
          out[k] = { v: v, faces: faces, sx: new Float64Array(v.length), sy: new Float64Array(v.length) }
        }
        return out
      })(),
      solidLight: (function() { const l = Math.sqrt(0.35 * 0.35 + 0.55 * 0.55 + 0.75 * 0.75); return [-0.35 / l, -0.55 / l, 0.75 / l] })(),
      solidMatrix: function(id, d, speed, offset) {
        const seed = ((id || 0) * 2.3999632) % (2 * Math.PI) + (offset || 0), t = render.now * (speed === undefined ? 1 : speed)
        const ta = t * 0.00055 + seed, tb = t * 0.0004 + seed * 1.7, tc = d || 0
        const ca = Math.cos(ta), sa = Math.sin(ta), cb = Math.cos(tb), sb = Math.sin(tb), cc = Math.cos(tc), sc = Math.sin(tc)
        return [cc * cb, cc * sb * sa - sc * ca, cc * sb * ca + sc * sa,
          sc * cb, sc * sb * sa + cc * ca, sc * sb * ca - cc * sa,
          -sb, cb * sa, cb * ca]
      },
      drawPolyhedron: function(polygon, color, alpha) {
        const solid = render.solids[polygon.sides]
        if(!solid) { return false }
        const m = render.solidMatrix(polygon.id, polygon.d)
        const v = solid.v, sx = solid.sx, sy = solid.sy, size = polygon.size
        for(let i = 0, l = v.length; i < l; i++) {
          const p = v[i]
          sx[i] = (m[0] * p[0] + m[1] * p[1] + m[2] * p[2]) * size
          sy[i] = (m[3] * p[0] + m[4] * p[1] + m[5] * p[2]) * size
        }
        const a0 = ctx.globalAlpha
        if(alpha < 1) { ctx.globalAlpha = a0 * alpha }
        const L = render.solidLight, dark = render.darken(color, 110), stroke = render.rgb(render.darken(color))
        ctx.lineJoin = ctx.lineCap = 'round'
        ctx.lineWidth = render.lineWidth
        ctx.strokeStyle = stroke
        for(const f of solid.faces) {
          const n = f.normal
          const nz = m[6] * n[0] + m[7] * n[1] + m[8] * n[2]
          if(nz <= 0.0001) { continue }
          const nx = m[0] * n[0] + m[1] * n[1] + m[2] * n[2], ny = m[3] * n[0] + m[4] * n[1] + m[5] * n[2]
          const lit = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2])
          const c = render.averageColors(color, dark, (1 - lit) * 0.6)
          ctx.fillStyle = render.rgb({ r: Math.round(c.r), g: Math.round(c.g), b: Math.round(c.b) })
          const k = f.corners
          ctx.beginPath()
          ctx.moveTo(sx[k[0]], sy[k[0]])
          for(let i = 1; i < k.length; i++) { ctx.lineTo(sx[k[i]], sy[k[i]]) }
          ctx.closePath()
          ctx.fill()
          ctx.stroke()
        }
        ctx.globalAlpha = a0
        return true
      },
      drawSolidSpikes: function(key, m, base, len, width, color) {
        const v = render.solids[key].v, list = []
        for(let i = 0; i < v.length; i++) {
          const p = v[i]
          list.push([m[0] * p[0] + m[1] * p[1] + m[2] * p[2], m[3] * p[0] + m[4] * p[1] + m[5] * p[2], m[6] * p[0] + m[7] * p[1] + m[8] * p[2]])
        }
        list.sort((a, b) => a[2] - b[2])
        const dark = render.darken(color, 110), stroke = render.rgb(render.darken(color))
        ctx.lineJoin = ctx.lineCap = 'round'
        ctx.lineWidth = render.lineWidth
        ctx.strokeStyle = stroke
        for(const q of list) {
          const r = Math.sqrt(q[0] * q[0] + q[1] * q[1]) || 1e-6
          const px = -q[1] / r * width, py = q[0] / r * width
          const bx = q[0] * base, by = q[1] * base
          const c = render.averageColors(color, dark, (1 - q[2]) * 0.3)
          ctx.fillStyle = render.rgb({ r: Math.round(c.r), g: Math.round(c.g), b: Math.round(c.b) })
          ctx.beginPath()
          ctx.moveTo(q[0] * base * 0.6, q[1] * base * 0.6)
          ctx.lineTo(bx + px, by + py)
          ctx.lineTo(q[0] * len, q[1] * len)
          ctx.lineTo(bx - px, by - py)
          ctx.closePath()
          ctx.fill()
          ctx.stroke()
        }
      },
      drawRadiantSolid: function(options) {
        const R = options.radiant
        if(!(R > 1)) { return }
        const transform = ctx.getTransform()
        ctx.translate(options.x, options.y)
        render.scaleFade(options.fadeTime)
        const rc = render.averageColors(render.getRadiantColor(options.color, R), { r: 255, g: 255, b: 255 }, 0.5)
        const size = options.size, now = render.now
        if(R > 3) {
          const big = size * (1.5 + R / 5 + 0.06 * (1 + Math.sin(now / 4e3 * (1 + R) / 2)) * R)
          render.drawSolidSpikes(-1, render.solidMatrix(options.id, options.d, -0.6 - R * 0.1, 1), size * 0.5, big, size * 0.22, rc)
        }
        if(R > 2) {
          const k = (R + 2) / 10, w = size * 0.16
          const l1 = size * 1.35 * (k * Math.cos(now / 500 + Math.PI) + 1), l2 = size * 1.35 * (k * Math.cos(now / 500) + 1)
          render.drawSolidSpikes(options.sides, render.solidMatrix(options.id, options.d, 1 + R * 0.5, 2), size * 0.55, l1, w, rc)
          render.drawSolidSpikes(options.sides, render.solidMatrix(options.id, options.d, -(1 + R * 0.5), 4), size * 0.55, l2, w, rc)
        }
        const shell = size * (1.2 + 0.1 * (1 + Math.sin(now / 800 * (2 + R) / 4)) * R)
        render.drawPolyhedron({ sides: options.sides, size: shell, d: options.d, id: options.id }, rc, 1 - 0.7 / ((2 + R) / 3))
        ctx.setTransform(transform)
      },
      polygonCount: 0,
      imageCount: 0,
      drawPolygon: function(polygon) {
        let color = polygon.color;
        if (polygon.radiant) {
          color = render.getRadiantColor(color, polygon.radiant)
        }
        polygon.renderColor = color
        if(polygon.damageFlash > 0.05) {
          color = render.lighten(color, polygon.damageFlash * (60 + 5 * (2 * Math.random() - 1)))
        }
        let transform = ctx.getTransform()
        ctx.translate(polygon.x, polygon.y)
        render.scaleFade(polygon.fadeTime)
        if(!(polygon.sides < 0 && render.drawPolyhedron(polygon, color))) {
          render.drawRegularPolygon({
            color: color,
            sides: polygon.sides,
            size: polygon.size,
            d: polygon.d
          });
        }
        ctx.setTransform(transform);
      },
      drawRadiantAura: function (options, rotate, f, m) {
        if(options.invisible || !(options.radiant > 0)) {
          return
        }
        if(!render.inFOV({ x: options.x, y: options.y, w: options.size * 3 + 60, h: options.size * 3 + 60 })) {
          return
        }
        if(options.radiant > 0) {
          if(render.radiantParticles) {
            let k = options.size*0.01*(1+(options.radiant<5?options.radiant*0.2:1))
            for(let i=0,l=render.round(render.particles*(m||1)*(k < 0.5 ? 0.5 : k));i<l;i++) {
              let a = Math.random() * 2 * Math.PI
              let sin = Math.sin(a), cos = Math.cos(a)
              let r = Math.random()
              let m = Math.random() * 2 * Math.PI
              let msin = Math.sin(m), mcos = Math.cos(m)
              r = (1 - r * r) * (options.size - 5)
              let x = options.x + sin * r, y = options.y + cos * r
              let size = options.size * 0.0003 + options.radiant + 0.03
              if(size > 5) { size = 5 + (size - 5) * 0.1 }
              if(size > 10) { size = 10 + (size - 10) * 0.1 }
              render.particlesOver.push(render.createParticle({
                ox: x,
                oy: y,
                nx: x + msin * 15,
                ny: y + mcos * 15,
                size: 5 + (5 * Math.random()) * size,
                d: 1 / 40,
                fade: 20,
                color: options.color,
                radiant: options.radiant,
                maxAlpha: 1
              }))
            }
          }
          render.drawRadiantShapes(options, rotate, f)
        }
      },
      drawRadiantShapes: function(options, rotate, f) {
        if(options.sides < 0 && render.solids[options.sides]) { return render.drawRadiantSolid(options) }
        {
          if (options.radiant > 1) {
            let o = {
              sides: options.outerSides >= 0 ? options.outerSides : (options.sides < 0 ? [3, 6, 6, 10, 6][-options.sides - 1] || 0 : options.sides),
              outerSides: options.outerSides,
              size: options.size,
              outerSize: options.outerSize < 1 ? 1 : options.outerSize,
            };
            let transform = ctx.getTransform()
            ctx.translate(options.x, options.y)
            ctx.rotate(options.d)
            render.scaleFade(options.fadeTime)
            let radiantColor = render.getRadiantColor(options.color, options.radiant)
            radiantColor = render.averageColors(
              radiantColor,
              { r: 255, g: 255, b: 255 },
              0.5
            );
            let outerSize = o.size * (o.outerSize || 1),
                sides = o.outerSides || o.sides,
                r = false;
            if (sides && rotate && (!f || (sides !== 4 && sides !== 8))) {
              ctx.rotate(Math.PI / sides);
            }
            render.drawRegularPolygon({
              color: radiantColor,
              sides: o.outerSides >= 0 ? o.outerSides : o.sides,
              size:
              outerSize *
              (1.2 +
               0.1 *
               (1 + Math.sin((render.now / 800) * ((2 + options.radiant) / 4))) *
               options.radiant),
              alpha: 1 - 0.7 / ((2 + options.radiant) / 3),
            });
            if (options.radiant > 2) {
              if (options.radiant > 3) {
                let transform = ctx.getTransform();
                ctx.rotate(
                  (((20 * Math.cos(render.now / 25e3) * (1 + options.radiant)) / 2) %
                   (2 * Math.PI)) -
                  options.d
                );
                let size =
                    1.5 +
                    options.radiant / 5 +
                    0.06 *
                    (1 + Math.sin((render.now / 4e3) * ((1 + options.radiant) / 2))) *
                    options.radiant;
                render.drawStarShape({
                  size1: outerSize * size,
                  size2: 0.4 * outerSize,
                  color: radiantColor,
                  sides: 3,
                });
                ctx.setTransform(transform);
              }
              let d = ((render.now / 2e3) * (1 + options.radiant)) % (12 * Math.PI);
              ctx.rotate(d / 2 - options.d);
              let size = (options.radiant + 2) / 10;
              let size1 =
                  outerSize * (size * Math.cos(render.now / 500 + Math.PI) + 1);
              let size2 = outerSize * (size * Math.cos(render.now / 500) + 1);
              sides = 6;
              let s2 = 2 + (o.sides >= 3 && o.sides < 6 ? 6 - o.sides : 0) / 2;
              render.drawStarShape({
                size1: size1,
                size2: size1 / s2,
                color: radiantColor,
                sides: sides,
              });
              ctx.rotate(-d);
              render.drawStarShape({
                size1: size2,
                size2: size2 / s2,
                color: radiantColor,
                sides: sides,
              });
            }
            ctx.setTransform(transform);
          }
        }
      },
      drawStarShape: function (options) {
        ctx.lineJoin = ctx.lineCap = "round";
        ctx.lineWidth = render.lineWidth;
        ctx.beginPath();
        for (let i = 0, l = 2 * Math.PI, d = l / options.sides; i < l; i += d) {
          ctx.lineTo(options.size1 * Math.sin(i), -options.size1 * Math.cos(i));
          ctx.lineTo(
            options.size2 * Math.sin(i + d / 2),
            -options.size2 * Math.cos(i + d / 2)
          );
        }
        ctx.lineTo(0, -options.size1);
        render.setFillStroke(options.color, options.alpha);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      },
      barrelData: {
        0: [
          { points: [[[-0.5, 0], [-0.5, 1], [0.5, 1], [0.5, 0]]] }
        ], 1: [
          { points: [[[-0.25, 0], [-0.25, 0.75], [-0.5, 1], [0.5, 1], [0.25, 0.75], [0.25, 0]], [[0.25, 0.75], [-0.25, 0.75]]] }
        ], 2: [
          { points: [[[-0.25, 0], [-0.5, 1], [0.5, 1], [0.25, 0]]] }
        ], 3: [
          { points: [[[-0.25, 0], [-0.25, 0.667], [-0.5, 0.833], [-0.5, 1], [0.5, 1], [0.5, 0.833], [0.25, 0.667], [0.25, 0]], [[0.25, 0.667], [-0.25, 0.667]], [[0.5, 0.833], [-0.5, 0.833]]] }
        ], 4: [
          { points: [[[-0.375, 0.667], [-0.375, 0.833], [0.375, 0.833], [0.375, 0.667]], [[-0.5, 0.833], [-0.5, 1], [0.5, 1], [0.5, 0.833]], [[-0.5, 0], [-0.5, 0.667], [0.5, 0.667], [0.5, 0]]] }
        ], 5: [
          { points: [[[-0.27, 0.667], [-0.5, 0.833], [0.5, 0.833], [0.27, 0.667]], [[-0.5, 0.833], [-0.5, 1], [0.5, 1], [0.5, 0.833]], [[-0.5, 0], [-0.5, 0.667], [0.5, 0.667], [0.5, 0]]] }
        ], 6: [
          { points: [[[-0.375, 0.667], [-0.375, 0.833], [0.375, 0.833], [0.375, 0.667]], [[-0.5, 0.833], [-0.25, 1], [0.25, 1], [0.5, 0.833]], [[-0.25, 0], [-0.5, 0.667], [0.5, 0.667], [0.25, 0]]] }
        ], 7: [
          { points: [[[-0.375, 0.667], [-0.375, 0.833], [0.375, 0.833], [0.375, 0.667]], [[-0.25, 0.833], [-0.5, 1], [0.5, 1], [0.25, 0.833]], [[-0.5, 0], [-0.25, 0.667], [0.25, 0.667], [0.5, 0]]] }
        ], 8: [
          { points: [[[-0.375, 0.667], [-0.375, 0.833], [0.375, 0.833], [0.375, 0.667]], [[-0.25, 0.833], [-0.5, 1], [0.5, 1], [0.25, 0.833]], [[-0.25, 0], [-0.5, 0.667], [0.5, 0.667], [0.25, 0]]] }
        ], 9: []
      },
      drawBarrel: function (options) {
        ctx.lineJoin = ctx.lineCap = "round";
        ctx.lineWidth = render.lineWidth;
        ctx.rotate(options.d);
        ctx.translate(options.x, options.y);
        let squash = 1, shift = 0
        if(options.v >= 0) {
          let s = options.v < 1 ? options.v : (options.v < 2 ? 2 - options.v : 0)
          if(s > 0) {
            squash = 1 - s * 0.15
            if(options.recoilBase !== undefined) {
              shift = (options.recoilBase - options.y) * (1 - squash)
              ctx.translate(0, shift)
            }
            ctx.scale(1, squash)
          }
        }
        let type = options.visualType >= 0 ? options.visualType : options.type
        let data = render.barrelData[type] || []
        if(options.customBarrel) { data = options.customBarrel }
        for(let i=0,l=data.length;i<l;i++) {
          let c = options.color
          if(options.flashColor && render.flash) { c = options.flashColor }
          let items = data[i], color = render.getColor(render.barrelColor, c, options.colorAverage, options.tankColor)
          if(options.highlight) {
            color = render.averageColors(color, { r:255, g:255, b:0 }, 0.2 + 0.1 * (1 + Math.sin(render.now / 300)))
          }
          render.setFillStroke(color, options.highlight === 2 ? 0.5 : 1, 1)
          ctx.beginPath()
          for(let i=0,l=items.points.length;i<l;i++) {
            let item = items.points[i]
            ctx.moveTo(item[0][0] * options.w, item[0][1] * options.h)
            for(let i=1,l=item.length;i<l;i++) {
              ctx.lineTo(item[i][0] * options.w, item[i][1] * options.h)
            }
            ctx.lineTo(item[0][0] * options.w, item[0][1] * options.h)
          }
          ctx.fill('evenodd')
          ctx.stroke()
          ctx.closePath()
        }
        if(squash !== 1) { ctx.scale(1, 1 / squash) }
        if(shift !== 0) { ctx.translate(0, -shift) }
        ctx.translate(-options.x, -options.y);
        ctx.rotate(-options.d);
      },
