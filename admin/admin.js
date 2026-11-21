(function() {
  const SVG_TAGS = ['line', 'text', 'polyline']
  let csrf = ''
  let signedIn = false
  let latest = null
  let timer = 0
  let answer = null

  function $(id) {
    return document.getElementById(id)
  }

  function el(tag, attrs, children) {
    let node = SVG_TAGS.indexOf(tag) >= 0 ? document.createElementNS('http://www.w3.org/2000/svg', tag) : document.createElement(tag)
    for(const key in attrs || {}) {
      if(key === 'text') { node.textContent = attrs[key] }
      else if(key.startsWith('on')) { node.addEventListener(key.slice(2), attrs[key]) }
      else { node.setAttribute(key, attrs[key]) }
    }
    for(const child of children || []) {
      if(child !== null && child !== undefined) { node.append(child) }
    }
    return node
  }

  function duration(ms) {
    let s = Math.max(0, Math.floor(ms / 1000))
    if(s < 60) { return s + 's' }
    if(s < 3600) { return Math.floor(s / 60) + 'm' }
    if(s < 86400) { return Math.floor(s / 3600) + 'h' + (Math.floor(s / 60) % 60) + 'm' }
    return Math.floor(s / 86400) + 'd' + (Math.floor(s / 3600) % 24) + 'h'
  }

  function until(time) {
    return time ? duration(time - Date.now()) + ' left' : 'permanent'
  }

  function fixed(value) {
    return value >= 10 ? String(Math.round(value)) : (Math.round(value * 10) / 10).toFixed(1)
  }

  function can(action) {
    return latest.can.indexOf(action) >= 0
  }

  function notice(text, bad) {
    let box = $('notice')
    box.textContent = text || ''
    box.className = 'notice' + (bad ? ' bad' : '')
    box.hidden = !text
  }

  async function api(method, path, body) {
    let options = { method: method, credentials: 'same-origin', headers: {} }
    if(method === 'POST') {
      options.headers['Content-Type'] = 'application/json'
      if(csrf) { options.headers['X-Admin-Csrf'] = csrf }
      options.body = JSON.stringify(body || {})
    }
    let res = await fetch(path, options)
    let data = {}
    try { data = await res.json() } catch(e) {}
    if(res.status === 401 && path !== '/admin/api/login') {
      showSignin()
      throw new Error(data.error || 'Sign in first.')
    }
    if(!res.ok) { throw new Error(data.error || 'Something went wrong.') }
    return data
  }

  function showSignin() {
    signedIn = false
    csrf = ''
    latest = null
    clearTimeout(timer)
    $('app').hidden = true
    $('signin').hidden = false
    $('username').focus()
  }

  function checkType() {
    let word = $('typeWord').textContent
    $('confirmGo').disabled = !!word && $('confirmType').value.trim().toLowerCase() !== word.toLowerCase()
  }

  function ask(options) {
    let dialog = $('confirm')
    $('confirmTitle').textContent = options.title
    $('confirmText').textContent = options.text || ''
    $('durationField').hidden = !options.duration
    $('reasonField').hidden = !options.reason
    $('typeField').hidden = !options.typeWord
    $('typeWord').textContent = options.typeWord || ''
    $('confirmDuration').value = options.duration || ''
    $('confirmReason').value = ''
    $('confirmType').value = ''
    $('confirmGo').textContent = options.button || 'Confirm'
    checkType()
    return new Promise(function(resolve) {
      answer = resolve
      dialog.returnValue = ''
      dialog.showModal()
      let first = options.typeWord ? $('confirmType') : options.duration ? $('confirmDuration') : options.reason ? $('confirmReason') : $('confirmGo')
      first.focus()
    })
  }

  async function act(body) {
    try {
      let result = await api('POST', '/admin/api/action', body)
      notice(result.message || (result.ok ? 'Done.' : 'That did not work.'), !result.ok)
      refresh()
      return result.ok
    } catch(e) {
      notice(e.message, true)
      return false
    }
  }

  async function confirmAct(options, body) {
    let a = await ask(options)
    if(!a) { return false }
    if(options.duration) { body.duration = a.duration }
    if(options.reason) { body.reason = a.reason }
    return act(body)
  }

  function playerAction(action, p) {
    let name = p.name || 'unnamed'
    if(action === 'whois') { return act({ action: 'whois', id: p.id }) }
    if(action === 'kick') {
      return confirmAct({ title: `Kick ${name}?`, text: 'They can join again right away.', reason: true, button: 'Kick' }, { action: 'kick', id: p.id })
    }
    if(action === 'mute') {
      return confirmAct({ title: `Mute ${name}?`, text: 'They can still play but not chat.', duration: '10m', reason: true, button: 'Mute' }, { action: 'mute', id: p.id })
    }
    return confirmAct({ title: `Ban ${name}?`, text: 'Bans their IP, so others on the same connection too. Empty time is permanent.', duration: '1d', reason: true, typeWord: name, button: 'Ban' }, { action: 'ban', id: p.id })
  }

  function unban(key, label) {
    return confirmAct({ title: `Unban ${label}?`, text: 'They can join again right away.', button: 'Unban' }, { action: 'unban', key: key })
  }

  function table(id, headers, rows, empty) {
    let t = $(id)
    t.replaceChildren()
    if(!rows.length) {
      t.append(el('tbody', {}, [el('tr', {}, [el('td', { class: 'empty', text: empty })])]))
      return
    }
    let cells = []
    for(const h of headers) { cells.push(el('th', { text: h })) }
    t.append(el('thead', {}, [el('tr', {}, cells)]))
    t.append(el('tbody', {}, rows))
  }

  function renderStats(data) {
    $('statPlayers').textContent = data.players.length
    $('statMenu').textContent = data.menu > 0 ? `${data.menu} more on the menu` : ''
    $('statCpu').textContent = Math.round(data.perf.cpu) + '%'
    $('statMemory').textContent = Math.round(data.perf.rss / 1048576) + ' MB'
    $('statUptime').textContent = duration(data.perf.uptime * 1000)
    let slow = 0
    for(const w of data.perf.workers) {
      for(const d of w.dims) { if(d.slow) { slow ++ } }
    }
    let health = $('health')
    health.textContent = data.perf.locked ? 'Shutting down' : slow ? `${slow} slow` : 'Running smoothly'
    health.className = 'pill ' + (data.perf.locked || slow > 1 ? 'bad' : slow ? 'warn' : 'good')
  }

  function renderChart(data) {
    let chart = $('chart')
    chart.replaceChildren()
    let width = 720, height = 200, left = 36, bottom = 18
    let history = data.history
    let top = 16.7 * 1.2
    for(const h of history) { top = Math.max(top, h.peak) }
    function y(v) { return height - bottom - (Math.min(v, top) / top) * (height - bottom - 8) }
    function x(i) { return left + (history.length > 1 ? i / (history.length - 1) : 0) * (width - left - 6) }
    for(const v of [0, top / 2, top]) {
      chart.append(el('line', { class: 'grid', x1: left, x2: width, y1: y(v), y2: y(v) }))
      chart.append(el('text', { x: 0, y: y(v) + 4, text: fixed(v) + ' ms' }))
    }
    chart.append(el('line', { class: 'budget', x1: left, x2: width, y1: y(16.7), y2: y(16.7) }))
    let points = []
    for(let i = 0; i < history.length; i++) { points.push(`${x(i).toFixed(1)},${y(history[i].peak).toFixed(1)}`) }
    if(points.length) { chart.append(el('polyline', { points: points.join(' ') })) }
  }

  function renderDims(data) {
    let rows = []
    for(const w of data.perf.workers) {
      let dims = w.dims.slice().sort(function(a, b) { return a.paused - b.paused || b.avg - a.avg })
      for(let i = 0; i < dims.length; i++) {
        let d = dims[i]
        let top = d.top.filter(function(t) { return t[1] >= 20 }).map(function(t) { return `${t[0]} (${t[1]})` }).join(', ')
        let restart = null
        if(i === 0 && can('restart')) {
          restart = el('button', { class: 'small danger', text: 'Restart', onclick: function() {
            confirmAct({ title: `Restart ${w.type}?`, text: `This restarts the whole ${w.type} worker.`, typeWord: w.type, button: 'Restart' }, { action: 'restart', dim: w.type })
          } })
        }
        rows.push(el('tr', { class: d.slow ? 'slow' : '' }, [
          el('td', {}, [el('strong', { text: d.label }), d.label !== d.name ? el('span', { class: 'muted small', text: ' ' + d.name }) : null]),
          el('td', { text: d.players }),
          el('td', { text: d.paused ? 'paused' : d.tps }),
          el('td', { text: d.paused ? '-' : fixed(d.avg) + ' ms' }),
          el('td', { text: d.paused ? '-' : fixed(d.peak) + ' ms' }),
          el('td', { text: d.paused ? '-' : fixed(d.net) + ' ms' }),
          el('td', { text: d.tanks }),
          el('td', { text: d.bullets }),
          el('td', { text: d.shapes }),
          el('td', { class: 'wrap', text: top }),
          el('td', { text: `${Math.round(w.heap / 1048576)} MB, loop ${fixed(w.loopP99)} ms` }),
          el('td', {}, [restart])
        ]))
      }
    }
    table('dims', ['Dimension', 'Players', 'Ticks/s', 'Tick avg', 'Tick peak', 'Network', 'Tanks', 'Bullets', 'Shapes', 'Most bullets', 'Worker', ''], rows, 'No dimensions are running.')
  }

  function renderPlayers(data) {
    let q = $('filter').value.trim().toLowerCase()
    let list = data.players.filter(function(p) {
      return !q || [p.name, p.account, p.dim, p.dimLabel].some(function(v) { return String(v).toLowerCase().includes(q) })
    })
    list.sort(function(a, b) { return a.dimLabel.localeCompare(b.dimLabel) || a.name.localeCompare(b.name) })
    let showIp = data.players.some(function(p) { return p.ip !== undefined })
    let rows = []
    for(const p of list) {
      let buttons = [el('button', { class: 'small info', text: 'Whois', onclick: function() { playerAction('whois', p) } })]
      if(can('kick')) { buttons.push(el('button', { class: 'small quiet', text: 'Kick', onclick: function() { playerAction('kick', p) } })) }
      if(can('mute') && p.muted === false) { buttons.push(el('button', { class: 'small quiet', text: 'Mute', onclick: function() { playerAction('mute', p) } })) }
      if(can('ban')) { buttons.push(el('button', { class: 'small danger', text: 'Ban', onclick: function() { playerAction('ban', p) } })) }
      let cells = [
        el('td', {}, [el('strong', { text: p.name || 'unnamed' })]),
        el('td', { text: p.account || '-' }),
        el('td', { text: p.dimLabel }),
        el('td', { text: duration(p.playing) }),
        el('td', { text: p.role }),
        el('td', { text: p.muted === false ? '' : 'muted, ' + until(p.muted) })
      ]
      if(showIp) { cells.push(el('td', { text: p.ip || '' })) }
      cells.push(el('td', { class: 'actions' }, buttons))
      rows.push(el('tr', {}, cells))
    }
    let headers = ['Name', 'Account', 'Dimension', 'Playing', 'Role', 'Chat']
    if(showIp) { headers.push('IP') }
    headers.push('')
    table('players', headers, rows, q ? 'Nobody matches that filter.' : 'Nobody is playing right now.')
  }

  function renderMutes(data) {
    let showIp = data.mutes.some(function(m) { return m.ip !== undefined })
    let rows = []
    for(const m of data.mutes) {
      let button = null
      if(can('unmute')) {
        button = el('button', { class: 'small quiet', text: 'Unmute', onclick: function() {
          confirmAct({ title: `Unmute ${m.name}?`, button: 'Unmute' }, { action: 'unmute', key: m.account || m.name })
        } })
      }
      let cells = [el('td', { text: m.name }), el('td', { text: until(m.until) }), el('td', { class: 'wrap', text: m.reason }), el('td', { text: m.by })]
      if(showIp) { cells.push(el('td', { text: m.ip || '' })) }
      cells.push(el('td', {}, [button]))
      rows.push(el('tr', {}, cells))
    }
    let headers = ['Name', 'Time', 'Reason', 'By']
    if(showIp) { headers.push('IP') }
    headers.push('')
    table('mutes', headers, rows, 'Nobody is muted.')
  }

  function renderBans(data) {
    $('bansBox').hidden = !can('ban')
    if(!can('ban')) { return }
    let rows = []
    for(const b of data.bans) {
      rows.push(el('tr', {}, [
        el('td', { text: b.name || '-' }),
        el('td', { text: b.ip }),
        el('td', { text: until(b.until) }),
        el('td', { class: 'wrap', text: b.reason || '' }),
        el('td', { text: b.by || '' }),
        el('td', {}, [el('button', { class: 'small quiet', text: 'Unban', onclick: function() { unban(b.ip, b.name || b.ip) } })])
      ]))
    }
    table('bans', ['Name', 'IP', 'Time', 'Reason', 'By', ''], rows, 'There are no bans.')
  }

  function render(data) {
    latest = data
    csrf = data.me.csrf
    $('who').textContent = `${data.me.account} (${data.me.role})`
    $('announceBox').hidden = !can('announce')
    $('rolesBox').hidden = !can('role')
    renderStats(data)
    renderChart(data)
    renderDims(data)
    renderPlayers(data)
    renderMutes(data)
    renderBans(data)
  }

  async function refresh() {
    clearTimeout(timer)
    try {
      let data = await api('GET', '/admin/api/state')
      $('signin').hidden = true
      $('app').hidden = false
      render(data)
    } catch(e) {
      if(!signedIn) { return }
      if($('app').hidden) { return showSignin() }
      notice('Lost contact with the server: ' + e.message, true)
    }
    timer = setTimeout(refresh, document.hidden ? 15000 : 3000)
  }

  $('confirmType').addEventListener('input', checkType)

  $('confirm').addEventListener('close', function() {
    let resolve = answer
    answer = null
    if(!resolve) { return }
    if($('confirm').returnValue === 'go') { resolve({ duration: $('confirmDuration').value.trim(), reason: $('confirmReason').value.trim() }) }
    else { resolve(null) }
  })

  $('signinForm').addEventListener('submit', async function(event) {
    event.preventDefault()
    $('signinError').textContent = ''
    try {
      await api('POST', '/admin/api/login', { username: $('username').value, password: $('password').value })
      $('password').value = ''
      signedIn = true
      refresh()
    } catch(e) {
      $('signinError').textContent = e.message
    }
  })

  $('signout').addEventListener('click', async function() {
    try { await api('POST', '/admin/api/logout') } catch(e) {}
    showSignin()
  })

  $('filter').addEventListener('input', function() { if(latest) { renderPlayers(latest) } })

  $('announceForm').addEventListener('submit', async function(event) {
    event.preventDefault()
    let text = $('announceText').value.trim()
    if(!text) { return }
    if(await confirmAct({ title: 'Send to everyone?', text: text, button: 'Send' }, { action: 'announce', text: text })) { $('announceText').value = '' }
  })

  $('unbanForm').addEventListener('submit', async function(event) {
    event.preventDefault()
    let key = $('unbanKey').value.trim()
    if(key && await unban(key, key)) { $('unbanKey').value = '' }
  })

  $('roleForm').addEventListener('submit', async function(event) {
    event.preventDefault()
    let account = $('roleAccount').value.trim()
    let role = $('roleValue').value
    if(!account) { return }
    if(!role) { return act({ action: 'role', account: account }) }
    let owner = role === 'owner'
    confirmAct({ title: `Make ${account} ${role}?`, text: owner ? 'Owners can do everything.' : '', typeWord: owner ? account : '', button: 'Apply' }, { action: 'role', account: account, role: role })
  })

  document.addEventListener('visibilitychange', function() { if(!document.hidden && signedIn) { refresh() } })

  signedIn = true
  refresh()
})()
