    !function() {
      const BARREL_TYPES = ['Bullet', 'Trap', 'Drone']
      const AURA_TYPES = ['Damage', 'Heal', 'Pull']
      const TEAMS = [[0, 'None'], [1, 'Blue'], [2, 'Red'], [3, 'Green'], [4, 'Purple'], [6, 'Pink']]
      const TANK_FIELDS = [
        ['radiant', 'Radiant Amount', 0, 9, 1],
        ['level', 'Level', 1, 74, 1]
      ]
      const WEAPON_FIELDS = [
        ['cameraSizeMultiplier', 'Weapon Camera Size Multiplier', 0.5, 3, 0.05],
        ['maxDrones', 'Max Weapon Drones', 1, 20, 1]
      ]
      const BARREL_FIELDS = [
        ['width', 'Width', 0.05, 3, 0.05],
        ['height', 'Length', 0.05, 4, 0.05],
        ['d', 'Angle (degrees)', -180, 180, 1],
        ['x', 'Side Offset', -3, 3, 0.05],
        ['y', 'Forward Offset', -3, 3, 0.05],
        ['reload', 'Reload', 0.1, 20, 0.1],
        ['delay', 'Delay', 0, 1, 0.05],
        ['damage', 'Damage', 0, 20, 0.05],
        ['penetration', 'Penetration', 0, 20, 0.05],
        ['speed', 'Bullet Speed', 0.1, 5, 0.05],
        ['time', 'Bullet Lifetime', 0.1, 10, 0.1],
        ['recoil', 'Recoil', 0, 10, 0.05]
      ]
      const BODY_FIELDS = [
        ['cameraSizeMultiplier', 'Body Camera Size Multiplier', 0.5, 3, 0.05],
        ['size', 'Size', 0.5, 2.5, 0.05],
        ['maxHealth', 'Max Health', 0.2, 10, 0.05],
        ['movementSpeed', 'Movement Speed', 0.2, 3, 0.05],
        ['bodyDamage', 'Body Damage', 0, 10, 0.05]
      ]
      const SHAPE_FIELDS = [
        ['sides', 'Sides (0 = circle)', 0, 12, 1],
        ['outerSides', 'Outer Sides', 0, 12, 1],
        ['outerSize', 'Outer Size', 0, 2.5, 0.05]
      ]
      const AURA_FIELDS = [
        ['size', 'Centre Size', 0.1, 1.5, 0.05],
        ['auraSize', 'Radius', 1, 10, 0.1],
        ['auraDamage', 'Damage', 0, 1, 0.01, 0],
        ['healing', 'Healing', 0, 5, 0.05, 1],
        ['auraPull', 'Pull (- pushes)', -5, 5, 0.1, 2]
      ]
      const ALL_FIELDS = {}
      for(const f of [...TANK_FIELDS, ...WEAPON_FIELDS, ...BARREL_FIELDS, ...BODY_FIELDS, ...SHAPE_FIELDS]) { ALL_FIELDS[f[0]] = f }
      const AURA_BY_KEY = {}
      for(const f of AURA_FIELDS) { AURA_BY_KEY[f[0]] = f }

      const TIPS = {
        't.name': 'The name shown above your tank and on the leaderboard. Leave it empty to use the name you joined with.',
        't.team': 'Which team you are on. Tanks on the same team can\'t hurt each other. None = free for all.',
        't.radiant': 'Radiant level (0-9). Gives your tank the shimmering radiant colours and name prefix. Looks only.',
        't.level': 'Your tank level (1-74). Sets your score to match, which changes your size and upgrade points.',
        'w.name': 'The weapon name shown in your tank class, e.g. "Mono" in Mono-Base.',
        'w.cameraSizeMultiplier': 'How far you can see. Higher = zoomed out further. Multiplied with the body\'s value.',
        'w.maxDrones': 'How many drones each drone barrel can have out at once (stat upgrades raise it a little).',
        'w.keepFrom': 'Keep the auto turrets and decorations of the tank this weapon was loaded from. Turrets can\'t be edited here.',
        'barrel.type': 'Bullet fires straight shots. Trap lays traps that slow down and stay. Drone sends drones that follow your mouse.',
        'barrel.width': 'Barrel thickness, relative to your tank. Also sets the size of what it fires.',
        'barrel.height': 'Barrel length, relative to your tank. 1 = a normal barrel.',
        'barrel.d': 'Which way the barrel points, in degrees. 0 = forward, 180 = backward, 90 = right.',
        'barrel.x': 'Moves the barrel sideways from the centre of the tank (negative = left).',
        'barrel.y': 'Moves the barrel forward or back from the centre of the tank (negative = back).',
        'barrel.reload': 'Time between shots. Higher = fires slower. 1 = a normal barrel.',
        'barrel.delay': 'Waits this part of a reload before the first shot (0.5 = half a reload). Use it to make barrels take turns.',
        'barrel.damage': 'How much damage each shot does. 1 = normal.',
        'barrel.penetration': 'How much health each shot has: how much it can hit before it breaks. 1 = normal.',
        'barrel.speed': 'How fast shots travel. 1 = normal.',
        'barrel.time': 'How long shots last before they fade away. 1 = normal.',
        'barrel.recoil': 'How hard firing pushes your tank backwards. 0 = no push.',
        'b.name': 'The body name shown in your tank class, e.g. "Base" in Mono-Base.',
        'b.cameraSizeMultiplier': 'How far you can see. Higher = zoomed out further. Multiplied with the weapon\'s value.',
        'b.size': 'How big the body is. Bigger is easier to hit. 1 = normal.',
        'b.maxHealth': 'Maximum health. 1 = normal.',
        'b.movementSpeed': 'How fast you move. 1 = normal.',
        'b.bodyDamage': 'Damage you do by ramming into things. 1 = normal.',
        'b.sides': 'Shape of the body: 0 is a circle, 3 a triangle, 4 a square and so on, up to 12.',
        'b.outerSides': 'Sides of a second shape drawn behind the body, like on some bodies. 0 = none.',
        'b.outerSize': 'Size of that outer shape compared to the body. 0 = none.',
        'b.keepFrom': 'Keep the auto turrets and decorations of the body this was loaded from. Turrets can\'t be edited here.',
        'aura.type': 'Damage hurts enemies inside it, Heal heals you and your team, Pull drags things in (or pushes them out).',
        'aura.size': 'Size of the aura\'s centre circle on your tank.',
        'aura.auraSize': 'How far the aura reaches, compared to the centre circle.',
        'aura.auraDamage': 'Damage per tick to enemies inside the aura.',
        'aura.healing': 'Healing per tick to you and teammates inside the aura.',
        'aura.auraPull': 'How strongly things are pulled in. Negative pushes them away.',
        'act.maxStats': 'Put every stat upgrade to the max.',
        'act.resetStats': 'Take back every stat upgrade.',
        'act.resetDesign': 'Start over with a plain Mono-Base tank. Your current design is lost unless you exported it.',
        'act.barrels': 'Show or hide the barrel list.',
        'act.addBarrel': 'Add a new barrel (up to 30).',
        'act.toggle': 'Click to open or close this barrel\'s settings.',
        'act.mirror': 'Add a copy of this barrel flipped to the other side.',
        'act.dup': 'Add an exact copy of this barrel.',
        'act.del': 'Delete this barrel.',
        'act.auras': 'Show or hide the aura list.',
        'act.addAura': 'Add a new aura (up to 4).',
        'act.delAura': 'Delete this aura.',
        'act.go': 'Export: write your tank as a code in the box (and copy it). Import: load the code pasted in the box.',
        'act.loadW': 'Copy the barrels of any weapon in the game, e.g. "twin" or "sniper".',
        'act.loadB': 'Copy the stats and auras of any body in the game, e.g. "smasher".',
        'act.download': 'Save a picture of your tank as a .png file.',
        'io.code': 'Tank codes go here. Paste one and press GO with Import, or press GO with Export to get yours.',
        'io.mode': 'Import loads the code in the box. Export writes your tank into the box.',
        'io.what': 'Full Tank includes the Tank settings, weapon and body. Weapon or Body only changes that part.',
        'io.fmt': 'Which kind of code to export. Scenexe codes (they start with eJ) also work in the official Scenexe tank editor. Importing works out the kind by itself.',
        'io.file': 'The name of the saved picture.',
        'act.panel': 'Show or hide the Tank Editor (P).'
      }
      const tipKey = function(path) {
        const k = path.split('.')
        if(k[1] === 'barrels') { return 'barrel.' + k[3] }
        if(k[1] === 'auras') { return 'aura.' + k[3] }
        return path
      }
      const tipAttr = function(key) { return TIPS[key] ? ` data-tip="${key}"` : '' }

      const num = function(v, min, max, def) {
        v = Number(v)
        if(!isFinite(v)) { return def }
        return v < min ? min : v > max ? max : v
      }
      const title = function(n) { return n ? n[0].toUpperCase() + n.slice(1) : '' }
      const defaultBarrel = function() {
        return { type: 0, width: 0.5, height: 1, d: 0, x: 0, y: 0, reload: 1, delay: 0, damage: 1, penetration: 1, speed: 1, time: 1, recoil: 1 }
      }
      const defaultAura = function() { return { type: 0, size: 0.6, auraSize: 4, auraDamage: 0.1, healing: 1, auraPull: 2 } }

      const fromWeapon = function(name) {
        const w = tankData.weapons[name]
        if(!w || name[0] === '@') { return null }
        let maxDrones = 0
        const barrels = (w.barrels || []).map(function(b) {
          const r = defaultBarrel()
          for(const k in r) { if(typeof b[k] === 'number') { r[k] = b[k] } }
          if([0, 1, 2].indexOf(r.type) < 0) { r.type = 0 }
          if(r.type === 2 && b.drones > maxDrones) { maxDrones = b.drones }
          return r
        })
        const keep = (w.weaponTurrets && w.weaponTurrets.length) || w.weaponVisualElements
        return { name: title(name), cameraSizeMultiplier: w.cameraSizeMultiplier || 1, maxDrones: Math.min(20, maxDrones || 3), barrels: barrels, keepFrom: keep ? name : null, from: name }
      }
      const fromBody = function(name) {
        const b = tankData.bodies[name]
        if(!b || name[0] === '@') { return null }
        const r = {
          name: title(name), sides: b.sides > 0 ? Math.min(12, Math.max(3, b.sides)) : 0, size: b.size || 1, maxHealth: b.maxHealth, movementSpeed: b.movementSpeed,
          bodyDamage: b.bodyDamage, cameraSizeMultiplier: b.cameraSizeMultiplier || 1, outerSides: 0, outerSize: 0, auras: []
        }
        if(!b.celestial && b.outerSides > 0 && b.outerSize > 0) { r.outerSides = Math.min(12, Math.max(3, b.outerSides)); r.outerSize = Math.min(2.5, b.outerSize) }
        for(const a of (b.auras || []).slice(0, 4)) {
          r.auras.push({ type: [0, 1, 2].indexOf(a.type) >= 0 ? a.type : 0, size: a.size || 0.6, auraSize: a.auraSize || 4, auraDamage: a.auraDamage || 0.1, healing: a.healing || 1, auraPull: a.auraPull || 2 })
        }
        const keep = !b.celestial && ((b.turrets && b.turrets.length) || b.visualElements)
        r.keepFrom = keep ? name : null
        r.from = name
        return r
      }
      const normT = function(t) {
        t = t && typeof t === 'object' ? t : {}
        return {
          name: typeof t.name === 'string' ? t.name.slice(0, 24) : '',
          team: TEAMS.some(x => x[0] === t.team) ? t.team : 0,
          radiant: Math.round(num(t.radiant, 0, 9, 0)),
          level: Math.round(num(t.level, 1, 74, 45))
        }
      }
      const normW = function(w) {
        w = w && typeof w === 'object' ? w : {}
        const r = { ...fromWeapon('node'), ...w }
        r.name = typeof r.name === 'string' ? r.name : ''
        r.barrels = (Array.isArray(w.barrels) ? w.barrels : []).slice(0, 30).map(b => ({ ...defaultBarrel(), ...(b && typeof b === 'object' ? b : {}) }))
        if(!(r.maxDrones >= 1)) { r.maxDrones = Math.max(1, Math.min(20, Math.max(0, ...r.barrels.map(b => b.drones || 0)))) || 3 }
        for(const b of r.barrels) { delete b.drones }
        return r
      }
      const normB = function(b) {
        b = b && typeof b === 'object' ? b : {}
        const r = { ...fromBody('base'), ...b }
        r.name = typeof r.name === 'string' ? r.name : ''
        r.auras = (Array.isArray(b.auras) ? b.auras : []).slice(0, 4).map(a => ({ ...defaultAura(), ...(a && typeof a === 'object' ? a : {}) }))
        return r
      }
      const freshState = function() { return { t: normT(null), w: normW(fromWeapon('mono') || fromWeapon('node')), b: normB(fromBody('base')) } }
      let state = null
      try {
        const saved = JSON.parse(localStorage.tankEditor || 'null')
        if(saved && saved.w && saved.b) { state = { t: normT(saved.t), w: normW(saved.w), b: normB(saved.b) } }
      } catch(e) {}
      let hidden = false
      try { hidden = localStorage.tankEditorHidden === '1' } catch(e) {}

      const dirty = { t: false, w: false, b: false }
      let sendTimer = 0, lastSend = 0
      const inGame = function() {
        return page.overlay === 2 && gameData.me && !game.dead && gameCurrentServer && gameCurrentServer.ws
      }
      const flush = function() {
        sendTimer = 0
        if(!active || !inGame()) { return }
        const data = {}
        for(const k in dirty) {
          if(dirty[k]) { data[k] = state[k]; dirty[k] = false }
        }
        lastSend = Date.now()
        if(data.t || data.w || data.b) { gameSend(gameCurrentServer.ws, ['editTank', data]) }
      }
      const changed = function(...kinds) {
        for(const k of kinds) { dirty[k] = true }
        try { localStorage.tankEditor = JSON.stringify(state) } catch(e) {}
        if(!sendTimer) { sendTimer = setTimeout(flush, Math.max(0, lastSend + 120 - Date.now())) }
      }
      const command = function(data) {
        if(active && inGame()) { gameSend(gameCurrentServer.ws, ['editTank', data]) }
      }

      const esc = function(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]) }
      const presetList = function(kind) {
        return Object.keys(kind === 'w' ? tankData.weapons : tankData.bodies).filter(n => n[0] !== '@').sort().map(n => `<option value="${esc(n)}">`).join('')
      }
      const root = document.createElement('div')
      root.id = 'tankEditor'
      root.className = 'gPanel'
      document.body.appendChild(root)
      const io = document.createElement('div')
      io.id = 'teIO'
      io.className = 'gPanel'
      io.innerHTML =
        `<div class="teTitle">Import/Export</div>` +
        `<textarea id="teCode" data-tip="io.code" spellcheck="false" placeholder="Paste tank codes here"></textarea>` +
        `<div class="teLine"><select id="teIOMode" data-tip="io.mode"><option value="import">Import</option><option value="export">Export</option></select>` +
        `<span>as a</span><select id="teIOWhat" data-tip="io.what"><option value="full">Full Tank</option><option value="w">Weapon</option><option value="b">Body</option></select></div>` +
        `<div class="teLine"><span>code type</span><select id="teIOFmt" data-tip="io.fmt"><option value="ours">Open-Scenexe</option><option value="sx">Scenexe</option></select>` +
        `<button class="teBtn" data-act="go">GO</button></div>` +
        `<div id="teIONote"></div>` +
        `<div class="teLine teGap"><span data-tip="act.loadW">Load from weapon upgrade</span><input id="teLoadW" list="teListW" placeholder="weapon upgrade id" spellcheck="false" autocomplete="off"><button class="teBtn" data-act="loadW">LOAD</button></div>` +
        `<div class="teLine"><span data-tip="act.loadB">Load from body upgrade</span><input id="teLoadB" list="teListB" placeholder="body upgrade id" spellcheck="false" autocomplete="off"><button class="teBtn" data-act="loadB">LOAD</button></div>` +
        `<div class="teLine teGap"><span data-tip="act.download">Download image of tank as</span><input id="teFile" data-tip="io.file" placeholder="file name" spellcheck="false" autocomplete="off"><span>.png</span><button class="teBtn" data-act="download">DOWNLOAD</button></div>` +
        `<datalist id="teListW"></datalist><datalist id="teListB"></datalist>`
      document.body.appendChild(io)
      const toggle = document.createElement('button')
      toggle.id = 'teToggle'
      toggle.dataset.tip = 'act.panel'
      toggle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">` +
        `<path d="M11 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6"/><path d="M18.4 2.6a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>`
      document.body.appendChild(toggle)

      let active = false, openBarrel = 0, barrelsOpen = true, aurasOpen = true

      const tip = document.createElement('div')
      tip.id = 'teTip'
      document.body.appendChild(tip)
      let tipOn = null
      const tipFor = function(el) {
        const t = el && el.closest && el.closest('[data-tip], [data-act]')
        if(!t) { return null }
        const key = t.dataset.tip || ('act.' + t.dataset.act)
        return TIPS[key] ? [t, TIPS[key]] : null
      }
      const placeTip = function(x, y) {
        const w = tip.offsetWidth, h = tip.offsetHeight
        let left = x + 16, top = y + 18
        if(left + w > window.innerWidth - 6) { left = x - w - 12 }
        if(top + h > window.innerHeight - 6) { top = y - h - 12 }
        tip.style.left = Math.max(6, left) + 'px'
        tip.style.top = Math.max(6, top) + 'px'
      }
      for(const el of [root, io, toggle]) {
        el.addEventListener('mousemove', function(e) {
          const found = tipFor(e.target)
          if(!found) {
            if(tipOn) { tipOn = null; tip.classList.remove('open') }
            return
          }
          if(found[0] !== tipOn) {
            tipOn = found[0]
            tip.textContent = found[1]
            tip.classList.add('open')
          }
          placeTip(e.clientX, e.clientY)
        })
        el.addEventListener('mouseleave', function() { tipOn = null; tip.classList.remove('open') })
      }

      const fmt = function(v, step) {
        const dp = step >= 1 ? 0 : step >= 0.1 ? 1 : 2
        return String(Number(Number(v).toFixed(dp)))
      }
      const field = function(path, f, value) {
        return `<label class="teRow"${tipAttr(tipKey(path))}><input type="number" min="${f[2]}" max="${f[3]}" step="${f[4]}" value="${fmt(value, f[4])}" data-path="${path}"><span>${f[1]}</span></label>`
      }
      const text = function(path, label, value, placeholder) {
        return `<label class="teRow"${tipAttr(tipKey(path))}><input type="text" class="teText" maxlength="24" value="${esc(value)}" placeholder="${placeholder}" data-path="${path}" spellcheck="false" autocomplete="off"><span>${label}</span></label>`
      }
      const select = function(path, label, options, value) {
        return `<label class="teRow"${tipAttr(tipKey(path))}><select data-path="${path}">` +
          options.map(o => `<option value="${o[0]}"${o[0] === value ? ' selected' : ''}>${o[1]}</option>`).join('') + `</select><span>${label}</span></label>`
      }
      const listHead = function(label, count, open, toggleAct, addAct, max) {
        return `<div class="teList"><button class="teListBtn${open ? ' open' : ''}" data-act="${toggleAct}">${label} (${count})</button>` +
          (count < max ? `<button class="teListAdd" data-act="${addAct}">+</button>` : '') + `</div>`
      }

      const paint = function() {
        const t = state.t, w = state.w, b = state.b
        let h = `<div class="teTitle">Tank</div>`
        h += text('t.name', 'Override Tank Name', t.name, 'Name')
        h += select('t.team', 'Team', TEAMS, t.team)
        for(const f of TANK_FIELDS) { h += field('t.' + f[0], f, t[f[0]]) }
        h += `<div class="teLine teStats"><button class="teBtn" data-act="maxStats">Max Stats</button><button class="teBtn" data-act="resetStats">Reset Stats</button><button class="teBtn" data-act="resetDesign">New Tank</button></div>`

        h += `<div class="teTitle teSub">Weapon</div>`
        h += text('w.name', 'Weapon Upgrade Name', w.name, 'Node')
        h += `<div class="teSep"></div>`
        for(const f of WEAPON_FIELDS) { h += field('w.' + f[0], f, w[f[0]]) }
        if(w.keepFrom) { h += `<label class="teRow teCheck" data-tip="w.keepFrom"><input type="checkbox" data-path="w.keepFrom" checked><span>Keep ${esc(title(w.keepFrom))}'s turrets</span></label>` }
        h += listHead('Barrels', w.barrels.length, barrelsOpen, 'barrels', 'addBarrel', 30)
        if(barrelsOpen) {
          w.barrels.forEach(function(br, i) {
            const open = i === openBarrel
            h += `<div class="teCard${open ? ' open' : ''}"><div class="teCardHead" data-act="toggle" data-i="${i}">` +
              `<span>${i + 1}. ${BARREL_TYPES[br.type] || 'Bullet'} <small>${Math.round(br.d * 180 / Math.PI)}°</small></span>` +
              `<span class="teCardBtns"><button class="teMini" data-act="mirror" data-i="${i}">Mirror</button>` +
              `<button class="teMini" data-act="dup" data-i="${i}">Copy</button>` +
              `<button class="teMini teDanger" data-act="del" data-i="${i}">✕</button></span></div>`
            if(open) {
              h += `<div class="teCardBody">` + select(`w.barrels.${i}.type`, 'Barrel Type', BARREL_TYPES.map((n, k) => [k, n]), br.type)
              for(const f of BARREL_FIELDS) { h += field(`w.barrels.${i}.${f[0]}`, f, f[0] === 'd' ? Math.round(br.d * 180 / Math.PI) : br[f[0]]) }
              h += `</div>`
            }
            h += `</div>`
          })
        }

        h += `<div class="teTitle teSub">Body</div>`
        h += text('b.name', 'Body Upgrade Name', b.name, 'Base')
        h += `<div class="teSep"></div>`
        for(const f of BODY_FIELDS) { h += field('b.' + f[0], f, b[f[0]]) }
        h += `<div class="teSep"></div>`
        for(const f of SHAPE_FIELDS) { h += field('b.' + f[0], f, b[f[0]]) }
        if(b.keepFrom) { h += `<label class="teRow teCheck" data-tip="b.keepFrom"><input type="checkbox" data-path="b.keepFrom" checked><span>Keep ${esc(title(b.keepFrom))}'s turrets and look</span></label>` }
        h += listHead('Auras', b.auras.length, aurasOpen, 'auras', 'addAura', 4)
        if(aurasOpen) {
          b.auras.forEach(function(a, i) {
            h += `<div class="teCard open"><div class="teCardHead"><span>${i + 1}. ${AURA_TYPES[a.type] || 'Damage'} Aura</span>` +
              `<span class="teCardBtns"><button class="teMini teDanger" data-act="delAura" data-i="${i}">✕</button></span></div><div class="teCardBody">` +
              select(`b.auras.${i}.type`, 'Aura Type', AURA_TYPES.map((n, k) => [k, n]), a.type)
            for(const f of AURA_FIELDS) {
              if(f.length > 5 && f[5] !== a.type) { continue }
              h += field(`b.auras.${i}.${f[0]}`, f, a[f[0]])
            }
            h += `</div></div>`
          })
        }
        const scroll = root.scrollTop
        tipOn = null
        tip.classList.remove('open')
        root.innerHTML = h
        root.scrollTop = scroll
      }

      const setPath = function(input, final) {
        const keys = input.dataset.path.split('.')
        let o = state
        for(let i=0;i<keys.length-1;i++) { o = o[keys[i]] }
        const k = keys[keys.length - 1]
        const isAngle = k === 'd' && keys[1] === 'barrels'
        if(k === 'keepFrom') { o.keepFrom = input.checked ? o.from : null; return false }
        if(input.type === 'text') { o[k] = input.value.slice(0, 24); return false }
        const f = keys[1] === 'auras' ? AURA_BY_KEY[k] : ALL_FIELDS[k]
        let v = Number(input.value)
        if(input.value === '' || !isFinite(v)) {
          if(final && f) { input.value = fmt(isAngle ? Math.round(o.d * 180 / Math.PI) : o[k], f[4]) }
          return false
        }
        if(f) {
          if(final) {
            v = num(v, f[2], f[3], v)
            input.value = fmt(v, f[4])
          } else if(v < f[2] || v > f[3]) {
            return false
          }
          if(f[4] >= 1) { v = Math.round(v) }
        } else {
          v = Math.round(v)
        }
        if(isAngle) {
          const small = input.closest('.teCard') && input.closest('.teCard').querySelector('.teCardHead small')
          if(small) { small.textContent = v + '°' }
          v = v * Math.PI / 180
        }
        o[k] = v
        return k === 'type'
      }
      root.addEventListener('input', function(e) {
        const t = e.target
        if(!t.dataset.path || t.tagName === 'SELECT' || t.type === 'checkbox') { return }
        setPath(t, false)
        changed(t.dataset.path[0])
      })
      root.addEventListener('change', function(e) {
        const t = e.target
        if(!t.dataset.path) { return }
        const redraw = setPath(t, true)
        changed(t.dataset.path[0])
        if(redraw) { paint() }
        if(t.tagName === 'SELECT' || t.type === 'checkbox') { t.blur() }
      })

      const loadPreset = function(kind, input) {
        const name = (input.value || '').trim().toLowerCase()
        const d = kind === 'w' ? fromWeapon(name) : fromBody(name)
        if(!d) { input.classList.add('teBad'); return }
        state[kind] = kind === 'w' ? normW(d) : normB(d)
        openBarrel = 0
        changed(kind)
        paint()
      }
      const sxDecode = async function(text) {
        const bin = atob(text.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/'))
        const bytes = new Uint8Array(bin.length)
        for(let i = 0; i < bin.length; i++) { bytes[i] = bin.charCodeAt(i) }
        const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate'))
        return JSON.parse(await new Response(stream).text())
      }
      const sxEncode = async function(obj) {
        const stream = new Blob([JSON.stringify(obj)]).stream().pipeThrough(new CompressionStream('deflate'))
        const bytes = new Uint8Array(await new Response(stream).arrayBuffer())
        let bin = ''
        for(let i = 0; i < bytes.length; i++) { bin += String.fromCharCode(bytes[i]) }
        return btoa(bin)
      }
      const r2 = function(v) { return Math.round(v * 1000) / 1000 }
      const SX_TO_OURS = { 0: 0, 1: 2, 2: 1 }, OURS_TO_SX = { 0: 0, 1: 2, 2: 1 }
      const SX_TYPE_NAMES = { 3: 'minion', 4: 'special', 5: 'special', 6: 'blade', 7: 'rocket', 8: 'custom projectile' }
      const fromSxWeapon = function(d, lost) {
        const maxDrones = Math.round(num(d.maxWeaponDrones || d.maxDrones, 1, 20, 3))
        const list = Array.isArray(d.barrels) ? d.barrels : []
        if(list.length > 30) { lost['barrels past 30'] = 1 }
        const barrels = list.slice(0, 30).map(function(b) {
          b = b && typeof b === 'object' ? b : {}
          let type = 0
          if(b.type === 3 || b.type === 4) { type = 2 }
          else if(b.type === 8) { type = SX_TO_OURS[b.visualType] || 0 }
          else { type = SX_TO_OURS[b.type] || 0 }
          if(b.type > 2) { lost[(SX_TYPE_NAMES[b.type] || 'special') + ' barrels (now ' + BARREL_TYPES[type].toLowerCase() + 's)'] = 1 }
          if(b.minion) { lost['the weapons/bodies of projectiles'] = 1 }
          return {
            type: type,
            width: r2(num(b.width, 0.05, 3, 0.5)),
            height: r2(num(b.length, 0.05, 4, 1)),
            d: num(b.rot, -360, 360, 0) * Math.PI / 180,
            x: r2(num(b.offset, -3, 3, 0)),
            y: r2(num(b.distance, -3, 3, 0)),
            reload: r2(num(b.reload, 0.1, 20, 1)),
            delay: r2(num(b.delay, 0, 1, 0)),
            damage: r2(num(b.damage, 0, 20, 1)),
            penetration: r2(num(b.penetration, 0, 20, 1)),
            speed: r2(num(b.speed, 0.1, 5, 1)),
            time: r2(num(b.lifetime, 0.1, 10, 1)),
            recoil: r2(num(b.recoil, 0, 10, 1))
          }
        })
        const name = typeof d.name === 'string' ? d.name : (d.weaponUpgradeName || '')
        return { name: name, cameraSizeMultiplier: r2(num(d.weaponCameraSizeMultiplier || d.cameraSizeMultiplier, 0.5, 3, 1)), maxDrones: maxDrones, barrels: barrels, keepFrom: null }
      }
      const sxSides = function(v) { v = Math.round(num(v, 0, 12, 0)); return v < 3 ? 0 : v }
      const fromSxBody = function(d, lost) {
        const r = {
          name: typeof d.name === 'string' ? d.name : (d.bodyUpgradeName || ''),
          sides: sxSides(d.sides), outerSides: sxSides(d.outerSides), outerSize: r2(num(1 + num(d.outerSize, 0, 2.5, 0), 0, 2.5, 0)),
          size: d.type === 'full' ? r2(num(d.size, 0.5, 2.5, 1)) : 1,
          maxHealth: r2(num(d.healthMultiplier, 0.2, 10, 1)),
          movementSpeed: r2(num(d.speedMultiplier, 0.2, 3, 1)),
          bodyDamage: r2(num(d.bodyDamageMultiplier, 0, 10, 1)),
          cameraSizeMultiplier: r2(num(d.bodyCameraSizeMultiplier || d.cameraSizeMultiplier, 0.5, 3, 1)),
          auras: [], keepFrom: null
        }
        if(!r.outerSides) { r.outerSize = 0 }
        for(const g of (Array.isArray(d.gadgets) ? d.gadgets : [])) {
          if(!g || typeof g !== 'object') { continue }
          if(g.type === 2) {
            if(r.auras.length >= 4) { lost['auras past 4'] = 1; continue }
            const type = g.subtype === 0 ? 0 : g.subtype === 1 ? 1 : 2
            r.auras.push({
              type: type,
              size: r2(num(g.width, 0.1, 1.5, 0.6)),
              auraSize: r2(num(g.radius, 1, 10, 4)),
              auraDamage: r2(num(type === 0 ? g.damage : 0.1, 0, 1, 0.1)),
              healing: r2(num(type === 1 ? g.damage : 1, 0, 5, 1)),
              auraPull: 2
            })
          } else {
            lost[g.type === 3 ? 'turrets' : 'barrels on the body'] = 1
          }
        }
        if(Array.isArray(d.layers) && d.layers.length) { lost['body layers'] = 1 }
        return r
      }
      const toSxBarrel = function(b) {
        return { type: OURS_TO_SX[b.type] || 0, rot: r2(b.d * 180 / Math.PI), offset: b.x, width: b.width, length: b.height, penetration: b.penetration, damage: b.damage,
          reload: b.reload, delay: b.delay, distance: b.y, speed: b.speed, lifetime: b.time, spread: 0, size: 1, recoil: b.recoil }
      }
      const toSxAuras = function(b) {
        return b.auras.map(a => ({ type: 2, offsetX: 0, offsetY: 0, width: a.size, reload: 0.25, damage: a.type === 0 ? a.auraDamage : a.type === 1 ? a.healing : 0.1,
          rot: 0, sides: 0, backSides: 0, subtype: a.type, radius: a.auraSize, alpha: 0.15, rotationType: 1, showParticles: 1, affectBullets: 2, activationTrigger: 2, ignoreMass: 1 }))
      }
      const toSx = function(what) {
        const w = state.w, b = state.b, t = state.t
        const outer = b.outerSides > 0 ? r2(Math.max(0, b.outerSize - 1)) : 0
        const weapon = { type: 'weapon', version: 10, barrels: w.barrels.map(toSxBarrel), cameraSizeMultiplier: w.cameraSizeMultiplier, maxDrones: w.maxDrones, name: w.name || '' }
        const body = { type: 'body', version: 10, name: b.name || '', sides: b.sides, outerSides: b.outerSides, outerSize: outer, healthMultiplier: b.maxHealth,
          bodyDamageMultiplier: b.bodyDamage, speedMultiplier: b.movementSpeed, cameraSizeMultiplier: b.cameraSizeMultiplier, maxDrones: 3, gadgets: toSxAuras(b), layers: [] }
        if(what === 'w') { return weapon }
        if(what === 'b') { return body }
        return { type: 'full', version: 10, sides: b.sides, outerSides: b.outerSides, outerSize: outer, healthMultiplier: b.maxHealth, bodyDamageMultiplier: b.bodyDamage,
          speedMultiplier: b.movementSpeed, bodyCameraSizeMultiplier: b.cameraSizeMultiplier, maxBodyDrones: 3, bodyUpgradeName: b.name || '',
          weaponCameraSizeMultiplier: w.cameraSizeMultiplier, maxWeaponDrones: w.maxDrones, weaponUpgradeName: w.name || '', level: t.level, size: b.size || 1,
          tankType: 0, radiant: t.radiant, team: t.team, overrideTankName: t.name || '', barrels: weapon.barrels, gadgets: body.gadgets, layers: [] }
      }

      const code = io.querySelector('#teCode')
      const note = io.querySelector('#teIONote')
      const importExport = async function() {
        const mode = io.querySelector('#teIOMode').value, what = io.querySelector('#teIOWhat').value, fmt = io.querySelector('#teIOFmt').value
        note.textContent = ''
        if(mode === 'export') {
          if(fmt === 'sx') {
            try { code.value = await sxEncode(toSx(what)) } catch(err) { note.textContent = 'This browser can\'t make Scenexe codes.'; return }
          } else {
            const d = what === 'full' ? { tank: state.t, weapon: state.w, body: state.b } : state[what]
            code.value = JSON.stringify(d)
          }
          code.select()
          try { navigator.clipboard.writeText(code.value) } catch(err) {}
          return
        }
        const text = code.value.trim()
        try {
          if(/^eJ/.test(text)) {
            const d = await sxDecode(text)
            if(!d || typeof d !== 'object' || ['weapon', 'body', 'full'].indexOf(d.type) < 0) { throw 0 }
            const hasW = d.type !== 'body', hasB = d.type !== 'weapon'
            if((what === 'w' && !hasW) || (what === 'b' && !hasB)) {
              note.textContent = `That is a ${d.type} code, pick ${hasW ? 'Weapon' : 'Body'} or Full Tank.`
              throw 0
            }
            const lost = {}
            if(hasW && what !== 'b') { state.w = normW(fromSxWeapon(d, lost)); changed('w') }
            if(hasB && what !== 'w') { state.b = normB(fromSxBody(d, lost)); changed('b') }
            if(d.type === 'full' && what === 'full') {
              state.t = normT({ name: d.overrideTankName || '', team: d.team, radiant: d.radiant, level: d.level })
              changed('t')
            }
            const l = Object.keys(lost)
            note.textContent = 'Imported a Scenexe ' + d.type + ' code.' + (l.length ? ' Not supported here, so left out or changed: ' + l.join(', ') + '.' : '')
          } else {
            const d = JSON.parse(text)
            if(!d || typeof d !== 'object') { throw 0 }
            if(what === 'full') {
              if(!d.weapon || !Array.isArray(d.weapon.barrels) || !d.body) { throw 0 }
              state = { t: normT(d.tank), w: normW(d.weapon), b: normB(d.body) }
              changed('t', 'w', 'b')
            } else if(what === 'w') {
              const w = d.weapon || d
              if(!Array.isArray(w.barrels)) { throw 0 }
              state.w = normW(w)
              changed('w')
            } else {
              state.b = normB(d.body || d)
              changed('b')
            }
          }
          openBarrel = 0
          paint()
        } catch(err) {
          code.classList.add('teBad')
          if(!note.textContent) { note.textContent = 'That code could not be read.' }
        }
      }
      const download = function() {
        const me = gameData.me
        if(!me) { return }
        const cv = document.createElement('canvas')
        cv.width = cv.height = 512
        const old = ctx
        try {
          const t = render.getTankData(me.weapon, me.body)
          const body = tankData.bodies[me.body] || {}
          t.size = 70 / Math.max(1, body.size || 1)
          t.color = me.color || render.teamColors[1]
          t.d = -Math.PI / 4
          ctx = cv.getContext('2d')
          ctx.translate(256, 256)
          render.drawTank(t)
        } catch(err) {
          ctx = old
          return
        }
        ctx = old
        const name = (io.querySelector('#teFile').value || '').trim().replace(/[\\/:*?"<>|]/g, '') || 'tank'
        cv.toBlob(function(blob) {
          if(!blob) { return }
          const a = document.createElement('a')
          a.href = URL.createObjectURL(blob)
          a.download = name + '.png'
          document.body.appendChild(a)
          a.click()
          a.remove()
          setTimeout(function() { URL.revokeObjectURL(a.href) }, 1000)
        }, 'image/png')
      }

      const onClick = function(e) {
        const b = e.target.closest('[data-act]')
        if(!b) { return }
        const act = b.dataset.act, i = Number(b.dataset.i)
        const barrels = state.w.barrels
        if(act === 'toggle') { openBarrel = openBarrel === i ? -1 : i; paint() }
        else if(act === 'barrels') { barrelsOpen = !barrelsOpen; paint() }
        else if(act === 'auras') { aurasOpen = !aurasOpen; paint() }
        else if(act === 'addBarrel') { barrels.push(defaultBarrel()); barrelsOpen = true; openBarrel = barrels.length - 1; changed('w'); paint() }
        else if(act === 'dup' || act === 'mirror') {
          e.stopPropagation()
          if(barrels.length >= 30) { return }
          const c = { ...barrels[i] }
          if(act === 'mirror') { c.d = -c.d; c.x = -c.x }
          barrels.splice(i + 1, 0, c)
          openBarrel = i + 1
          changed('w')
          paint()
        } else if(act === 'del') {
          e.stopPropagation()
          barrels.splice(i, 1)
          if(openBarrel >= barrels.length) { openBarrel = barrels.length - 1 }
          changed('w')
          paint()
        } else if(act === 'addAura') { state.b.auras.push(defaultAura()); aurasOpen = true; changed('b'); paint() }
        else if(act === 'delAura') { state.b.auras.splice(i, 1); changed('b'); paint() }
        else if(act === 'maxStats') { command({ maxStats: true }) }
        else if(act === 'resetStats') { command({ reset: true }) }
        else if(act === 'resetDesign') { state = freshState(); openBarrel = 0; changed('t', 'w', 'b'); paint() }
        else if(act === 'go') { importExport() }
        else if(act === 'loadW') { loadPreset('w', io.querySelector('#teLoadW')) }
        else if(act === 'loadB') { loadPreset('b', io.querySelector('#teLoadB')) }
        else if(act === 'download') { download() }
        if(b.tagName === 'BUTTON' && b.isConnected) { b.blur() }
      }
      root.addEventListener('click', onClick)
      io.addEventListener('click', onClick)
      io.addEventListener('focusin', function(e) { e.target.classList && e.target.classList.remove('teBad') })
      io.addEventListener('change', function(e) { if(e.target.tagName === 'SELECT') { e.target.blur() } })
      for(const el of [root, io, toggle]) {
        for(const ev of ['mousedown', 'mouseup', 'wheel', 'touchstart', 'contextmenu']) {
          el.addEventListener(ev, function(e) { e.stopPropagation() })
        }
        el.addEventListener('keydown', function(e) {
          const tag = (e.target.tagName || '').toLowerCase()
          if(tag === 'input' || tag === 'textarea' || tag === 'select') {
            e.stopPropagation()
            if(e.keyCode === 13 && tag === 'input') { e.target.blur() }
          }
        })
      }

      const update = function() {
        if(active && page.overlay !== 2) { active = false }
        const on = active && !!inGame()
        root.classList.toggle('open', on && !hidden)
        io.classList.toggle('open', on && !hidden)
        if(!on || hidden) { tipOn = null; tip.classList.remove('open') }
        toggle.classList.toggle('open', on)
        toggle.classList.toggle('on', !hidden)
      }
      const flip = function() {
        hidden = !hidden
        try { localStorage.tankEditorHidden = hidden ? '1' : '0' } catch(err) {}
        update()
      }
      toggle.addEventListener('click', function() { flip(); toggle.blur() })
      window.addEventListener('keydown', function(e) {
        if(!e.isTrusted || !active || e.keyCode !== 80 || e.repeat || e.ctrlKey || e.metaKey) { return }
        const tag = (e.target.tagName || '').toLowerCase()
        if(tag === 'input' || tag === 'textarea' || tag === 'select') { return }
        flip()
      }, true)
      setInterval(update, 250)

      window.tankEditor = {
        enter: function() {
          active = true
          if(!state) { state = freshState() }
          io.querySelector('#teListW').innerHTML = presetList('w')
          io.querySelector('#teListB').innerHTML = presetList('b')
          paint()
          update()
          changed('t', 'w', 'b')
        }
      }
    }()
