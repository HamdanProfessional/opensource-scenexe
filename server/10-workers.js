const staffAction = function(type, a, notify) {
  const reply = function(uid, text) {
    if(notify) { return notify(text) }
    let c = uids[uid]
    if(c && c.sendPacket) { c.sendPacket('announcement', text) }
  }
  const drop = function(c, flag) {
    if(flag) { c.sendPacket('flag', flag) }
    c.sendPacket = function() {}
    try { c.close() } catch(e) {}
  }
  const actor = function(id) {
    let c = uids[id]
    return c ? (c.accountName || c.data.name || 'unnamed') : String(id)
  }
  if(type === 'kick') {
    let c = uids[a[0]]
    if(!c) { return reply(a[1], 'That player already left.') }
    console.log('kick', c.accountName || c.data.name, c._ip, 'by', actor(a[1]))
    discordBot.send('gameLogs', `${discordBot.player(c)} was kicked by ${discordBot.clean(actor(a[1]), 60)}`)
    drop(c, 'kicked')
  } else if(type === 'ban') {
    let c = uids[a[0]], me = uids[a[1]]
    if(!c) { return reply(a[1], 'That player already left.') }
    if(!c._ip) { return reply(a[1], `Couldn't find that player's IP.`) }
    if(me && me._ip === c._ip) { return reply(a[1], 'That player has the same IP as you, so banning them would ban you too.') }
    let name = String(a[2] || c.accountName || '').replace(/[\r\n]/g, ' ').slice(0, 50)
    let lines = readBans().filter(l => l.split(' ')[0] !== c._ip)
    lines.push(`${c._ip} ${name}`.trim())
    writeBans(lines)
    for(const k of clients.slice()) { if(k._ip === c._ip) { drop(k, 'banned') } }
    console.log('ban', c._ip, name, 'by', actor(a[1]))
    discordBot.send('gameLogs', `${discordBot.player(c)} was banned by ${discordBot.clean(actor(a[1]), 60)}`)
    reply(a[1], `Banned ${name || c._ip}. Undo with /unban ${c._ip}`)
  } else if(type === 'unban') {
    let key = String(a[0]).toLowerCase(), before = readBans()
    let lines = before.filter(l => {
      let i = l.indexOf(' ')
      let ip = i < 0 ? l : l.slice(0, i), name = i < 0 ? '' : l.slice(i + 1).toLowerCase()
      return ip !== key && name !== key
    })
    if(lines.length === before.length) { return reply(a[1], `No ban found for '${a[0]}'.`) }
    writeBans(lines)
    discordBot.send('gameLogs', `${discordBot.clean(actor(a[1]), 60)} removed ${before.length - lines.length} game ban${before.length - lines.length > 1 ? 's' : ''} for ${discordBot.code(a[0], 60)}`)
    reply(a[1], `Removed ${before.length - lines.length} ban${before.length - lines.length > 1 ? 's' : ''}.`)
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
        if(!e[1][0] in w.stats) {
          w.stats[e[1][0]] = [0, 0]
        }
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
        if(info && info[2]) {
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
    } else if(message[0] === 'restart') {
      w.restart(true)
    } else if(message[0] === 'kick' || message[0] === 'ban' || message[0] === 'unban' || message[0] === 'setRole') {
      staffAction(message[0], message[1])
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

