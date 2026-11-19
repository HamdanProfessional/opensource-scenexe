const anticheat = (function() {
  const settings = {
    maxConnectionsPerIp: envNum('ANTICHEAT_MAX_PER_IP') ?? (config.anticheat && config.anticheat.maxConnectionsPerIp) ?? 3,
    maxPacketBytes: envNum('ANTICHEAT_MAX_PACKET') ?? (config.anticheat && config.anticheat.maxPacketBytes) ?? 65536,
    kickStrikes: (config.anticheat && config.anticheat.kickStrikes) || 30,
    kicksBeforeBan: (config.anticheat && config.anticheat.kicksBeforeBan) || 3,
    banMinutes: (config.anticheat && config.anticheat.banMinutes) || 15,
    exemptIps: (config.anticheat && config.anticheat.exemptIps) || ['127.0.0.1', '::1'],
    totalPerSecond: 160,
  }

  const rates = {
    joinGame: [2, 6],
    chat: [4, 10],
    typing: [10, 30],
    passive: [6, 20],
    firing: [30, 90],
    controlPosition: [40, 120],
    upgradeStat: [40, 120],
    upgradeWeapon: [10, 30],
    upgradeBody: [10, 30],
    direction: [40, 120],
    d: [40, 120],
    token: [2, 6],
    result: [2, 6],
    ping: [5, 15],
    captcha: [2, 6],
    login: [2, 6],
    createAccount: [1, 4],
    editTank: [30, 90],
  }

  const isString = function(value, max) {
    return typeof value === 'string' && value.length <= max
  }
  const isNumber = function(value, min, max) {
    return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max
  }
  const isInteger = function(value, min, max) {
    return Number.isInteger(value) && value >= min && value <= max
  }
  const isPlainObject = function(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
  }

  const shapes = {
    joinGame: v => Array.isArray(v) && v.length <= 3 && isString(v[0], 100) && isString(v[1], 60) && (v[2] == null || isString(v[2], 20)),
    chat: v => isString(v, 2000),
    typing: v => typeof v === 'boolean',
    passive: v => typeof v === 'boolean',
    firing: v => isInteger(v, 0, 3),
    controlPosition: v => Array.isArray(v) && v.length === 2 && isNumber(v[0], -100000, 100000) && isNumber(v[1], -100000, 100000),
    upgradeStat: v => Array.isArray(v) && v.length === 2 && isInteger(v[0], 0, 7) && isInteger(v[1], 0, 15),
    upgradeWeapon: v => isString(v, 100),
    upgradeBody: v => isString(v, 100),
    direction: v => v === false || isNumber(v, 0, 200),
    d: v => isNumber(v, -1000000, 1000000),
    token: v => v == null || isString(v, 200),
    result: v => v == null || isString(v, 200) || isNumber(v, -1e12, 1e12),
    ping: v => v == null,
    captcha: v => isString(v, 200),
    login: v => Array.isArray(v) && v.length === 2 && isString(v[0], 100) && isString(v[1], 200),
    createAccount: v => Array.isArray(v) && v.length === 2 && isString(v[0], 100) && isString(v[1], 200),
    editTank: v => isPlainObject(v),
  }

  const kicks = {}
  const bans = {}
  const logPath = require('path').join(__dirname, 'anticheat-log.txt')

  const log = function(ws, reason) {
    const who = ws.accountName || ws.data && ws.data.name || ''
    const line = `[${new Date().toISOString()}] ${ws._ip} ${who ? '"' + who + '" ' : ''}${reason}`
    console.log('anticheat', line)
    discordBot.send('spam', `${discordBot.player(ws)}${discordBot.ip(ws)} ${discordBot.code(reason)}`)
    try { fs.appendFileSync(logPath, line + '\n') } catch(e) {}
  }

  const exempt = function(ip) {
    return settings.exemptIps.indexOf(ip) >= 0
  }

  const isBanned = function(ip) {
    const key = ipGroup(ip)
    const until = bans[key]
    if(!until) { return false }
    if(until <= Date.now()) {
      delete bans[key]
      return false
    }
    return true
  }

  const ban = function(ip, reason) {
    if(exempt(ip) || isBanned(ip)) { return false }
    const key = ipGroup(ip)
    bans[key] = Date.now() + settings.banMinutes * 60 * 1000
    const line = `[${new Date().toISOString()}] ${ip} temporarily banned for ${settings.banMinutes} minutes: ${reason}`
    console.log('anticheat', line)
    discordBot.send('spam', `${discordBot.code(ip)} temporarily banned for ${settings.banMinutes} minutes: ${discordBot.code(reason)}`)
    try { fs.appendFileSync(logPath, line + '\n') } catch(e) {}
    for(let i=clients.length-1;i>=0;i--) {
      if(ipGroup(clients[i]._ip) === key) { try { clients[i].close() } catch(e) {} }
    }
    return true
  }

  const kick = function(ws, reason) {
    if(ws.anticheat.kicked) { return }
    ws.anticheat.kicked = true
    log(ws, 'kicked: ' + reason)
    const now = Date.now()
    const key = ipGroup(ws._ip)
    const recent = (kicks[key] || []).filter(t => t > now - 10 * 60 * 1000)
    recent.push(now)
    kicks[key] = recent
    if(recent.length >= settings.kicksBeforeBan && !exempt(ws._ip)) {
      bans[key] = now + settings.banMinutes * 60 * 1000
      delete kicks[key]
      log(ws, `temporarily banned for ${settings.banMinutes} minutes`)
    }
    try { ws.sendPacket('flag', 'cheat') } catch(e) {}
    ws.sendPacket = function() {}
    setTimeout(function() { try { ws.close() } catch(e) {} }, 50)
  }

  const strike = function(ws, weight, reason) {
    const state = ws.anticheat
    const now = performance.now()
    state.strikes = Math.max(0, state.strikes - (now - state.lastStrike) / 10000) + weight
    state.lastStrike = now
    if(!state.reasons[reason]) {
      state.reasons[reason] = true
      log(ws, `strike: ${reason}`)
    }
    if(state.strikes >= settings.kickStrikes) {
      kick(ws, Object.keys(state.reasons).join(', '))
    }
  }

  const take = function(bucket, rate, burst, now) {
    bucket.tokens = Math.min(burst, bucket.tokens + (now - bucket.time) / 1000 * rate)
    bucket.time = now
    if(bucket.tokens < 1) { return false }
    bucket.tokens -= 1
    return true
  }

  return {
    settings: settings,
    isBanned: isBanned,
    ban: ban,
    log: log,
    canConnect: function(ip) {
      if(isBanned(ip)) { return 'banned' }
      if(exempt(ip)) { return true }
      const key = ipGroup(ip)
      let count = 0
      for(let i=clients.length-1;i>=0;i--) {
        if(ipGroup(clients[i]._ip) === key && clients[i].data && clients[i].data.open) { count ++ }
      }
      return count < settings.maxConnectionsPerIp ? true : 'concurrent'
    },
    attach: function(ws) {
      const now = performance.now()
      ws.anticheat = {
        strikes: 0,
        lastStrike: now,
        reasons: {},
        kicked: false,
        total: { tokens: settings.totalPerSecond, time: now },
        buckets: {},
        dropped: 0,
        droppedSince: now,
      }
    },
    check: function(ws, data, size) {
      const state = ws.anticheat
      if(!state || state.kicked) { return false }
      if(!Array.isArray(data) || data.length > 2) {
        strike(ws, 10, 'malformed packet')
        return false
      }
      const type = game.codes.send[data[0]]
      if(typeof data[0] !== 'number' || !(type in shapes)) {
        strike(ws, 10, 'unknown packet type')
        return false
      }
      if(size > settings.maxPacketBytes || (type !== 'editTank' && size > 4096)) {
        strike(ws, 10, 'oversized ' + type)
        return false
      }
      if(!shapes[type](data[1])) {
        strike(ws, 4, 'invalid ' + type)
        return false
      }
      const now = performance.now()
      const rate = rates[type]
      const bucket = state.buckets[type] || (state.buckets[type] = { tokens: rate[1], time: now })
      if(!take(state.total, settings.totalPerSecond, settings.totalPerSecond * 2, now) || !take(bucket, rate[0], rate[1], now)) {
        if(now - state.droppedSince > 1000) {
          state.dropped = 0
          state.droppedSince = now
        }
        state.dropped ++
        if(state.dropped > 40) {
          state.dropped = 0
          strike(ws, 6, 'packet flood (' + type + ')')
        }
        return false
      }
      return true
    }
  }
})()
