let reportTimes = {}
setInterval(function() {
  let cutoff = Date.now() - 10 * 60000
  for(let key in reportTimes) {
    if(!reportTimes[key].some(t => t > cutoff)) { delete reportTimes[key] }
  }
}, 10 * 60000)

let perf = require('./shared/perf.js')
let serverStartedAt = Date.now()
let cpuSample = { at: performance.now(), usage: process.cpuUsage(), percent: 0 }
setInterval(function() {
  let now = performance.now(), usage = process.cpuUsage()
  let used = (usage.user - cpuSample.usage.user) + (usage.system - cpuSample.usage.system)
  cpuSample = { at: now, usage: usage, percent: used / 10 / Math.max(1, now - cpuSample.at) }
}, 3000)

let perfReport = function() {
  let list = []
  for(let type in workers) {
    let w = workers[type], info = w.info || {}
    let dims = []
    for(let name in w.stats) {
      let known = w.dims && w.dims[name]
      dims.push(perf.dimRow(name, w.stats[name], known ? known[1][1] || name : name))
    }
    list.push({ type: type, heap: info.heap || 0, loopP99: info.loopP99 || 0, loopMax: info.loopMax || 0, dims: dims })
  }
  return { at: Date.now(), uptime: (Date.now() - serverStartedAt) / 1000, rss: process.memoryUsage().rss, cpu: cpuSample.percent, locked: !!locked, workers: list }
}

let staffAction = function(type, a, notify) {
  let reply = function(uid, text) {
    if(notify) { return notify(text) }
    let c = uids[uid]
    if(c && c.sendPacket) { c.sendPacket('announcement', text) }
  }
  let replyLines = function(uid, lines) {
    if(notify) { return notify(lines.join('\n')) }
    let c = uids[uid]
    if(!c || !c.sendPacket) { return }
    for(let i=lines.length-1;i>=0;i--) { c.sendPacket('announcement', [lines[i], 12000]) }
  }
  let drop = function(c, flag) {
    if(flag) { c.sendPacket('flag', flag) }
    c.sendPacket = function() {}
    try { c.close() } catch(e) {}
  }
  let actor = function(id) {
    let c = uids[id]
    return c ? (c.accountName || c.data.name || 'unnamed') : String(id)
  }
  let tidy = function(text, max) {
    return String(text == null ? '' : text).replace(/\s+/g, ' ').trim().slice(0, max)
  }
  let plural = function(n, word) {
    return `${n} ${word}${n === 1 ? '' : 's'}`
  }
  let left = function(until) {
    return until ? `${durations.format(until - Date.now())} left` : 'permanent'
  }
  let entry = function(label, e) {
    return `${label}: ${left(e.until)}${e.reason ? ', ' + e.reason : ''}${e.by ? ' (by ' + e.by + ')' : ''}`
  }
  let newest = function(list, file, line) {
    let lines = list.slice(-8).reverse().map(line)
    if(list.length > 8) { lines.push(`...and ${list.length - 8} more in ${file}`) }
    return lines
  }
  let because = function(reason) {
    return reason ? ': ' + discordBot.code(reason) : ''
  }
  if(type === 'kick') {
    let c = uids[a[0]]
    if(!c) { return reply(a[1], 'That player already left.') }
    let reason = tidy(a[2], 200)
    console.log('kick', c.accountName || c.data.name, c._ip, 'by', actor(a[1]), reason)
    discordBot.send('gameLogs', `${discordBot.player(c)} was kicked by ${discordBot.clean(actor(a[1]), 60)}${because(reason)}`)
    drop(c, ['kicked', reason ? `Kicked by a moderator: ${reason}` : 'Kicked by a moderator'])
  } else if(type === 'ban') {
    let c = uids[a[0]], me = uids[a[1]]
    if(!c) { return reply(a[1], 'That player already left.') }
    if(!c._ip) { return reply(a[1], `Couldn't find that player's IP.`) }
    if(me && me._ip === c._ip) { return reply(a[1], 'That player has the same IP as you, so banning them would ban you too.') }
    let ms = a[3] > 0 ? a[3] : 0
    let ban = { ip: c._ip, name: tidy(a[2] || c.accountName, 50), until: ms ? Date.now() + ms : 0, reason: tidy(a[4], 200), by: actor(a[1]) }
    let lines = readBans().filter(l => parseBan(l).ip !== c._ip)
    lines.push(formatBan(ban))
    try { writeBans(lines) } catch(e) { return reply(a[1], `Couldn't save banned.txt: ${e.message}`) }
    console.log('ban', c._ip, ban.name, durations.span(ms), 'by', ban.by, ban.reason)
    discordBot.send('gameLogs', `${discordBot.player(c)} was banned ${durations.span(ms)} by ${discordBot.clean(ban.by, 60)}${because(ban.reason)}`)
    reply(a[1], `Banned ${ban.name || c._ip} ${durations.span(ms)}. Undo with /unban ${c._ip}`)
  } else if(type === 'unban') {
    let key = tidy(a[0], 100).toLowerCase(), before = readBans()
    let lines = before.filter(l => {
      let ban = parseBan(l)
      return ban.ip.toLowerCase() !== key && ban.name.toLowerCase() !== key
    })
    let removed = before.length - lines.length, auto = key ? anticheat.unban(key) : false
    if(!removed && !auto) { return reply(a[1], `No ban found for '${tidy(a[0], 60)}'.`) }
    if(removed) {
      try { writeBans(lines) } catch(e) { return reply(a[1], `Couldn't save banned.txt: ${e.message}`) }
    }
    let what = [removed ? plural(removed, 'ban') : '', auto ? 'an anticheat ban' : ''].filter(Boolean).join(' and ')
    console.log('unban', key, what, 'by', actor(a[1]))
    discordBot.send('gameLogs', `${discordBot.clean(actor(a[1]), 60)} removed ${what} for ${discordBot.code(a[0], 60)}`)
    reply(a[1], `Removed ${what}.`)
  } else if(type === 'bans') {
    let list = readBans().map(parseBan).filter(b => !b.until || b.until > Date.now()), auto = anticheat.list()
    if(!list.length && !auto.length) { return reply(a[0], 'There are no bans.') }
    let lines = [`${plural(list.length, 'ban')}${auto.length ? ' and ' + plural(auto.length, 'anticheat ban') : ''}, newest first:`]
    lines.push(...newest(list, 'banned.txt', b => entry(b.ip + (b.name ? ' ' + b.name : ''), b)))
    for(let [key, until] of auto.slice(-4).reverse()) { lines.push(`${key}: anticheat, ${left(until)}`) }
    replyLines(a[0], lines)
  } else if(type === 'mute') {
    let c = uids[a[0]]
    if(!c) { return reply(a[1], 'That player already left.') }
    let ms = a[2] == null ? 10 * 60000 : a[2] > 0 ? a[2] : 0
    let mute = mutes.add(c, ms, tidy(a[3], 200), actor(a[1]), tidy(a[4] || c.data.name, 50))
    let handle = mute.name || mute.account
    console.log('mute', handle, c._ip, durations.span(ms), 'by', mute.by, mute.reason)
    discordBot.send('gameLogs', `${discordBot.player(c)} was muted ${durations.span(ms)} by ${discordBot.clean(mute.by, 60)}${because(mute.reason)}`)
    if(c.sendPacket) { c.sendPacket('announcement', mutes.describe(mute)) }
    reply(a[1], `Muted ${handle || 'them'} ${durations.span(ms)}.`)
  } else if(type === 'unmute') {
    let key = tidy(a[0], 100).toLowerCase(), c = uids[a[2]]
    let gone = mutes.remove(m => mutes.matches(m, c) || (key !== '' && (String(m.name || '').toLowerCase() === key || m.account === key || m.ip === key)))
    if(!gone.length) { return reply(a[1], `No mute found for '${tidy(a[0], 60)}'.`) }
    for(let k of clients) {
      if(gone.some(m => mutes.matches(m, k)) && !mutes.of(k)) { k.sendPacket('announcement', 'You can chat again.') }
    }
    let names = gone.map(m => m.name || m.account || 'unnamed').join(', ')
    console.log('unmute', names, 'by', actor(a[1]))
    discordBot.send('gameLogs', `${discordBot.clean(actor(a[1]), 60)} unmuted ${discordBot.clean(names, 200)}`)
    reply(a[1], `Unmuted ${names}.`)
  } else if(type === 'mutes') {
    let list = mutes.list(), showIp = !!a[1]
    if(!list.length) { return reply(a[0], 'Nobody is muted.') }
    let lines = [`${plural(list.length, 'muted player')}, newest first:`]
    lines.push(...newest(list, 'mutes.json', m => entry((m.name || m.account || 'unnamed') + (showIp && m.ip ? ' ' + m.ip : ''), m)))
    replyLines(a[0], lines)
  } else if(type === 'perf') {
    replyLines(a[0], perf.lines(perfReport()))
  } else if(type === 'whois') {
    let c = uids[a[0]], info = a[2] || {}, showIp = !!a[3]
    if(!c) { return reply(a[1], 'That player already left.') }
    let group = c._ip ? ipGroup(c._ip) : '', shared = 0
    for(let k of clients) {
      if(k !== c && k._ip && ipGroup(k._ip) === group) { shared ++ }
    }
    let where = info.dim || (c.fsocket && c.fsocket.dim ? c.fsocket.dim[1][1] : 'the menu')
    let role = info.role || (c.data.commands && c.data.commands.role) || 'player'
    let lines = [
      `${info.name || c.data.name || 'unnamed'}${info.id >= 0 ? ' (t' + info.id + ')' : ''} in ${where}${info.tank ? ': ' + info.tank + ', level ' + info.level : ''}`,
      `Role ${role}, ${c.accountName ? 'account ' + c.accountName : 'not signed in'}, playing for ${c.data.joinedAt ? durations.format(Date.now() - c.data.joinedAt) : 'a moment'}.`,
      `${showIp && c._ip ? 'IP ' + c._ip + ', ' : ''}${plural(shared, 'other connection')} from the same network.`
    ]
    let mute = mutes.of(c)
    if(mute) { lines.push(`Muted, ${left(mute.until)}${mute.reason ? ': ' + mute.reason : ''}`) }
    replyLines(a[1], lines)
  } else if(type === 'report') {
    let me = uids[a[1]], c = uids[a[0]]
    if(!me) { return }
    let key = me._ip ? ipGroup(me._ip) : String(a[1]), now = Date.now()
    let recent = (reportTimes[key] || []).filter(t => t > now - 10 * 60000)
    reportTimes[key] = recent
    if(recent.length >= 5) { return reply(a[1], 'Too many reports. Try again later.') }
    recent.push(now)
    let reason = tidy(a[2], 300), where = discordBot.dimLabel(a[3] || ''), targetName = tidy(a[4], 50) || 'unnamed', myName = tidy(a[5], 50) || me.data.name || 'unnamed'
    let target = c ? discordBot.player(c, targetName) : `**${discordBot.clean(targetName, 50)}** (left)`
    console.log('report', myName, '->', targetName, reason)
    discordBot.send('commandLogs', `${discordBot.player(me, myName)} reported ${target} in *${discordBot.clean(where, 50)}*${because(reason)}`)
    let alert = `Report from ${myName}: ${targetName} in ${where}: ${reason}`
    for(let k of clients) {
      if(k !== me && k.fsocket && k.data.commands && staffRoles.indexOf(k.data.commands.role) > 0) { k.sendPacket('announcement', [alert, 10000]) }
    }
    reply(a[1], 'Report sent.')
  } else if(type === 'setRole') {
    let account = String(a[0]).toLowerCase(), role = a[1]
    if(!role) { return reply(a[2], `${account} is ${commandData.role(account)}.`) }
    if(staffRoles.indexOf(role) < 0) { return reply(a[2], `Roles are: ${staffRoles.join(', ')}.`) }
    commandData.get()
    if(role === 'player') {
      delete commandData.data[account]
    } else {
      commandData.data[account] = { role: role }
    }
    try { commandData.set() } catch(e) { return reply(a[2], `Couldn't save command-data.txt: ${e.message}`) }
    console.log('role', account, role, 'by', actor(a[2]))
    discordBot.send('gameLogs', `${discordBot.clean(account, 50)} is now ${role} (set by ${discordBot.clean(actor(a[2]), 60)})`)
    reply(a[2], `${account} is now ${role}. It applies when they rejoin or change dimension.`)
  }
}

const workers = {}
const create = function(type, port, replace) {
  console.log('creating new', type)
  if(workers[type] && !replace) { return console.log(`Cannot create duplicate worker '${type}'`) }
  const worker = new Worker(workerFile, {
    workerData: {
      options: {
        engineFile: engineFile,
        tankDataDir: tankDataDir,
        port: port,
        testing: args.testing,
        codes: game.codes,
        secret: secret,
        network: config.network || {},
        tickRate: config.tickRate || 60,
        start: `load('./dims/${type.replace(':', '-')}.js')`
      }
    }
  })

  worker.on('message', function(message) {
    if(message[0] === 'dims') {
      w.dims = {}
      let l = message[1]
      for(let i=0,k=l.length;i<k;i++) {
        let e = l[i]
        w.dims[e[1][0]] = e
      }
      const all = []
      for(let q in workers) { for(let n in (workers[q].dims || {})) { all.push(n) } }
      for(let q in workers) { if(workers[q].worker) { workers[q].worker.postMessage(['allDims', all]) } }
    } else if(message[0] === 'achievement') {
      console.log('receive', message[1])
      let accountName = message[1][0], ach = message[1][1]
      addAchievement(accountName, ach)
    } else if(message[0] === 'updateGallery') {
      let accountName = message[1][0]
      Accounts.fromUsername(accountName).then(function(d) {
        if(d.success) {
          let a = d.account
          let sides = message[1][1], radiant = message[1][2]
          let r = updateGallery(a.gallery, sides, radiant)
          if(r) {
            d.save()
            console.log(accountName, sides, radiant)
          }
        }
      })
    } else if(message[0] === 'polygon') {
	    let accountName = message[1][0], radiant = message[1][1]
	    Accounts.fromUsername(accountName).then(function(d) {
		    if(d.success) {
			    let a = d.account
			    if(a.polygonKills > 0) { a.polygonKills ++ }
			    else { a.polygonKills = 1 }
			    if(radiant) {
				    if(a.radiantPolygonKills > 0) { a.radiantPolygonKills ++ }
				    else { a.radiantPolygonKills = 1 }
				    if(a.radiantPolygonKills >= 250) {
					    addAchievement(d, { id:21 }, 1)
				    }
			    }
			    d.save()
		    }
	    })
    } else if(message[0] === 'dimension') {
	    let accountName = message[1][0], str = message[1][1]
	    if(!(str === 'crossroads' || str === 'abyss')) { return }
      console.log(str, accountName)
	    Accounts.fromUsername(accountName).then(function(d) {
		    if(d.success) {
			    let a = d.account
			    if(a[str] > 0) {
				    a[str] ++
			    } else {
				    a[str] = 1
			    }
			    if(str === 'crossroads' && a.crossroads >= 20) {
				    addAchievement(d, { id:20 }, 1)
			    }
			    d.save()
		    }
	    })
    } else if(message[0] === 'kill') {
      let accountName = message[1][0], str = message[1][1]
	    if(!(str === 'celestialKills' || str === 'tankKills')) { return }
      Accounts.fromUsername(accountName).then(function(d) {
        if(d.success) {
          let a = d.account
          if(a[str] > 0) {
            a[str] ++
          } else {
            a[str] = 1
          }
          console.log(str, a[str])
          if(str === 'celestialKills' && a.celestialKills >= 5) {
            addAchievement(d, {
              id: 7
            }, 1)
            if(a.celestialKills >= 20) {
              addAchievement(d, {
                id: 19
              }, 1)
              if(a.celestialKills >= 40) {
                addAchievement(d, {
                  id: 22
                }, 1)
              }
            }
          }
          d.save()
        }
      })
    } else if(message[0] === 'ascension') {
      let accountName = message[1][0]
      discordBot.send('gameLogs', `${discordBot.clean(accountName, 50)} ascended`)
      Accounts.fromUsername(accountName).then(function(d) {
        if(d.success) {
          let a = d.account
          if(a.ascensions > 0) {
            a.ascensions ++
          } else {
            a.ascensions = 1
          }
          if(a.ascensions >= 10) {
            addAchievement(d, {
              id: 15
            }, 1)
          }
          d.save()
        }
      })
    } else if(message[0] === 'gameEnd') {
      let accountName = message[1][0], data = message[1][1]
      Accounts.fromUsername(accountName).then(function(d) {
        if(d.success) {
          let a = d.account
          a.timePlayed += data.timeAlive
          let add = data.stars

          a.stars += Math.round(add)
          let s = Math.round(data.score)
          if(a.maxScore > 0) {
            if(s > a.maxScore) { a.maxScore = s }
          } else { a.maxScore = s }
          d.save()
          console.log(a.username, add, 'stars')
        }
      })
    } else if(message[0] === 'send') {
      let c = uids[message[1][0]]
      if(c) {
        let old = c.fsocket
        c.fsocket.close()
        c.fsocket = false
        c.sending = true
        let dim = message[1][1]
        for(let q in workers) {
          let w = workers[q]
          if(dim in w.dims) {
            let msg = 'Connecting'
            let o = w.dims[dim]
            if(o[1][4]) {
              msg = o[1][4]
            } else if(old.dim) {
              if(old.dim[1][5]) {
                msg = old.dim[1][5]
              }
            }
            c.sendPacket('waiting', [msg])
            return setTimeout(function() {
              c.connect(w, '', dim, message[1][2], message[1][3], message[1][4], message[1][5])
            }, 1500 + 1500 * Math.random())
          }
        }
        c.data.respawnScore = 0
        c.sendPacket('death', [[`Error: Can't find dimension ${dim}`], 0])
      }
    } else if(message[0] === 'sendBot') {
      let dim = message[1][0]
      for(let q in workers) {
        let w = workers[q]
        if(dim in w.dims) {
          return w.worker.postMessage(['addBot', message[1]])
        }
      }
    } else if(message[0] === 'death') {
      let c = uids[message[1][0]]
      if(c) {
        let info = message[1][2]
        if(info && info[2] && !info[3]) {
          let killers = (info[0] || []).slice(0, 3).map(n => discordBot.clean(n, 40) || 'unnamed').join(', ')
          let where = c.fsocket && c.fsocket.dim ? ` in *${discordBot.clean(c.fsocket.dim[1][1], 50)}*` : ''
          discordBot.send('gameLogs', `${discordBot.player(c)} died${killers ? ' to ' + killers : ''}${where} (score ${Math.round(info[2][0]).toLocaleString('en-US')}, level ${info[2][1]}, ${info[2][3]} kills, alive ${discordBot.duration(info[2][2])})`)
        }
        c.data.respawnScore = message[1][1]
        c.data.lastTeam = message[1][3]
        let spectating = message[1][2] && message[1][2][2]
        if(c.fsocket && !spectating) {
          c.fsocket.close()
          c.fsocket = false
        }
        c.sendPacket('death', message[1][2])
        if(locked) {
          c.close()
        }
      }
    } else if(message[0] === 'log') {
      console.log(message[1])
    } else if(message[0] === 'discord') {
      discordBot.fromWorker(message[1])
    } else if(message[0] === 'globalAnnounce') {
      discordBot.send('gameLogs', `Global announcement from in game: ${discordBot.code(message[1])}`)
      for(let q in workers) {
        let w = workers[q]
        w.worker.postMessage(message)
      }
    } else if(message[0] === 'dimStats') {
      w.stats = message[1]
      w.info = message[2] || {}
    } else if(message[0] === 'restart') {
      w.restart(true)
    } else if(['kick', 'ban', 'unban', 'bans', 'mute', 'unmute', 'mutes', 'whois', 'report', 'setRole', 'perf'].indexOf(message[0]) >= 0) {
      staffAction(message[0], message[1])
    } else if(message[0] === 'antilag') {
      discordBot.send('gameStatus', discordBot.clean(message[1], 600))
    }
  });
  let deleted = false
  worker.on('error', function(e) {
    console.log('worker error', type, e)
    discordBot.send('gameStatus', `${type} crashed: ${discordBot.code(e && e.message || e)}`)
  })
  worker.on("exit", function() {
    console.log('exited, creating new')
    if(!locked) { discordBot.send('gameStatus', deleted ? `${type} restarted` : `${type} stopped unexpectedly and is restarting`) }
    create(type, port, true)
  })
  let w = {
    worker: worker,
    typeStr: `dim-${type}`,
    port: port,
    dims: {},
    stats: {},
    restart: function(instant) {
      if(deleted) { return console.error('already deleted') }
      deleted = true
      console.log(`Restarting ${type}`)
      worker.postMessage(instant ? ['exit', true] : ['exit'])
    }
  }
  workers[type] = w
  return w
}

setInterval(function() {
  let total = 0, o = stats()
  for(let k in o) {
    total += o[k][0] || 0
  }
  for(let q in workers) {
    workers[q].worker.postMessage(['totalPlayers', total])
  }
}, 3000)

const stats = function() {
  let o = {}
  for(let q in workers) {
    let w = workers[q]
    o = { ...w.stats, ...o }
  }
  return o
}

setTimeout(function() {
  console.log(stats())
}, 10000)

const playerCount = function() {
  let o = stats()
  for(let i in o) {
    o[i] = o[i][0]
  }
  return o
}

