    !function() {
      const FONT = '800 50px Roboto', MAX_SHOWN = 48, MAX_ROWS = 7
      let DIMS = ['ffa', '2teams', '4teams', 'crossroads', 'sanctuary', 'abyss', 'voidd', 'editor']
      const SELECTORS = ['me', 'all', 'tanks', 'polygons', 'bullets', 'others', 'fallens', 'celestials', 'blues', 'reds', 'greens', 'purples', 'yellows', 'lasttank']
      const TEAMS = ['blue', 'red', 'green', 'purple', 'yellow', 'pink', 'ffa', 'fallen', 'black', 'random']
      const ROLES = ['player', 'mod', 'admin', 'owner']
      const measure = document.createElement('canvas').getContext('2d')
      measure.font = FONT

      let list = []
      let sel = 0, picked = false, lastValue = null, rows = [], header = [], token = '', blinkFrom = 0
      const history = []
      let historyAt = -1

      const kindsOf = function(tok) {
        if(!tok) { return [] }
        const inner = tok.replace(/^[<\[]|[>\]]$/g, '')
        const parts = inner.split(/\s*\|\s*|\s+or\s+/)
        const out = []
        for(const p of parts) {
          for(const w of p.split(' ')) {
            if(['target', 'player', 'account', 'weapon', 'body', 'dimension', 'dim', 'command', 'role', 'team'].indexOf(w) >= 0) { out.push(w) }
            else if(parts.length > 1 && /^[a-z]+$/.test(w) && w !== 'x' && w !== 'y' && w !== 'name' && w !== 'ip') { out.push('=' + w) }
          }
        }
        return out
      }
      const candidates = function(kind) {
        if(kind[0] === '=') { return [kind.slice(1)] }
        if(kind === 'target' || kind === 'player' || kind === 'account') {
          const names = []
          for(const t of (gameData.tanks || [])) {
            if(t && typeof t.name === 'string' && t.name && t.name.indexOf(' ') < 0 && names.indexOf(t.name) < 0) { names.push(t.name) }
          }
          return kind === 'target' ? SELECTORS.concat(names) : kind === 'player' ? names.concat(['me']) : names
        }
        if(kind === 'weapon' || kind === 'body') {
          return Object.keys(tankData[kind === 'weapon' ? 'weapons' : 'bodies'] || {}).filter(n => n[0] !== '@')
        }
        if(kind === 'dimension' || kind === 'dim') { return DIMS }
        if(kind === 'command') { return list.map(c => c[0]) }
        if(kind === 'role') { return ROLES }
        if(kind === 'team') { return TEAMS }
        return []
      }
      const match = function(words, typed, keepExact) {
        const t = typed.toLowerCase(), a = [], b = []
        for(const w of words) {
          const l = w.toLowerCase()
          if(l === t && !keepExact) { continue }
          if(l.startsWith(t)) { a.push(w) } else if(t && l.includes(t)) { b.push(w) }
          if(a.length >= MAX_ROWS) { break }
        }
        return a.concat(b).slice(0, MAX_ROWS)
      }
      const update = function() {
        const value = chat.value
        if(value === lastValue) { return }
        lastValue = value
        sel = 0
        picked = false
        rows = []
        header = []
        token = ''
        if(value[0] !== '/' || chat.selectionStart !== value.length) { return }
        const parts = value.slice(1).split(' ')
        token = parts[parts.length - 1]
        if(parts.length === 1) {
          const names = match(list.map(c => c[0]), token, true)
          rows = names.map(n => { const c = list.find(x => x[0] === n); return { text: '/' + n, insert: n, note: c[1].slice(n.length + 2), info: c } })
          return
        }
        const cmd = list.find(c => c[0] === parts[0].toLowerCase())
        if(!cmd) { return }
        header = [cmd[1], cmd[2] + (cmd[3] ? ' (only on yourself here)' : '')]
        const toks = cmd[1].match(/<[^>]*>|\[[^\]]*\]/g) || []
        const i = parts.length - 2
        let kinds = kindsOf(toks[i])
        if(toks[i] && toks[i][0] === '[') { kinds = kindsOf(toks[i + 1]).concat(kinds) }
        let words = []
        for(const k of kinds) { for(const w of candidates(k)) { if(words.indexOf(w) < 0) { words.push(w) } } }
        rows = match(words, token).map(w => ({ text: w, insert: w }))
      }
      const accept = function() {
        const r = rows[sel]
        if(!r) { return false }
        const v = chat.value
        chat.value = v.slice(0, v.length - token.length) + r.insert + ' '
        chat.selectionStart = chat.selectionEnd = chat.value.length
        lastValue = null
        blinkFrom = render.now
        return true
      }

      chat.addEventListener('keydown', function(e) {
        update()
        const k = e.keyCode
        if(k === 9) {
          e.preventDefault()
          e.stopPropagation()
          accept()
        } else if(k === 38 || k === 40) {
          e.preventDefault()
          e.stopPropagation()
          if(rows.length) {
            sel = (sel + (k === 38 ? 1 : rows.length - 1)) % rows.length
            picked = true
          } else if(history.length) {
            historyAt = k === 38 ? Math.min(history.length - 1, historyAt + 1) : Math.max(-1, historyAt - 1)
            chat.value = historyAt >= 0 ? history[history.length - 1 - historyAt] : ''
            chat.selectionStart = chat.selectionEnd = chat.value.length
          }
        } else if(k === 13) {
          if(picked && rows.length) {
            e.preventDefault()
            e.stopPropagation()
            accept()
            return
          }
          const v = chat.value.trim()
          if(v && history[history.length - 1] !== v) {
            history.push(v)
            if(history.length > 50) { history.shift() }
          }
          historyAt = -1
        } else if(k === 27) {
          e.preventDefault()
          e.stopPropagation()
          chat.blur()
        } else {
          e.stopPropagation()
        }
      })
      chat.addEventListener('input', function() { blinkFrom = render.now })

      const roundRect = function(x, y, w, h, r) {
        ctx.beginPath()
        ctx.roundRect(x, y, w, h, r)
        ctx.fill()
      }
      const draw = function(tank, cs) {
        update()
        const value = chat.value, caret = chat.selectionStart || 0
        let shown = value, at = caret
        if(value.length > MAX_SHOWN) {
          let start = Math.max(0, Math.min(caret - MAX_SHOWN + 8, value.length - MAX_SHOWN))
          shown = (start > 0 ? '…' : '') + value.slice(start, start + MAX_SHOWN) + (start + MAX_SHOWN < value.length ? '…' : '')
          at = caret - start + (start > 0 ? 1 : 0)
        }
        const empty = !shown
        const data = text.get(empty ? 'Say something, or / for commands' : shown, 'none')
        const size = 36 * cs, full = size / 50, border = text.border
        const x = tank.x, y = tank.y - tank.size - 50 * cs
        const w = Math.max(data.width, 40)
        const boxW = (w + border * 2 + 4) * full, boxH = (50 + 2 * border) * full
        const boxX = x - (w + border * 2 + 2) * full / 2, boxY = y - (50 + border) * full
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
        roundRect(boxX, boxY, boxW, boxH, size * 0.5)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'
        ctx.lineWidth = 2 * cs
        ctx.stroke()
        const height = data.height * full, imgX = x - data.width * full / 2, base = y - 10 * full
        ctx.globalAlpha = empty ? 0.45 : 1
        ctx.drawImage(data.canvas, imgX, base - data.y * full, data.width * full, height)
        ctx.globalAlpha = 1
        if((render.now - blinkFrom) % 1000 < 600) {
          const cx = empty ? imgX + text.padding * full : imgX + (text.padding + measure.measureText(shown.slice(0, at)).width) * full
          ctx.fillStyle = 'rgb(255, 255, 255)'
          ctx.fillRect(cx, base - 37 * full, 4 * full, 46 * full)
        }

        if(!rows.length && !header.length) { return }
        ctx.save()
        const fs = 20 * cs, rh = 30 * cs, pad = 10 * cs
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'left'
        let info = header
        if(!info.length && rows[sel] && rows[sel].info) { info = [rows[sel].info[1], rows[sel].info[2]] }
        const hint = rows.length ? 'Tab: complete   ↑ ↓: choose' : ''
        ctx.font = `700 ${fs}px Roboto`
        let width = boxW
        for(const r of rows) {
          let wr = ctx.measureText(r.text).width
          if(r.note) { ctx.font = `400 ${fs}px Roboto`; wr += ctx.measureText('  ' + r.note).width; ctx.font = `700 ${fs}px Roboto` }
          width = Math.max(width, wr + pad * 2)
        }
        ctx.font = `400 ${fs * 0.8}px Roboto`
        for(const line of info.concat(hint ? [hint] : [])) { width = Math.min(Math.max(width, ctx.measureText(line).width + pad * 2), 900 * cs) }
        const infoH = (info.length + (hint ? 1 : 0)) * rh * 0.8
        const total = rows.length * rh + infoH + pad * 2
        const left = x - width / 2, bottom = boxY - 8 * cs, top = bottom - total
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
        roundRect(left, top, width, total, 10 * cs)
        let ly = top + pad + rh * 0.4
        for(let i = 0; i < info.length; i++) {
          ctx.font = `${i === 0 ? 700 : 400} ${fs * 0.8}px Roboto`
          ctx.fillStyle = i === 0 ? 'rgb(255, 228, 107)' : 'rgb(200, 200, 200)'
          ctx.fillText(info[i], left + pad, ly, width - pad * 2)
          ly += rh * 0.8
        }
        if(hint) {
          ctx.font = `400 ${fs * 0.8}px Roboto`
          ctx.fillStyle = 'rgb(140, 140, 140)'
          ctx.fillText(hint, left + pad, ly, width - pad * 2)
        }
        for(let i = 0; i < rows.length; i++) {
          const r = rows[i], ry = bottom - pad - (i + 1) * rh
          if(i === sel) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.18)'
            roundRect(left + pad * 0.4, ry, width - pad * 0.8, rh, 6 * cs)
          }
          ctx.font = `700 ${fs}px Roboto`
          ctx.fillStyle = 'rgb(255, 255, 255)'
          ctx.fillText(r.text, left + pad, ry + rh / 2)
          if(r.note) {
            const tw = ctx.measureText(r.text).width
            ctx.font = `400 ${fs}px Roboto`
            ctx.fillStyle = 'rgb(150, 150, 150)'
            ctx.fillText('  ' + r.note, left + pad + tw, ry + rh / 2, Math.max(1, width - pad * 2 - tw))
          }
        }
        ctx.restore()
      }

      render.chatBox = {
        draw: draw,
        setCommands: function(l, dims) {
          list = Array.isArray(l) ? l.filter(c => Array.isArray(c) && typeof c[0] === 'string') : []
          if(Array.isArray(dims) && dims.length) { DIMS = dims.filter(d => typeof d === 'string') }
          lastValue = null
        }
      }
    }()
