    !function() {
      const DEBUG_MODES = [[0, 'Off'], [1, 'IDs'], [2, 'IDs + Names'], [3, 'IDs + Names + Health']]
      const setDebug = function(v) {
        game.debug = v
        if(!v) { game.debugTime = performance.now() }
        debugSlide.style.left = v ? '0' : '-500px'
        debugSlide.style.opacity = v ? 1 : 0
      }
      render.customBackground = { on: false, hex: '#cdcdcd', r: 205, g: 205, b: 205, a: 1 }
      const setHexColor = function(c, hex) {
        c.hex = hex.toLowerCase()
        c.r = parseInt(hex.slice(1, 3), 16)
        c.g = parseInt(hex.slice(3, 5), 16)
        c.b = parseInt(hex.slice(5, 7), 16)
      }
      const refreshGrid = function() {
        try {
          gameData.grid.generate()
          game.splash.grid.generate()
        } catch(e) {}
      }
      const SECTIONS = [
        ['Graphics', [
          ['resolution', 'Resolution', 'range', () => Math.round(render.rq * 100), v => { render.rq = v / 100; if(loaded) { render.resize() } }, 100, 40, 100, 5],
          ['autoRes', 'Auto Resolution (lowers it when FPS drops)', 'check', () => render.autoRes, v => { render.autoRes = v; render.autoScale = 1; render.autoGood = 0; if(loaded) { render.resize() } }, true],
          ['particles', 'Particles', 'range', () => Math.round(render.particles * 100), v => { render.particles = v / 100 }, 100, 0, 200, 10],
          ['outline', 'Outline Thickness', 'range', () => Math.round(render.lineWidth * 20), v => { render.lineWidth = v / 20 }, 100, 20, 200, 10],
          ['grid', 'Show Grid', 'check', () => render.showGrid, v => { render.showGrid = v }, true],
          ['flash', 'Damage Flash', 'check', () => render.damageFlash, v => { render.damageFlash = v }, true]
        ]],
        ['Map Background', [
          ['bgCustom', 'Custom Map Background', 'check', () => render.customBackground.on, v => { render.customBackground.on = v }, false],
          ['bgColor', 'Background Color', 'color', () => render.customBackground.hex, v => { setHexColor(render.customBackground, v) }, '#cdcdcd'],
          ['bgAlpha', 'Background Color Opacity', 'range', () => Math.round(render.customBackground.a * 100), v => { render.customBackground.a = v / 100 }, 100, 0, 100, 5]
        ]],
        ['Map Grid', [
          ['gridCustom', 'Custom Grid Color', 'check', () => render.customGrid.on, v => { render.customGrid.on = v; refreshGrid() }, false],
          ['gridColor', 'Grid Color', 'color', () => render.customGrid.hex, v => { setHexColor(render.customGrid, v); refreshGrid() }, '#c8c8c8'],
          ['gridAlpha', 'Grid Color Opacity', 'range', () => Math.round(render.customGrid.a * 100), v => { render.customGrid.a = v / 100; refreshGrid() }, 100, 0, 100, 5]
        ]],
        ['Opacity', [
          ['opTanks', 'Tanks', 'range', () => Math.round(render.opacity.tanks * 100), v => { render.opacity.tanks = v / 100 }, 100, 10, 100, 5],
          ['opBullets', 'Bullets, Drones and Traps', 'range', () => Math.round(render.opacity.bullets * 100), v => { render.opacity.bullets = v / 100 }, 100, 10, 100, 5],
          ['opPolygons', 'Shapes', 'range', () => Math.round(render.opacity.polygons * 100), v => { render.opacity.polygons = v / 100 }, 100, 10, 100, 5],
          ['opHud', 'HUD', 'range', () => Math.round(render.opacity.hud * 100), v => {
            render.opacity.hud = v / 100
            if(page.overlay === 2) { overlay1.style.opacity = render.opacity.hud }
          }, 100, 10, 100, 5]
        ]],
        ['Network', [
          ['extrapolate', 'Predict Movement Between Updates', 'check', () => render.extrapolate, v => { render.extrapolate = v }, true],
          ['debug', 'Debug Overlay (M)', 'select', () => game.debug || 0, v => { setDebug(v) }, 0, DEBUG_MODES]
        ]],
        ['Camera', [
          ['staticCamera', 'Static Camera (H)', 'check', () => !!render.staticCamera, v => { render.staticCamera = v }, true],
          ['smooth', 'Camera Smoothness', 'range', () => Math.round((render.cameraSmooth - 1) / 28 * 100), v => { render.cameraSmooth = 1 + v / 100 * 28 }, 50, 0, 100, 5],
          ['shake', 'Screen Shake', 'check', () => render.screenShake, v => { render.screenShake = v }, true]
        ]],
        ['Display', [
          ['chat', 'Show Chat (B)', 'check', () => !!render.chat, v => { render.chat = v; chat.style.visibility = v ? 'visible' : 'hidden' }, true],
          ['bulletBars', 'Bullet Health Bars (N)', 'check', () => !!game.showBulletHealthBars, v => { game.showBulletHealthBars = v }, false],
          ['minimap', 'Show Minimap', 'check', () => mapCanvas.style.display !== 'none', v => { mapCanvas.style.display = v ? '' : 'none' }, true],
          ['leaderboard', 'Show Leaderboard', 'check', () => leaderboard.style.display !== 'none', v => { leaderboard.style.display = v ? '' : 'none' }, true]
        ]]
      ]
      let loaded = false
      const FIELDS = {}
      for(const s of SECTIONS) { for(const f of s[1]) { FIELDS[f[0]] = f } }

      const save = function() {
        const out = {}
        for(const k in FIELDS) { out[k] = FIELDS[k][3]() }
        try { localStorage.clientSettings = JSON.stringify(out) } catch(e) {}
      }
      const valid = function(f, v) {
        if(f[2] === 'check') { return typeof v === 'boolean' }
        if(f[2] === 'select') { return f[6].some(o => o[0] === v) }
        if(f[2] === 'color') { return typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v) }
        return typeof v === 'number' && v >= f[6] && v <= f[7]
      }
      try {
        const saved = JSON.parse(localStorage.clientSettings || 'null')
        if(saved && typeof saved === 'object') {
          for(const k in FIELDS) {
            if(k in saved && valid(FIELDS[k], saved[k])) {
              try { FIELDS[k][4](saved[k]) } catch(e) {}
            }
          }
        }
      } catch(e) {}
      loaded = true

      const root = document.createElement('div')
      root.id = 'clientSettings'
      root.innerHTML = `<div id="csTitle">Settings</div><div id="csList"></div>` +
        `<div id="csButtons"><button class="csBtn" data-act="apply">APPLY</button><button class="csBtn" data-act="cancel">CANCEL</button><button class="csBtn" data-act="defaults">DEFAULTS</button></div>`
      document.body.appendChild(root)
      const list = root.querySelector('#csList')

      const label = function(f, v) {
        return f[2] === 'range' ? `${f[1]} - ${v}%` : f[1]
      }
      const paint = function() {
        let h = ''
        for(const [name, fields] of SECTIONS) {
          h += `<div class="csHead">${name}</div>`
          for(const f of fields) {
            const v = f[3]()
            if(f[2] === 'range') {
              h += `<label class="csSlider"><span>${label(f, v)}</span><input type="range" min="${f[6]}" max="${f[7]}" step="${f[8]}" value="${v}" data-key="${f[0]}"></label>`
            } else if(f[2] === 'color') {
              h += `<label class="csColor"><span>${f[1]}</span><input type="color" value="${v}" data-key="${f[0]}"></label>`
            } else if(f[2] === 'check') {
              h += `<label class="csToggle"><span>${f[1]}</span><input type="checkbox" data-key="${f[0]}"${v ? ' checked' : ''}><i></i></label>`
            } else {
              h += `<label class="csToggle"><span>${f[1]}</span><select data-key="${f[0]}">` + f[6].map(o => `<option value="${o[0]}"${o[0] === v ? ' selected' : ''}>${o[1]}</option>`).join('') + `</select></label>`
            }
          }
        }
        const scroll = list.scrollTop
        list.innerHTML = h
        list.scrollTop = scroll
      }

      let open = false, before = null
      const snapshot = function() {
        const out = {}
        for(const k in FIELDS) { out[k] = FIELDS[k][3]() }
        return out
      }
      const show = function(v) {
        open = v
        if(v) {
          before = snapshot()
          paint()
        }
        root.classList.toggle('open', v)
      }
      const cancel = function() {
        if(before) {
          for(const k in before) {
            if(FIELDS[k][3]() !== before[k]) { FIELDS[k][4](before[k]) }
          }
        }
        before = null
        show(false)
      }

      list.addEventListener('input', function(e) {
        const t = e.target, f = FIELDS[t.dataset.key]
        if(!f || f[2] === 'select') { return }
        const v = f[2] === 'check' ? t.checked : (f[2] === 'color' ? t.value : Number(t.value))
        f[4](v)
        if(f[2] === 'range') { t.previousElementSibling.textContent = label(f, v) }
      })
      list.addEventListener('change', function(e) {
        const t = e.target, f = FIELDS[t.dataset.key]
        if(f && f[2] === 'select') { f[4](Number(t.value)) }
        t.blur()
      })
      root.addEventListener('click', function(e) {
        const b = e.target.closest('[data-act]')
        if(!b) { return }
        const act = b.dataset.act
        if(act === 'apply') { save(); before = null; show(false) }
        else if(act === 'cancel') { cancel() }
        else if(act === 'defaults') {
          for(const k in FIELDS) { FIELDS[k][4](FIELDS[k][5]) }
          paint()
        }
        b.blur()
      })
      for(const ev of ['mousedown', 'mouseup', 'wheel', 'touchstart', 'contextmenu']) {
        root.addEventListener(ev, function(e) { e.stopPropagation() })
      }
      root.addEventListener('keydown', function(e) {
        const tag = (e.target.tagName || '').toLowerCase()
        if(tag === 'input' || tag === 'select') { e.stopPropagation() }
      })

      window.addEventListener('keydown', function(e) {
        if(!e.isTrusted || e.ctrlKey || e.metaKey || e.altKey) { return }
        const tag = (e.target.tagName || '').toLowerCase()
        if(tag === 'textarea' || (tag === 'input' && e.target.type !== 'range' && e.target.type !== 'checkbox' && e.target.type !== 'color') || document.activeElement === chat) { return }
        if(e.keyCode === 79 && !e.repeat) {
          if(open) { cancel() } else { show(true) }
        } else if(e.keyCode === 27 && open) {
          cancel()
        } else if([72, 66, 77, 78].includes(e.keyCode)) {
          setTimeout(function() {
            const k = { 72: 'staticCamera', 66: 'chat', 77: 'debug', 78: 'bulletBars' }[e.keyCode]
            if(open) {
              if(before) { before[k] = FIELDS[k][3]() }
              paint()
            }
            try {
              const saved = JSON.parse(localStorage.clientSettings || '{}') || {}
              saved[k] = FIELDS[k][3]()
              localStorage.clientSettings = JSON.stringify(saved)
            } catch(err) {}
          }, 0)
        }
      }, true)
    }()
