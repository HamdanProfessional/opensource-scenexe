    !function() {
      const MAX = 18
      const DEFAULTS = ['Hi!', 'GG', 'Help!', 'Thanks!', 'Follow me', 'Team up?', 'Nice shot!', 'Sorry!', 'Run!', 'Base under attack!', 'Over here!', 'Yes', 'No', 'lol', 'Wait!', 'Bye!']
      const NS = 'http://www.w3.org/2000/svg'
      const R = 250, INNER = 88, BTN = 300
      let messages = DEFAULTS.slice()
      try {
        const saved = JSON.parse(localStorage.quickChat || 'null')
        if(Array.isArray(saved)) { messages = saved.filter(x => typeof x === 'string').slice(0, MAX) }
      } catch(e) {}
      const save = function() {
        try { localStorage.quickChat = JSON.stringify(messages) } catch(e) {}
      }

      const root = document.createElement('div')
      root.id = 'quickChat'
      root.innerHTML = `<div id="qcTitle">Quick Chat</div><svg id="qcWheel" viewBox="-345 -345 690 690"></svg>` +
        `<form id="qcEdit"><input id="qcInput" maxlength="60" spellcheck="false" autocomplete="off" placeholder="Message">` +
        `<div id="qcEditButtons"><button type="submit" class="menuBtn menuBtnSmall radiantBackground">Save</button>` +
        `<button type="button" id="qcDelete" class="menuBtn menuBtnSmall menuBtnSecondary">Delete</button>` +
        `<button type="button" id="qcCancel" class="menuBtn menuBtnSmall menuBtnSecondary">Cancel</button></div></form>` +
        `<div id="qcHint">Click or press 1-9 to send · T / Esc to close</div>`
      document.body.appendChild(root)
      const wheel = root.querySelector('#qcWheel'), edit = root.querySelector('#qcEdit'), input = root.querySelector('#qcInput')
      let open = false, editing = -1

      const el = function(tag, attrs, parent) {
        const e = document.createElementNS(NS, tag)
        for(const k in attrs) { e.setAttribute(k, attrs[k]) }
        if(parent) { parent.appendChild(e) }
        return e
      }
      const pt = function(a, r) { return [Math.cos(a) * r, Math.sin(a) * r] }
      const slots = function() { return messages.length < MAX ? messages.length + 1 : MAX }
      const angleOf = function(k) { return Math.PI / 2 + k * (Math.PI * 2 / slots()) }
      const messageAt = function(k) { return messages.length < MAX ? k - 1 : (k + MAX - 1) % MAX }

      const build = function() {
        wheel.textContent = ''
        const n = slots(), step = Math.PI * 2 / n
        const slices = el('g', {}, wheel)
        for(let k=0;k<n;k++) {
          const a = angleOf(k), i = messageAt(k)
          const g = el('g', { class: 'qcSlice' + (i < 0 ? ' qcAdd' : '') }, slices)
          if(n === 1) {
            el('circle', { cx: 0, cy: 0, r: R }, g)
          } else {
            const p1 = pt(a - step / 2, R), p2 = pt(a + step / 2, R)
            el('path', { d: `M0 0 L${p1[0]} ${p1[1]} A${R} ${R} 0 ${step > Math.PI ? 1 : 0} 1 ${p2[0]} ${p2[1]} Z` }, g)
          }
          const c = pt(a, n === 1 ? 0 : R * 0.68)
          if(i < 0) {
            el('path', { class: 'qcPlus', d: `M${c[0] - 6} ${c[1] - 24} h12 v18 h18 v12 h-18 v18 h-12 v-18 h-18 v-12 h18 Z` }, g)
            g.addEventListener('click', function() { startEdit(-1) })
          } else {
            const t = el('text', { x: c[0], y: c[1], class: 'qcText' }, g)
            const s = messages[i]
            t.textContent = s.length > 12 ? s.slice(0, 11) + '…' : s
            g.addEventListener('click', function() { send(i) })
            const b = pt(a, BTN)
            const eb = el('g', { class: 'qcMore', transform: `translate(${b[0]} ${b[1]})` }, wheel)
            el('circle', { r: 21 }, eb)
            for(let d=-1;d<=1;d++) { el('circle', { class: 'qcDot', cx: d * 8, cy: 0, r: 3.2 }, eb) }
            eb.addEventListener('click', function(e) { e.stopPropagation(); startEdit(i) })
          }
        }
        const numbered = Math.min(9, messages.length)
        if(numbered > 0 && n > 1) {
          const a1 = angleOf(messages.length < MAX ? 1 : 0) - step / 2, a2 = a1 + numbered * step
          const p1 = pt(a1, INNER), p2 = pt(a2, INNER)
          el('path', { class: 'qcRing', d: `M${p1[0]} ${p1[1]} A${INNER} ${INNER} 0 ${a2 - a1 > Math.PI ? 1 : 0} 1 ${p2[0]} ${p2[1]}` }, wheel)
          for(let i=0;i<numbered;i++) {
            const k = messages.length < MAX ? i + 1 : (i + 1) % MAX
            const p = pt(angleOf(k), INNER - 20)
            el('text', { x: p[0], y: p[1], class: 'qcNum' }, wheel).textContent = i + 1
          }
        }
        el('circle', { cx: 0, cy: 0, r: 9, class: 'qcHub' }, wheel)
      }

      const inGame = function() {
        return page.overlay === 2 && gameData.me && !game.dead && gameCurrentServer && gameCurrentServer.ws
      }
      const setOpen = function(v) {
        open = v
        if(!v) { stopEdit() }
        root.classList.toggle('open', v)
        if(v) { build() }
      }
      const send = function(i) {
        const text = messages[i]
        if(text && inGame()) {
          gameSend(gameCurrentServer.ws, ['chat', text])
        }
        setOpen(false)
      }
      const startEdit = function(i) {
        if(i < 0 && messages.length >= MAX) { return }
        editing = i
        input.value = i >= 0 ? messages[i] : ''
        root.querySelector('#qcDelete').style.display = i >= 0 ? '' : 'none'
        edit.classList.add('open')
        input.focus()
      }
      const stopEdit = function() {
        editing = -1
        edit.classList.remove('open')
        input.blur()
      }
      edit.addEventListener('submit', function(e) {
        e.preventDefault()
        const v = input.value.trim().slice(0, 60)
        if(v) {
          if(editing >= 0) { messages[editing] = v } else if(messages.length < MAX) { messages.push(v) }
          save()
        }
        stopEdit()
        build()
      })
      root.querySelector('#qcDelete').addEventListener('click', function() {
        if(editing >= 0) {
          messages.splice(editing, 1)
          save()
        }
        stopEdit()
        build()
      })
      root.querySelector('#qcCancel').addEventListener('click', stopEdit)
      root.addEventListener('mousedown', function(e) { e.stopPropagation() })
      root.addEventListener('click', function(e) {
        if(e.target === root) { setOpen(false) }
      })

      window.addEventListener('keydown', function(e) {
        if(!e.isTrusted) { return }
        const tag = (e.target.tagName || '').toLowerCase()
        if(e.target === input) {
          if(e.keyCode === 27) { e.preventDefault(); stopEdit() }
          e.stopImmediatePropagation()
          return
        }
        if(tag === 'input' || tag === 'textarea') { return }
        if(open) {
          if(e.keyCode === 84 || e.keyCode === 27) {
            setOpen(false)
          } else if(e.keyCode >= 49 && e.keyCode <= 57) {
            const i = e.keyCode - 49
            if(i < messages.length) { send(i) }
          } else {
            return
          }
          e.preventDefault()
          e.stopImmediatePropagation()
        } else if(e.keyCode === 84 && !e.repeat && !e.ctrlKey && !e.metaKey && inGame()) {
          e.preventDefault()
          setOpen(true)
        }
      }, true)
      setInterval(function() {
        if(open && !inGame()) { setOpen(false) }
      }, 250)
    }()
