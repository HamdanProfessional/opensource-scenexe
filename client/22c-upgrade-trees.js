    !function() {
      const BOX = 96, GAP = 12, ROW = 150, PER_LINE = 30
      const root = document.createElement('div')
      root.id = 'upgradeTree'
      root.innerHTML = `<canvas id="utCanvas"></canvas>`
      document.body.appendChild(root)
      const canvas = root.querySelector('#utCanvas')
      const c2 = canvas.getContext('2d')
      let kind = false, tree = null, view = { x: 0, y: 0, s: 1 }, hover = null, raf = 0
      const icons = {}

      const build = function(k) {
        const map = tankData[k === 'weapon' ? 'weaponUpgradeMap' : 'bodyUpgradeMap']
        const arras = gameData.me && String(gameData.me.weapon).startsWith('arras:')
        const start = k === 'weapon' ? (arras ? 'arras:basic' : 'node') : 'base'
        const row = { [start]: 0 }
        for(let changed=true, guard=0;changed && guard<50;guard++) {
          changed = false
          for(const name in row) {
            const e = map[name]
            if(!e) { continue }
            for(const c of e.upgrades) {
              if(!(c in row) || row[c] < row[name] + 1) { row[c] = row[name] + 1; changed = true }
            }
          }
        }
        const rows = []
        for(const name in row) { (rows[row[name]] = rows[row[name]] || []).push(name) }
        const parents = {}
        for(const name in row) {
          const e = map[name]
          if(e) { for(const c of e.upgrades) { (parents[c] = parents[c] || []).push(name) } }
        }
        const nodes = {}
        let width = 0, y = 0
        for(let r=0;r<rows.length;r++) {
          const list = rows[r] || []
          if(r > 0) {
            const score = function(n) {
              const p = (parents[n] || []).filter(x => nodes[x])
              return p.length ? p.reduce((a, x) => a + nodes[x].x, 0) / p.length : 0
            }
            list.sort((a, b) => score(a) - score(b) || (a < b ? -1 : 1))
          } else {
            list.sort()
          }
          for(let start=0;start<list.length;start+=PER_LINE) {
            const line = list.slice(start, start + PER_LINE)
            const w = line.length * BOX + (line.length - 1) * GAP
            width = Math.max(width, w)
            for(let i=0;i<line.length;i++) {
              nodes[line[i]] = { name: line[i], row: r, x: -w / 2 + i * (BOX + GAP) + BOX / 2, y: y, level: map[line[i]] ? map[line[i]].level : null }
            }
            y += start + PER_LINE < list.length ? BOX + GAP : ROW
          }
        }
        const edges = []
        for(const name in nodes) {
          const e = map[name]
          if(e) { for(const c of e.upgrades) { if(nodes[c]) { edges.push([nodes[name], nodes[c]]) } } }
        }
        return { kind: k, map: map, nodes: nodes, edges: edges, width: width, height: y - ROW + BOX }
      }

      const icon = function(name) {
        const color = gameData.me && gameData.me.color ? gameData.me.color : render.teamColors[1]
        const key = tree.kind + ':' + name + ':' + color.r + ',' + color.g + ',' + color.b
        if(icons[key]) { return icons[key] }
        const cv = document.createElement('canvas')
        cv.width = cv.height = 128
        try {
          const w = tree.kind === 'weapon' ? name : 'node'
          const b = tree.kind === 'weapon' ? ((tankData.weapons[name] || {}).renderBody || 'base') : name
          const t = render.getTankData(w, b)
          const body = tankData.bodies[b] || {}
          t.size = body.celestial ? 40 : 28
          t.color = color
          t.d = -Math.PI / 4
          const old = ctx
          ctx = cv.getContext('2d')
          ctx.translate(64, 64)
          ctx.scale(0.9, 0.9)
          render.drawTank(t)
          ctx = old
        } catch(e) {}
        return icons[key] = cv
      }

      const resize = function() {
        const r = window.devicePixelRatio || 1
        canvas.width = Math.round(window.innerWidth * r)
        canvas.height = Math.round(window.innerHeight * r)
      }
      const fit = function() {
        const padX = 40, top = 30, bottom = 130
        view.s = Math.min((window.innerWidth - padX * 2) / tree.width, (window.innerHeight - top - bottom) / tree.height, 1)
        view.x = window.innerWidth / 2
        view.y = top + BOX / 2 * view.s
      }
      const toWorld = function(x, y) { return [(x - view.x) / view.s, (y - view.y) / view.s] }

      const draw = function() {
        raf = 0
        if(!kind) { return }
        const r = window.devicePixelRatio || 1
        c2.setTransform(r, 0, 0, r, 0, 0)
        c2.clearRect(0, 0, window.innerWidth, window.innerHeight)
        c2.translate(view.x, view.y)
        c2.scale(view.s, view.s)
        const mine = gameData.me ? (tree.kind === 'weapon' ? gameData.me.weapon : gameData.me.body) : null
        const next = mine && tree.map[mine] ? tree.map[mine].upgrades : []
        const focus = hover ? hover.name : mine
        c2.lineCap = 'round'
        for(let pass=0;pass<2;pass++) {
          c2.strokeStyle = pass ? '#fff' : 'rgba(0, 0, 0, 0.85)'
          c2.lineWidth = pass ? 4 : 3
          c2.beginPath()
          for(const [a, b] of tree.edges) {
            const lit = !!focus && (a.name === focus || b.name === focus)
            if(lit !== !!pass) { continue }
            c2.moveTo(a.x, a.y + BOX / 2)
            c2.lineTo(b.x, b.y - BOX / 2)
          }
          c2.stroke()
        }
        c2.textAlign = 'center'
        c2.textBaseline = 'middle'
        c2.lineJoin = 'round'
        for(const name in tree.nodes) {
          const n = tree.nodes[name]
          const base = render.polygonColors[n.row % render.polygonColors.length]
          const x = n.x - BOX / 2, y = n.y - BOX / 2, band = BOX * 0.26
          c2.beginPath()
          c2.roundRect(x, y, BOX, BOX, 8)
          c2.fillStyle = render.rgb(hover === n ? render.lighten(base, 25) : base)
          c2.fill()
          c2.save()
          c2.clip()
          c2.fillStyle = render.rgb(render.darken(base, 45))
          c2.fillRect(x, y + BOX - band, BOX, band)
          c2.restore()
          c2.drawImage(icon(name), x + BOX * 0.12, y + 1, BOX * 0.76, BOX * 0.76)
          const label = name[0].toUpperCase() + name.slice(1)
          let size = 15
          c2.font = `900 ${size}px Ubuntu, Roboto, sans-serif`
          const w = c2.measureText(label).width
          if(w > BOX - 10) { size = Math.max(8, size * (BOX - 10) / w); c2.font = `900 ${size}px Ubuntu, Roboto, sans-serif` }
          c2.lineWidth = 3.5
          c2.strokeStyle = '#000'
          c2.strokeText(label, n.x, y + BOX - band / 2 + 1)
          c2.fillStyle = '#fff'
          c2.fillText(label, n.x, y + BOX - band / 2 + 1)
          const isMine = name === mine, isNext = next.includes(name)
          c2.lineWidth = isMine || isNext ? 6 : 4
          c2.strokeStyle = isMine ? '#fff' : isNext ? 'rgb(255, 228, 107)' : '#000'
          c2.beginPath()
          c2.roundRect(x, y, BOX, BOX, 8)
          c2.stroke()
        }
      }
      const redraw = function() {
        if(!raf) { raf = requestAnimationFrame(draw) }
      }

      const show = function(k) {
        if(kind === k) { k = false }
        kind = k
        root.classList.toggle('open', !!k)
        hover = null
        if(!k) { return }
        tree = build(k)
        resize()
        fit()
        redraw()
      }
      const nodeAt = function(x, y) {
        const [wx, wy] = toWorld(x, y)
        for(const name in tree.nodes) {
          const n = tree.nodes[name]
          if(Math.abs(wx - n.x) <= BOX / 2 && Math.abs(wy - n.y) <= BOX / 2) { return n }
        }
        return null
      }

      window.addEventListener('mousemove', function(e) {
        if(!kind) { return }
        const n = nodeAt(e.clientX, e.clientY)
        if(n !== hover) {
          hover = n
          redraw()
        }
      })
      setInterval(function() { if(kind) { redraw() } }, 500)
      window.addEventListener('resize', function() {
        if(kind) { resize(); fit(); redraw() }
      })
      window.addEventListener('keydown', function(e) {
        if(!e.isTrusted || e.ctrlKey || e.metaKey) { return }
        const tag = (e.target.tagName || '').toLowerCase()
        if(tag === 'input' || tag === 'textarea') { return }
        if(e.keyCode === 89 || e.keyCode === 85) {
          if(e.repeat) { return }
          show(e.keyCode === 89 ? 'weapon' : 'body')
        } else if(e.keyCode === 27 && kind) {
          show(false)
        }
      }, true)
    }()
