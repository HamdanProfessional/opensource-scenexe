(function() {
  const COLORS = ['#00b2e1', '#f14e54', '#00e16e', '#be7ff5', '#ffe869', '#fc7677']
  const $ = id => document.getElementById(id)
  let me = null
  let latest = null
  let timer = 0

  const el = function(tag, attrs, children) {
    const node = document.createElement(tag)
    for(const key in attrs || {}) {
      if(key === 'text') { node.textContent = attrs[key] }
      else if(key === 'class') { node.className = attrs[key] }
      else if(key.startsWith('on')) { node.addEventListener(key.slice(2), attrs[key]) }
      else { node.setAttribute(key, attrs[key]) }
    }
    for(const child of children || []) {
      if(child !== null && child !== undefined) { node.append(child) }
    }
    return node
  }

  const svg = function(tag, attrs, text) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag)
    for(const key in attrs) { node.setAttribute(key, attrs[key]) }
    if(text !== undefined) { node.textContent = text }
    return node
  }

  const duration = function(ms) {
    const s = Math.max(0, Math.floor(ms / 1000))
    if(s < 60) { return s + 's' }
    if(s < 3600) { return Math.floor(s / 60) + 'm' }
    if(s < 86400) { return Math.floor(s / 3600) + 'h' + (Math.floor(s / 60) % 60) + 'm' }
    return Math.floor(s / 86400) + 'd' + (Math.floor(s / 3600) % 24) + 'h'
  }

  const until = function(time) {
    return time ? duration(time - Date.now()) + ' left' : 'permanent'
  }

  const fixed = function(value) {
    return value >= 10 ? String(Math.round(value)) : (Math.round(value * 10) / 10).toFixed(1)
  }

  const can = function(action) {
    return !!(latest && latest.can.indexOf(action) >= 0)
  }

  const notice = function(text, bad) {
    const box = $('notice')
    box.textContent = text || ''
    box.className = 'notice' + (bad ? ' bad' : '')
    box.hidden = !text
  }

  const api = async function(path, body) {
    const options = { credentials: 'same-origin', headers: {} }
    if(body) {
      options.method = 'POST'
      options.headers['Content-Type'] = 'application/json'
      if(me) { options.headers['X-Admin-Csrf'] = me.csrf }
      options.body = JSON.stringify(body)
    }
    const res = await fetch(path, options)
    let data = {}
    try { data = await res.json() } catch(e) {}
    if(res.status === 401 && path !== '/admin/api/login') {
      showSignin()
      throw new Error(data.error || 'Sign in first.')
    }
    if(!res.ok) { throw new Error(data.error || 'Something went wrong.') }
    return data
  }

  const showSignin = function() {
    me = null
    latest = null
    clearTimeout(timer)
    $('app').hidden = true
    $('signin').hidden = false
    $('username').focus()
  }

  const ask = function(options) {
    const dialog = $('confirm')
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
    const check = function() {
      $('confirmGo').disabled = !!options.typeWord && $('confirmType').value.trim().toLowerCase() !== options.typeWord.toLowerCase()
    }
    $('confirmType').oninput = check
    check()
    return new Promise(function(resolve) {
      dialog.onclose = function() {
        resolve(dialog.returnValue === 'go' ? { duration: $('confirmDuration').value.trim(), reason: $('confirmReason').value.trim() } : null)
      }
      dialog.returnValue = ''
      dialog.showModal()
      const first = options.typeWord ? $('confirmType') : options.duration ? $('confirmDuration') : options.reason ? $('confirmReason') : $('confirmGo')
      first.focus()
    })
  }

  const act = async function(body) {
    try {
      const result = await api('/admin/api/action', body)
      notice(result.message || (result.ok ? 'Done.' : 'That did not work.'), !result.ok)
      refresh()
    } catch(e) {
      notice(e.message, true)
    }
  }

  const playerAction = async function(action, p) {
    if(action === 'whois') { return act({ action: 'whois', id: p.id }) }
    const name = p.name || 'unnamed'
    if(action === 'kick') {
      const a = await ask({ title: `Kick ${name}?`, text: 'They can join again right away.', reason: true, button: 'Kick' })
      if(a) { act({ action: 'kick', id: p.id, reason: a.reason }) }
    } else if(action === 'mute') {
      const a = await ask({ title: `Mute ${name}?`, text: 'They can still play but not chat.', duration: '10m', reason: true, button: 'Mute' })
      if(a) { act({ action: 'mute', id: p.id, duration: a.duration, reason: a.reason }) }
    } else if(action === 'ban') {
      const a = await ask({ title: `Ban ${name}?`, text: 'This bans their IP, so everyone on the same connection is banned too. Leave the time empty or write perm for a permanent ban.', duration: '1d', reason: true, typeWord: name, button: 'Ban' })
      if(a) { act({ action: 'ban', id: p.id, duration: a.duration, reason: a.reason }) }
    }
  }

  const table = function(id, headers, rows, empty) {
    const t = $(id)
    t.replaceChildren()
    if(!rows.length) {
      t.append(el('tbody', {}, [el('tr', {}, [el('td', { class: 'empty', text: empty })])]))
      return
    }
    t.append(el('thead', {}, [el('tr', {}, headers.map(h => el('th', { text: h })))]))
    t.append(el('tbody', {}, rows))
  }

  const renderStats = function(data) {
    const players = data.players.length
    $('statPlayers').textContent = players
    $('statMenu').textContent = data.menu > 0 ? `${data.menu} more on the menu` : ''
    $('statCpu').textContent = Math.round(data.perf.cpu) + '%'
    $('statMemory').textContent = Math.round(data.perf.rss / 1048576) + ' MB'
    $('statUptime').textContent = duration(data.perf.uptime * 1000)
    $('statLocked').textContent = data.perf.locked ? 'Shutting down' : ''
    const dims = data.perf.workers.flatMap(w => w.dims)
    const slow = dims.filter(d => !d.paused && (d.tps < 50 || d.peak > 16.7 || d.avg > 8.3))
    const health = $('health')
    health.textContent = data.perf.locked ? 'Shutting down' : slow.length ? `${slow.length} slow` : 'Running smoothly'
    health.className = 'pill ' + (data.perf.locked || slow.length > 1 ? 'bad' : slow.length ? 'warn' : 'good')
  }

  const renderChart = function(data) {
    const chart = $('chart')
    chart.replaceChildren()
    const width = 720, height = 200, left = 36, bottom = 18
    const history = data.history
    const totals = {}
    for(const h of history) {
      for(const name in h.dims) { totals[name] = (totals[name] || 0) + h.dims[name][0] }
    }
    const names = Object.keys(totals).sort((a, b) => totals[b] - totals[a]).slice(0, COLORS.length)
    let top = 16.7 * 1.2
    for(const h of history) {
      for(const name of names) { if(h.dims[name]) { top = Math.max(top, h.dims[name][1]) } }
    }
    const y = v => height - bottom - (Math.min(v, top) / top) * (height - bottom - 8)
    const x = i => left + (history.length > 1 ? i / (history.length - 1) : 0) * (width - left - 6)
    for(const v of [0, top / 2, top]) {
      chart.append(svg('line', { class: 'grid', x1: left, x2: width, y1: y(v), y2: y(v) }))
      chart.append(svg('text', { x: 0, y: y(v) + 4 }, fixed(v) + ' ms'))
    }
    chart.append(svg('line', { class: 'budget', x1: left, x2: width, y1: y(16.7), y2: y(16.7) }))
    const legend = $('legend')
    legend.replaceChildren()
    names.forEach(function(name, n) {
      const points = []
      history.forEach(function(h, i) { if(h.dims[name]) { points.push(`${x(i).toFixed(1)},${y(h.dims[name][1]).toFixed(1)}`) } })
      if(points.length) { chart.append(svg('polyline', { points: points.join(' '), stroke: COLORS[n] })) }
      const label = el('span', { text: name })
      label.style.setProperty('--swatch', COLORS[n])
      legend.append(label)
    })
    if(!names.length) { legend.append(el('span', { class: 'muted', text: 'Nothing has been running yet. The chart shows the slowest tick every 5 seconds.' })) }
    else { legend.append(el('span', { class: 'muted', text: 'Lines are the slowest tick in each 5 seconds.' })) }
  }

  const renderDims = function(data) {
    const rows = []
    for(const w of data.perf.workers) {
      for(const d of w.dims.slice().sort((a, b) => a.paused - b.paused || b.avg - a.avg)) {
        const slow = !d.paused && (d.tps < 50 || d.peak > 16.7 || d.avg > 8.3)
        const top = d.top.filter(t => t[1] >= 20).map(t => `${t[0]} (${t[1]})`).join(', ')
        const restart = can('restart') ? el('button', { class: 'small danger', text: 'Restart', onclick: async function() {
          const a = await ask({ title: `Restart ${w.type}?`, text: `This restarts the whole ${w.type} worker. Everyone in it is moved to another dimension and its bots, shapes and walls start over.`, typeWord: w.type, button: 'Restart' })
          if(a) { act({ action: 'restart', dim: w.type }) }
        } }) : null
        rows.push(el('tr', { class: slow ? 'slow' : '' }, [
          el('td', {}, [el('strong', { text: d.label }), d.label !== d.name ? el('span', { class: 'muted small', text: ' ' + d.name }) : null]),
          el('td', { text: d.players }),
          el('td', { class: slow && d.tps < 50 ? 'slowText' : '', text: d.paused ? 'paused' : d.tps }),
          el('td', { class: slow && d.avg > 8.3 ? 'slowText' : '', text: d.paused ? '-' : fixed(d.avg) + ' ms' }),
          el('td', { class: slow && d.peak > 16.7 ? 'slowText' : '', text: d.paused ? '-' : fixed(d.peak) + ' ms' }),
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

  const renderPlayers = function(data) {
    const q = $('filter').value.trim().toLowerCase()
    const list = data.players.filter(p => !q || [p.name, p.account, p.dim, p.dimLabel].some(v => String(v).toLowerCase().includes(q)))
    list.sort((a, b) => a.dimLabel.localeCompare(b.dimLabel) || a.name.localeCompare(b.name))
    const showIp = data.players.some(p => p.ip !== undefined)
    const rows = list.map(function(p) {
      const buttons = [el('button', { class: 'small info', text: 'Whois', onclick: () => playerAction('whois', p) })]
      if(can('kick')) { buttons.push(el('button', { class: 'small quiet', text: 'Kick', onclick: () => playerAction('kick', p) })) }
      if(can('mute') && p.muted === false) { buttons.push(el('button', { class: 'small quiet', text: 'Mute', onclick: () => playerAction('mute', p) })) }
      if(can('ban')) { buttons.push(el('button', { class: 'small danger', text: 'Ban', onclick: () => playerAction('ban', p) })) }
      const cells = [
        el('td', {}, [el('strong', { text: p.name || 'unnamed' })]),
        el('td', { text: p.account || '-' }),
        el('td', { text: p.dimLabel }),
        el('td', { text: duration(p.playing) }),
        el('td', { text: p.role }),
        el('td', { text: p.muted === false ? '' : 'muted, ' + until(p.muted) })
      ]
      if(showIp) { cells.push(el('td', { text: p.ip || '' })) }
      cells.push(el('td', { class: 'actions' }, buttons))
      return el('tr', {}, cells)
    })
    const headers = ['Name', 'Account', 'Dimension', 'Playing', 'Role', 'Chat'].concat(showIp ? ['IP'] : []).concat([''])
    table('players', headers, rows, q ? 'Nobody matches that filter.' : 'Nobody is playing right now.')
  }

  const renderMutes = function(data) {
    const showIp = data.mutes.some(m => m.ip !== undefined)
    const rows = data.mutes.map(function(m) {
      const button = can('unmute') ? el('button', { class: 'small quiet', text: 'Unmute', onclick: async function() {
        const a = await ask({ title: `Unmute ${m.name}?`, button: 'Unmute' })
        if(a) { act({ action: 'unmute', key: m.account || m.name }) }
      } }) : null
      return el('tr', {}, [el('td', { text: m.name }), el('td', { text: until(m.until) }), el('td', { class: 'wrap', text: m.reason }), el('td', { text: m.by })].concat(showIp ? [el('td', { text: m.ip || '' })] : []).concat([el('td', {}, [button])]))
    })
    table('mutes', ['Name', 'Time', 'Reason', 'By'].concat(showIp ? ['IP'] : []).concat(['']), rows, 'Nobody is muted.')
  }

  const renderBans = function(data) {
    $('bansBox').hidden = !can('ban')
    if(!can('ban')) { return }
    const rows = data.bans.map(function(b) {
      return el('tr', {}, [
        el('td', { text: b.name || '-' }),
        el('td', { text: b.ip }),
        el('td', { text: until(b.until) }),
        el('td', { class: 'wrap', text: b.reason || '' }),
        el('td', { text: b.by || '' }),
        el('td', {}, [el('button', { class: 'small quiet', text: 'Unban', onclick: () => unban(b.ip, b.name || b.ip) })])
      ])
    })
    table('bans', ['Name', 'IP', 'Time', 'Reason', 'By', ''], rows, 'There are no bans.')
  }

  const unban = async function(key, label) {
    const a = await ask({ title: `Unban ${label}?`, text: 'They can join again right away.', button: 'Unban' })
    if(a) { act({ action: 'unban', key: key }) }
  }

  const render = function(data) {
    latest = data
    me = data.me
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

  const refresh = async function() {
    clearTimeout(timer)
    try {
      const data = await api('/admin/api/state')
      $('signin').hidden = true
      $('app').hidden = false
      render(data)
    } catch(e) {
      if(!me && $('app').hidden) { return showSignin() }
      notice('Lost contact with the server: ' + e.message, true)
    }
    if(me) { timer = setTimeout(refresh, document.hidden ? 15000 : 3000) }
  }

  $('signinForm').addEventListener('submit', async function(event) {
    event.preventDefault()
    $('signinError').textContent = ''
    try {
      await api('/admin/api/login', { username: $('username').value, password: $('password').value })
      $('password').value = ''
      me = {}
      refresh()
    } catch(e) {
      $('signinError').textContent = e.message
    }
  })

  $('signout').addEventListener('click', async function() {
    try { await api('/admin/api/logout', {}) } catch(e) {}
    showSignin()
  })

  $('filter').addEventListener('input', function() { if(latest) { renderPlayers(latest) } })

  $('announceForm').addEventListener('submit', async function(event) {
    event.preventDefault()
    const text = $('announceText').value.trim()
    if(!text) { return }
    const a = await ask({ title: 'Send to everyone?', text: text, button: 'Send' })
    if(a) {
      await act({ action: 'announce', text: text })
      $('announceText').value = ''
    }
  })

  $('unbanForm').addEventListener('submit', function(event) {
    event.preventDefault()
    const key = $('unbanKey').value.trim()
    if(key) { unban(key, key).then(() => { $('unbanKey').value = '' }) }
  })

  $('roleForm').addEventListener('submit', async function(event) {
    event.preventDefault()
    const account = $('roleAccount').value.trim()
    const role = $('roleValue').value
    if(!account) { return }
    if(!role) { return act({ action: 'role', account: account }) }
    const a = await ask({ title: `Make ${account} ${role}?`, text: role === 'owner' ? 'Owners can do everything, including changing roles and restarting the server.' : '', typeWord: role === 'owner' ? account : '', button: 'Apply' })
    if(a) { act({ action: 'role', account: account, role: role }) }
  })

  document.addEventListener('visibilitychange', function() { if(!document.hidden && me) { refresh() } })

  me = {}
  refresh()
})()
