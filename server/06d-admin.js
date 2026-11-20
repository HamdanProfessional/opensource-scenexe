const adminPanel = (function() {
  const crypto = require('crypto')
  const path = require('path')
  const ROLES = ['player', 'mod', 'admin', 'owner']
  const SESSION_MS = 12 * 60 * 60 * 1000
  const COOKIE = 'scx_admin'
  const HISTORY = 240
  const FILES = {
    '/admin': ['index.html', 'text/html; charset=utf-8'],
    '/admin/': ['index.html', 'text/html; charset=utf-8'],
    '/admin/admin.js': ['admin.js', 'application/javascript; charset=utf-8'],
    '/admin/admin.css': ['admin.css', 'text/css; charset=utf-8']
  }
  const NEEDS = { whois: 'mod', kick: 'mod', mute: 'mod', unmute: 'mod', ban: 'admin', unban: 'admin', announce: 'admin', restart: 'owner', role: 'owner' }
  const HEADERS = {
    'Cache-Control': 'no-store',
    'X-Frame-Options': 'DENY',
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"
  }
  const sessions = new Map()
  const history = []

  const level = function(role) {
    return Math.max(0, ROLES.indexOf(role))
  }

  const hash = function(token) {
    return crypto.createHash('sha256').update(token).digest('hex')
  }

  const cookies = function(req) {
    const out = {}
    for(const part of String(req.headers.cookie || '').split(';')) {
      const at = part.indexOf('=')
      if(at > 0) { out[part.slice(0, at).trim()] = part.slice(at + 1).trim() }
    }
    return out
  }

  const secure = function(req) {
    return String(req.headers['x-forwarded-proto'] || '').toLowerCase() === 'https'
  }

  const send = function(res, status, body, extra) {
    res.writeHead(status, Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, HEADERS, extra || {}))
    res.end(JSON.stringify(body))
  }

  const readBody = function(req) {
    return new Promise(function(resolve) {
      let size = 0, chunks = [], done = false
      const finish = function(value) {
        if(done) { return }
        done = true
        resolve(value)
      }
      req.on('data', function(chunk) {
        size += chunk.length
        if(size > 8192) {
          finish(null)
          req.destroy()
          return
        }
        chunks.push(chunk)
      })
      req.on('end', function() {
        try {
          const value = JSON.parse(Buffer.concat(chunks).toString() || '{}')
          finish(value && typeof value === 'object' && !Array.isArray(value) ? value : null)
        } catch(e) {
          finish(null)
        }
      })
      req.on('error', function() { finish(null) })
      setTimeout(function() { finish(null) }, 10000)
    })
  }

  const sameOrigin = function(req) {
    const origin = req.headers.origin
    if(!origin) { return true }
    try {
      return new URL(origin).host === String(req.headers.host || '')
    } catch(e) {
      return false
    }
  }

  const session = function(req) {
    const token = cookies(req)[COOKIE]
    if(!token || !/^[0-9a-f]{64}$/.test(token)) { return null }
    const key = hash(token)
    const s = sessions.get(key)
    if(!s) { return null }
    if(s.expires < Date.now()) {
      sessions.delete(key)
      return null
    }
    s.role = commandData.role(s.account)
    if(level(s.role) < level('mod')) {
      sessions.delete(key)
      return null
    }
    s.key = key
    return s
  }

  const audit = function(s, text) {
    console.log('admin panel:', s.account, text)
    discordBot.send('commandLogs', `${discordBot.clean(s.account, 50)} (${s.role}) on the web panel: ${discordBot.clean(text, 300)}`)
  }

  const record = function() {
    const report = perfReport()
    const dims = {}
    let players = 0
    for(const w of report.workers) {
      for(const d of w.dims) {
        players += d.players
        if(!d.paused) { dims[d.name] = [Math.round(d.avg * 100) / 100, Math.round(d.peak * 10) / 10] }
      }
    }
    history.push({ t: report.at, players: players, cpu: Math.round(report.cpu), rss: Math.round(report.rss / 1048576), dims: dims })
    if(history.length > HISTORY) { history.shift() }
  }
  setInterval(record, 5000)

  setInterval(function() {
    const now = Date.now()
    for(const [key, s] of sessions) {
      if(s.expires < now) { sessions.delete(key) }
    }
  }, 10 * 60 * 1000)

  const inGame = function() {
    return clients.filter(function(c) { return c.fsocket && c.fsocket.dim && c.data })
  }

  const findClient = function(id) {
    return inGame().find(function(c) { return c.data.id === id }) || null
  }

  const state = function(s) {
    const showIp = level(s.role) >= level('admin')
    const now = Date.now()
    const players = inGame().map(function(c) {
      const muted = mutes.of(c)
      return {
        id: c.data.id,
        name: String(c.data.name || ''),
        account: c.accountName || '',
        dim: c.fsocket.dim[1][0],
        dimLabel: c.fsocket.dim[1][1] || c.fsocket.dim[1][0],
        role: (c.data.commands && c.data.commands.role) || 'player',
        playing: c.data.joinedAt ? now - c.data.joinedAt : 0,
        muted: muted ? (muted.until || 0) : false,
        ip: showIp ? c._ip || '' : undefined
      }
    })
    const bans = showIp ? readBans().map(parseBan).filter(function(b) { return !b.until || b.until > now }).reverse() : []
    const muteList = mutes.list().slice().reverse().map(function(m) {
      return { name: m.name || m.account || 'unnamed', account: m.account || '', until: m.until || 0, reason: m.reason || '', by: m.by || '', ip: showIp ? m.ip || '' : undefined }
    })
    return {
      me: { account: s.account, role: s.role, csrf: s.csrf },
      can: Object.keys(NEEDS).filter(function(a) { return level(s.role) >= level(NEEDS[a]) }),
      perf: perfReport(),
      lines: perf.lines(perfReport()),
      history: history,
      players: players,
      menu: clients.length - players.length,
      bans: bans,
      mutes: muteList
    }
  }

  const outranked = function(s, c) {
    if(s.role === 'owner') { return false }
    const theirs = c.accountName ? commandData.role(c.accountName) : 'player'
    return level(theirs) >= level(s.role)
  }

  const run = function(s, body) {
    const action = String(body.action || '')
    if(!(action in NEEDS)) { return { ok: false, message: 'Unknown action.' } }
    if(level(s.role) < level(NEEDS[action])) { return { ok: false, message: `You need to be ${NEEDS[action]} or higher for that.` } }
    const actor = `${s.account} (web panel)`
    const reason = String(body.reason || '').slice(0, 200)
    let note = ''
    const notify = function(text) { note = text }
    if(['whois', 'kick', 'mute', 'ban'].indexOf(action) >= 0) {
      const c = findClient(Number(body.id))
      if(!c) { return { ok: false, message: 'That player already left.' } }
      if(action !== 'whois' && outranked(s, c)) { return { ok: false, message: 'That player has the same or a higher role than you.' } }
      const name = String(c.data.name || 'unnamed')
      if(action === 'whois') {
        staffAction('whois', [c.data.id, actor, null, level(s.role) >= level('admin')], notify)
        return { ok: true, message: note }
      }
      let ms = null
      if(body.duration !== undefined && String(body.duration).trim() !== '') {
        ms = durations.parse(String(body.duration))
        if(ms === null) { return { ok: false, message: 'Use a time like 30m, 2h, 7d or perm.' } }
      }
      if(action === 'kick') {
        staffAction('kick', [c.data.id, actor, reason], notify)
        audit(s, `kicked ${name}${reason ? ': ' + reason : ''}`)
        return { ok: !note, message: note || `Kicked ${name}.` }
      }
      if(action === 'mute') {
        staffAction('mute', [c.data.id, actor, ms, reason, name], notify)
        audit(s, `muted ${name}`)
        return { ok: true, message: note }
      }
      staffAction('ban', [c.data.id, actor, c.accountName || name, ms || 0, reason], notify)
      audit(s, `banned ${name}`)
      return { ok: /^Banned/.test(note), message: note }
    }
    if(action === 'unmute' || action === 'unban') {
      const key = String(body.key || '').slice(0, 100)
      if(!key) { return { ok: false, message: 'Say who.' } }
      staffAction(action, action === 'unmute' ? [key, actor, -1] : [key, actor], notify)
      audit(s, `${action} ${key}`)
      return { ok: /^(Unmuted|Removed)/.test(note), message: note }
    }
    if(action === 'announce') {
      const text = String(body.text || '').replace(/\s+/g, ' ').trim().slice(0, 200)
      if(!text) { return { ok: false, message: 'Write the announcement first.' } }
      for(const type in workers) { workers[type].worker.postMessage(['globalAnnounce', text]) }
      audit(s, `announced ${text}`)
      return { ok: true, message: 'Announcement sent.' }
    }
    if(action === 'restart') {
      const type = String(body.dim || '')
      const owner = Object.keys(workers).find(function(t) { return t === type || (workers[t].dims && type in workers[t].dims) })
      if(!owner) { return { ok: false, message: 'There is no dimension by that name.' } }
      workers[owner].restart(true)
      audit(s, `restarted ${owner}`)
      return { ok: true, message: `Restarting ${owner}. Players there are moved to another dimension.` }
    }
    if(action === 'role') {
      const account = String(body.account || '').trim().slice(0, 30)
      const role = String(body.role || '')
      if(!account) { return { ok: false, message: 'Say which account.' } }
      if(role && ROLES.indexOf(role) < 0) { return { ok: false, message: 'Pick player, mod, admin or owner.' } }
      if(role && account.toLowerCase() === s.account.toLowerCase()) { return { ok: false, message: 'You can\'t change your own role here.' } }
      staffAction('setRole', role ? [account, role, actor] : [account, null, actor], notify)
      if(role) { audit(s, `set ${account} to ${role}`) }
      return { ok: true, message: note }
    }
    return { ok: false, message: 'Unknown action.' }
  }

  const login = async function(req, res, ip) {
    if(!sameOrigin(req)) { return send(res, 403, { error: 'Wrong origin.' }) }
    const body = await readBody(req)
    if(!body) { return send(res, 400, { error: 'Bad request.' }) }
    const username = String(body.username || '').trim().toLowerCase().slice(0, 30)
    const password = String(body.password || '').slice(0, 200)
    const ipKey = 'admin-ip:' + ipGroup(ip)
    const userKey = 'admin-user:' + username
    if(attempts.blocked(ipKey, 6) || attempts.blocked(userKey, 10)) {
      return send(res, 429, { error: 'Too many wrong passwords. Try again in a few minutes.' })
    }
    const wrong = function() {
      attempts.add(ipKey)
      attempts.add(userKey)
      send(res, 401, { error: 'Wrong username or password.' })
    }
    if(!username || !password) { return wrong() }
    const found = await Accounts.fromUsername(username)
    if(!found || !found.success) { return wrong() }
    const result = await checkPassword(found.account, password)
    if(!result.ok) { return wrong() }
    attempts.clear(ipKey)
    const account = found.account.username
    const role = commandData.role(account)
    if(level(role) < level('mod')) {
      console.log('admin panel: refused', account, 'from', ip)
      return send(res, 403, { error: 'That account is not staff.' })
    }
    const token = crypto.randomBytes(32).toString('hex')
    const s = { account: account, role: role, ip: ip, csrf: crypto.randomBytes(24).toString('hex'), expires: Date.now() + SESSION_MS }
    sessions.set(hash(token), s)
    audit(s, `signed in from ${ip}`)
    send(res, 200, { ok: true }, { 'Set-Cookie': `${COOKIE}=${token}; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=${SESSION_MS / 1000}${secure(req) ? '; Secure' : ''}` })
  }

  const handle = function(req, res, pathname, ip) {
    if(FILES[pathname]) {
      if(req.method !== 'GET' && req.method !== 'HEAD') { return send(res, 405, { error: 'Method not allowed.' }) }
      const [file, type] = FILES[pathname]
      let text
      try {
        text = fs.readFileSync(path.join('admin', file))
      } catch(e) {
        return send(res, 404, { error: 'The admin panel files are missing.' })
      }
      res.writeHead(200, Object.assign({ 'Content-Type': type }, HEADERS))
      return res.end(text)
    }
    if(pathname === '/admin/api/login') {
      if(req.method !== 'POST') { return send(res, 405, { error: 'Method not allowed.' }) }
      login(req, res, ip).catch(function(e) {
        console.log('admin panel login error', e)
        send(res, 500, { error: 'Something went wrong.' })
      })
      return
    }
    const s = session(req)
    if(!s) { return send(res, 401, { error: 'Sign in first.' }) }
    if(pathname === '/admin/api/state') {
      if(req.method !== 'GET') { return send(res, 405, { error: 'Method not allowed.' }) }
      return send(res, 200, state(s))
    }
    if(req.method !== 'POST') { return send(res, 405, { error: 'Method not allowed.' }) }
    if(!sameOrigin(req) || req.headers['x-admin-csrf'] !== s.csrf) { return send(res, 403, { error: 'Reload the page and try again.' }) }
    if(pathname === '/admin/api/logout') {
      sessions.delete(s.key)
      return send(res, 200, { ok: true }, { 'Set-Cookie': `${COOKIE}=; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=0` })
    }
    if(pathname === '/admin/api/action') {
      readBody(req).then(function(body) {
        if(!body) { return send(res, 400, { error: 'Bad request.' }) }
        let result
        try {
          result = run(s, body)
        } catch(e) {
          console.log('admin panel action error', e)
          result = { ok: false, message: 'Something went wrong.' }
        }
        send(res, 200, result)
      })
      return
    }
    send(res, 404, { error: 'Not found.' })
  }

  return { handle: handle, sessions: sessions }
})()
