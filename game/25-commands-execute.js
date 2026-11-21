    roles: ['player', 'mod', 'admin', 'owner'],
    level: function(role) {
      let i = commands.roles.indexOf(role)
      return i < 0 ? 0 : i
    },
    info: {
      help:            ['player', 'General',    '/help [command]',                 'Lists the commands you can use, or explains one command.'],
      report:          ['player', 'General',    '/report <player> <reason>',       'Reports a player to the moderators.'],

      kick:            ['mod',    'Moderation', '/kick <player> [reason]',         'Disconnects a player. They can join again.'],
      mute:            ['mod',    'Moderation', '/mute <player> [time] [reason]',  'Stops a player from chatting, e.g. /mute bob 30m spam. Default 10m, perm for forever.'],
      unmute:          ['mod',    'Moderation', '/unmute <player or name>',        'Lets a muted player chat again.'],
      mutes:           ['mod',    'Moderation', '/mutes',                          'Lists muted players.'],
      whois:           ['mod',    'Moderation', '/whois <player>',                 'Account, time in game and shared-network connections.'],
      perf:            ['mod',    'Moderation', '/perf',                           'Tick times, bullets, CPU and memory.'],
      spectate:        ['mod',    'Moderation', '/spectate <player>',              'Leaves play and watches a player. Respawn to play again.'],
      remove:          ['mod',    'Moderation', '/remove <target>',                'Removes tanks or objects without a kill. Players go back to the menu.'],
      kill:            ['mod',    'Moderation', '/kill <target>',                  'Kills tanks or objects.'],
      name:            ['mod',    'Moderation', '/name [target] <name>',           'Changes a tank\'s name (yours when no target is given).', 1],
      tp:              ['mod',    'Moderation', '/tp <target> [x y | target]',     'Teleports to your mouse, a position, or another tank.', 1],
      announce:        ['mod',    'Moderation', '/announce <text>',                'Shows a message to everyone in this dimension.'],
      localannounce:   ['mod',    'Moderation', '/localannounce <target> <text>',  'Shows a message to the chosen players only.'],
      ban:             ['admin',  'Moderation', '/ban <player> [time] [reason]',   'Bans a player\'s IP, e.g. /ban bob 7d griefing. No time means permanent.'],
      unban:           ['admin',  'Moderation', '/unban <ip or name>',             'Removes a ban.'],
      bans:            ['admin',  'Moderation', '/bans',                           'Lists bans, newest first.'],
      globalannounce:  ['admin',  'Moderation', '/globalannounce <text>',          'Shows a message in every dimension.'],

      weapon:          ['admin',  'Tank',       '/weapon [target] <weapon>',       'Changes weapon, e.g. /weapon twin.', 1],
      body:            ['admin',  'Tank',       '/body [target] <body>',           'Changes body, e.g. /body smasher.', 1],
      team:            ['admin',  'Tank',       '/team [target] <team>',           'Changes team: blue, red, green, purple, ... or random.', 1],
      xp:              ['admin',  'Tank',       '/xp [target] <score>',            'Sets score.', 1],
      level:           ['admin',  'Tank',       '/level [target] <level>',         'Sets level (1 to 300).', 1],
      addxp:           ['admin',  'Tank',       '/addxp [target] <score>',         'Adds score.', 1],
      maxxp:           ['admin',  'Tank',       '/maxxp [target] <score>',         'Lowers score to at most this.', 1],
      minxp:           ['admin',  'Tank',       '/minxp [target] <score>',         'Raises score to at least this.', 1],
      maxstats:        ['admin',  'Tank',       '/maxstats [target]',              'Puts every stat upgrade to the max.', 1],
      resetstats:      ['admin',  'Tank',       '/resetstats [target]',            'Takes back every stat upgrade.', 1],
      reset:           ['admin',  'Tank',       '/reset [target]',                 'Back to a level 1 Node-Base with full health.', 1],
      ascend:          ['admin',  'Tank',       '/ascend [target]',                'Turns into a celestial.', 1],
      radiant:         ['admin',  'Tank',       '/radiant [target] <amount>',      'Sets radiant level (looks only).', 1],
      reload:          ['admin',  'Tank',       '/reload <target> <multiplier>',   'Reload multiplier. Higher fires slower.', 1],
      damage:          ['admin',  'Tank',       '/damage <target> <multiplier>',   'Bullet damage multiplier.', 1],
      bulletspeed:     ['admin',  'Tank',       '/bulletspeed <target> <mult.>',   'Bullet speed multiplier.', 1],
      god:             ['admin',  'Tank',       '/god [target] [on|off]',          'Toggles invincibility.', 1],
      vanish:          ['admin',  'Tank',       '/vanish [target] [on|off]',       'Toggles invisibility.', 1],
      fullfov:         ['admin',  'Tank',       '/fullfov [on|off]',               'See the whole map.', 1],
      fling:           ['admin',  'Tank',       '/fling <target> <x> <y>',         'Pushes tanks by this velocity.', 1],
      setvelocity:     ['admin',  'Tank',       '/setvelocity <target> <x> <y>',   'Sets tanks\' velocity.', 1],
      drag:            ['admin',  'Tank',       '/drag [target]',                  'Targets follow your mouse. /drag alone stops.'],
      send:            ['admin',  'Tank',       '/send [target] <dimension>',      'Sends tanks to another dimension, e.g. /send me void.'],

      bot:             ['admin',  'World',      '/bot <x y | target> <name>',      'Spawns an AI tank.'],
      boss:            ['admin',  'World',      '/boss [boss] [count] [x y | target]', 'Spawns bosses at your mouse, e.g. /boss frost titan, /boss colossus 3 or /boss rank2.'],
      bosses:          ['admin',  'World',      '/bosses [family | here]',         'Lists the bosses, one family, or the ones alive here.'],
      becomeboss:      ['admin',  'Tank',       '/becomeboss [target] <boss>',     'Turns into a boss, e.g. /becomeboss frosttitan or /becomeboss magma.', 1],
      tankcode:        ['admin',  'Tank',       '/tankcode [target] [code]',       'Turns into a tank from a tank code file. No code lists them.', 1],
      polygon:         ['admin',  'World',      '/polygon <sides> [count] [x y]',  'Spawns polygons.'],
      polyhedra:       ['admin',  'World',      '/polyhedra <1-5> [count] [x y]',  'Spawns polyhedra.'],
      darkness:        ['admin',  'World',      '/darkness <amount>',              'Sets this dimension\'s darkness.'],
      maxpolygonsides: ['admin',  'World',      '/maxpolygonsides [sides]',        'Largest polygon that spawns naturally. No value = default.'],
      maxpolygoncount: ['admin',  'World',      '/maxpolygoncount [count]',        'How many polygons spawn. No value = default.'],
      mapsize:         ['admin',  'World',      '/mapsize [size] [speed]',         'Resizes the map (where allowed). No value = default.'],
      wormhole:        ['admin',  'World',      '/wormhole <x y | target> <dim>',  'Opens a wormhole to a dimension.'],
      removewormhole:  ['admin',  'World',      '/removewormhole <wormholes | w#>', 'Removes all added wormholes, or one.'],

      createwall:      ['admin',  'Walls',      '/createwall',                     'Makes a wall at your mouse and starts dragging it.'],
      dragwall:        ['admin',  'Walls',      '/dragwall [w# | snap]',           'Drag a wall with your mouse. /dragwall alone stops.'],
      wallsize:        ['admin',  'Walls',      '/wallsize <width> <height>',      'Resizes the wall you are dragging.'],
      wallteam:        ['admin',  'Walls',      '/wallteam <team>',                'Sets the team of the wall you are dragging.'],
      tpwall:          ['admin',  'Walls',      '/tpwall <w#> <x y | target>',     'Moves a wall.'],
      walladd:         ['admin',  'Walls',      '/walladd [target]',               'Clicking places walls.'],
      wallremove:      ['admin',  'Walls',      '/wallremove [target]',            'Clicking removes walls.'],
      wallclear:       ['admin',  'Walls',      '/wallclear [target]',             'Clicking does nothing to walls again.'],
      removewall:      ['admin',  'Walls',      '/removewall <walls | w#>',        'Removes all added walls, or one.'],
      savewalls:       ['admin',  'Walls',      '/savewalls <name>',               'Saves the added walls under a name.'],
      loadwalls:       ['admin',  'Walls',      '/loadwalls <name>',               'Loads saved walls.'],
      downloadwalls:   ['admin',  'Walls',      '/downloadwalls',                  'Copies the added walls to your clipboard.'],
      uploadwalls:     ['admin',  'Walls',      '/uploadwalls <json>',             'Loads walls from copied text.'],

      role:            ['owner',  'Server',     '/role <account> [role]',          'Shows or sets an account\'s role: player, mod, admin, owner. Applies when they rejoin.'],
      access:          ['owner',  'Server',     '/access <player> <command>',      'Lets a player use one command until they leave.'],
      removeaccess:    ['owner',  'Server',     '/removeaccess <player> <command>', 'Takes back a command given with /access.'],
      restart:         ['owner',  'Server',     '/restart',                        'Restarts this game worker. Players are moved to another dimension.']
    },
    aliases: {
      '?': 'help', commands: 'help', list: 'help', cmds: 'help',
      ann: 'announce', gann: 'globalannounce', invincible: 'god', invisible: 'vanish',
      score: 'xp', teleport: 'tp', tank: 'weapon', dim: 'send', dimension: 'send', travel: 'send',
      lag: 'perf'
    },
    hosted: function() {
      return !!args.parentPort && !args.standalone
    },
    online: function(ws) {
      if(commands.hosted()) { return true }
      ws.sendPacket('announcement', 'That only works on the online server.')
      return false
    },
    toServer: function(ws, type, data) {
      if(!commands.online(ws)) { return false }
      args.parentPort.postMessage([type, data])
      return true
    },
    players: function(targets, tank) {
      return targets.filter(function(t) { return t !== tank && dimension.isOnline(t) })
    },
    splitReason: function(text, ws) {
      let words = String(text || '').trim().split(/\s+/).filter(w => w.length > 0)
      for(let n=2;n>=1;n--) {
        let ms = words.length >= n ? durations.parse(words.slice(0, n).join(' ')) : null
        if(ms !== null) { return [ms, words.slice(n).join(' ')] }
      }
      if(/^\d/.test(words[0])) {
        ws.sendPacket('announcement', `Unknown time '${words[0]}'.`)
        return false
      }
      return [null, words.join(' ')]
    },
    kick: function(targets, tank, ws, reason) {
      let list = commands.players(targets, tank)
      if(!list.length) { return ws.sendPacket('announcement', 'No players to kick there.') }
      if(!commands.online(ws)) { return }
      for(let t of list) {
        commands.toServer(ws, 'kick', [t.ws.data.uid, ws.data.uid, reason])
      }
      ws.sendPacket('announcement', `Kicked ${list.length} player${list.length > 1 ? 's' : ''}.`)
    },
    ban: function(targets, tank, ws, text) {
      let list = commands.players(targets, tank), split = commands.splitReason(text, ws)
      if(!split) { return }
      if(!list.length) { return ws.sendPacket('announcement', 'No players to ban there.') }
      if(!commands.online(ws)) { return }
      for(let t of list) {
        commands.toServer(ws, 'ban', [t.ws.data.uid, ws.data.uid, t.name, split[0], split[1]])
      }
    },
    mute: function(targets, tank, ws, text) {
      let list = commands.players(targets, tank), split = commands.splitReason(text, ws)
      if(!split) { return }
      if(!list.length) { return ws.sendPacket('announcement', 'No players to mute there.') }
      if(!commands.online(ws)) { return }
      for(let t of list) {
        commands.toServer(ws, 'mute', [t.ws.data.uid, ws.data.uid, split[0], split[1], t.name])
      }
    },
    whois: function(targets, tank, ws) {
      if(targets.length !== 1) { return ws.sendPacket('announcement', 'Pick one player, for example /whois bob.') }
      let t = targets[0]
      if(t.objectType !== 'tank') { return ws.sendPacket('announcement', 'That is not a player.') }
      if(!dimension.isOnline(t)) {
        return ws.sendPacket('announcement', `${t.name || 'That tank'} is a bot (t${t.id}).`)
      }
      commands.toServer(ws, 'whois', [t.ws.data.uid, ws.data.uid, {
        name: t.name || '',
        id: t.id,
        dim: t.dim.displayName || commands.dimLabel(t.dim.name),
        tank: `${t.weapon || '?'}-${t.body || '?'}`,
        level: t.level,
        role: t.ws.data.role || 'player'
      }, commands.level(ws.data.role) >= commands.level('admin')])
    },
    spectate: function(targets, tank, ws) {
      let list = targets.filter(t => t !== tank && t.objectType === 'tank')
      if(list.length !== 1) { return ws.sendPacket('announcement', 'Pick one tank to watch, for example /spectate bob.') }
      let target = list[0], name = target.name || `t${target.id}`
      let follow = dimension.isOnline(target) ? target.ws.data.uid : -1
      if(!ws.data.tank) {
        let s = ws.data.spectator
        s.target = target
        s.follow = follow
        return ws.sendPacket('announcement', `Watching ${name}.`)
      }
      let score = Math.round(tank.score)
      let stats = [score, tank.level, Math.round((Date.now() - (tank.spawnedAt || Date.now())) / 1000), tank.kills || 0]
      let info = [[], score, stats, `Watching ${name}. Respawn to stop.`]
      spectate.add(ws, tank.dim, tank, target)
      ws.data.spectator.staff = true
      ws.data.spectator.follow = follow
      tank.remove()
      ws.data.respawnScore = score
      if(commands.hosted()) {
        ws.data.ready = false
        args.parentPort.postMessage(['death', [ws.data.uid, score, info, ws.data.lastTeam]])
      } else {
        ws.sendPacket('death', info)
      }
    },
    report: function(name, reason, tank, ws) {
      let found = commands.players(commands.getTargets(name, tank) || [], tank)
      if(found.length !== 1) {
        return ws.sendPacket('announcement', found.length ? 'That matches more than one player. Type more of their name.' : `No player here matches '${name}'.`)
      }
      let t = found[0]
      commands.toServer(ws, 'report', [t.ws.data.uid, ws.data.uid, reason.slice(0, 300), tank.dim.name, t.name || '', tank.name || ''])
    },
    spectatorCommands: ['spectate', 'perf', 'whois', 'kick', 'ban', 'unban', 'bans', 'mute', 'unmute', 'mutes', 'report'],
    asSpectator: function(ws, message) {
      let s = ws.data.spectator
      let viewer = { objectType: 'spectator', id: -1, name: '', dim: s.dim, x: s.x, y: s.y, ws: ws }
      return commands.execute(message, viewer, ws, false, function(name) {
        return commands.spectatorCommands.indexOf(name) >= 0
      })
    },
    spawnBoss: function(tank, ws, name, position, count) {
      if(generator.bossMatches(name).length === 0) {
        return ws.sendPacket('announcement', `There is no boss called '${name}'. Type /bosses to see them all.`)
      }
      position = position || [tank.x, tank.y]
      count = count || 1
      let spawned = {}, spread = count > 1 ? 400 : 0
      for(let i=0;i<count;i++) {
        let id = generator.findBoss(name)
        generator.boss(tank.dim, id, position[0] + (Math.random() - 0.5) * spread, position[1] + (Math.random() - 0.5) * spread)
        let title = tankData.bodies[id].boss.name
        spawned[title] = (spawned[title] || 0) + 1
      }
      let labels = Object.keys(spawned).map(n => spawned[n] > 1 ? `${n} x${spawned[n]}` : n)
      ws.sendPacket('announcement', `Spawned ${labels.join(', ')}.`)
    },
    bossCommand: function(tank, ws, text) {
      let words = String(text || '').split(/\s+/).filter(Boolean), name = []
      while(words.length > 0 && isNaN(words[0])) { name.push(words.shift()) }
      let count = 1, position = tank.mousePosition
      if(words.length % 2 === 1 || (words.length > 1 && isNaN(words[1]))) { count = Number(words.shift()) }
      if(!Number.isInteger(count) || count < 1 || count > 10) {
        return ws.sendPacket('announcement', 'Count must be 1 to 10.')
      }
      if(words.length === 1) {
        let found = commands.getTargets(words[0], tank) || []
        if(found.length !== 1) { return ws.sendPacket('announcement', `Nobody matches '${words[0]}'.`) }
        position = [found[0].x, found[0].y]
      } else if(words.length === 2 && !isNaN(words[1])) {
        position = [Number(words[0]), Number(words[1])]
      } else if(words.length > 0) {
        return ws.sendPacket('announcement', `Usage: ${commands.info.boss[2]}`)
      }
      commands.spawnBoss(tank, ws, name.join(' '), position, count)
    },
    listBosses: function(tank, ws, text) {
      let key = generator.bossKey(text), lines = []
      let capital = function(word) { return word[0].toUpperCase() + word.slice(1) }
      let byRank = function(a, b) { return tankData.bodies[a].boss.rank - tankData.bodies[b].boss.rank || a.localeCompare(b, undefined, { numeric: true }) }
      if(key === 'here') {
        let alive = tank.dim.tanks.filter(t => t.boss === true && t.alive)
        if(alive.length === 0) { return ws.sendPacket('announcement', 'No bosses are alive in this dimension.') }
        lines.push(`Bosses alive here: ${alive.length}. /remove bosses clears them.`)
        for(let t of alive.slice(0, 10)) {
          let health = Math.max(0, Math.round(t.health / t.maxHealth * 100))
          lines.push(`${t.name} at ${Math.round(t.x)}, ${Math.round(t.y)} with ${health}% health`)
        }
      } else {
        let families = Object.create(null)
        for(let id of generator.bossIds()) {
          let family = tankData.bodies[id].boss.family
          families[family] = families[family] || []
          families[family].push(id)
        }
        let names = Object.keys(families).sort()
        if(key && !families[key]) {
          return ws.sendPacket('announcement', `There is no boss family called '${text}'. Families: ${names.join(', ')}.`)
        }
        if(key) {
          lines.push(`${capital(key)} bosses:`)
          for(let id of families[key].sort(byRank)) {
            let body = tankData.bodies[id]
            lines.push(`${body.boss.name} (${id.slice(5)}), rank ${body.boss.rank}, ${body.maxHealth}x health`)
          }
        } else {
          for(let family of names) {
            lines.push(`${capital(family)}: ${families[family].sort(byRank).map(id => capital(generator.bossTitle(id))).join(', ')}`)
          }
        }
      }
      for(let i=lines.length-1;i>=0;i--) {
        ws.sendPacket('announcement', lines[i])
      }
    },
    becomeBoss: function(targets, ws, name) {
      let id = generator.findBoss(name)
      if(!id || !(id in targets[0].dim.weapons) || !(id in targets[0].dim.bodies)) { return ws.sendPacket('announcement', `There is no boss called '${name}' here.`) }
      for(let i=targets.length-1;i>=0;i--) {
        let t = targets[i]
        if(t.static || !t.alive || t.dim !== targets[0].dim) { continue }
        generator.setTankWeapon(t, id)
        generator.setTankBody(t, id)
        t.dim.updatedTanks[t.id] = t
      }
      ws.sendPacket('announcement', `Now ${tankData.bodies[id].boss.name} (${id.slice(5)}).`)
    },
    codeIds: function(dim) {
      return Object.keys(dim.bodies).filter(k => k.startsWith('code:') && k in dim.weapons).sort()
    },
    findCode: function(dim, name) {
      let ids = commands.codeIds(dim), n = String(name || '').toLowerCase().replace(/^code:/, '')
      if(ids.indexOf('code:' + n) >= 0) { return 'code:' + n }
      let found = ids.filter(k => k.slice(5).startsWith(n) || String(dim.bodies[k].name).toLowerCase().replace(/ /g, '').startsWith(n.replace(/ /g, '')))
      return found.length === 1 ? found[0] : false
    },
    listCodes: function(tank, ws) {
      let ids = commands.codeIds(tank.dim)
      if(!ids.length) { return ws.sendPacket('announcement', 'There are no tank codes. Put one in tankData/codes and restart.') }
      ws.sendPacket('announcement', 'Tank codes: ' + ids.map(k => k.slice(5)).join(', '))
    },
    becomeCode: function(targets, ws, name) {
      let dim = targets[0].dim
      let id = commands.findCode(dim, name)
      if(!id) { return ws.sendPacket('announcement', `There is no single tank code matching '${name}'. Type /tankcode to list them.`) }
      let changed = 0
      for(let i=targets.length-1;i>=0;i--) {
        let t = targets[i]
        if(!t || t.objectType !== 'tank' || t.static || !t.alive || t.dim !== dim) { continue }
        t.removeBullets()
        generator.setTankWeapon(t, id)
        generator.setTankBody(t, id)
        t.firedBarrels = {}
        t.update()
        generator.updateTank(t)
        dim.updatedTanks[t.id] = t
        changed ++
      }
      ws.sendPacket('announcement', changed ? `Now ${dim.bodies[id].name} (${id.slice(5)}).` : 'No tank was changed.')
    },
    setLevel: function(tank, level) {
      level = Math.max(1, Math.min(300, Math.floor(level)))
      tank.rScore = tank.score = level > 1 ? Math.ceil(500 * (Math.pow(1.2, level - 1) - 1)) : 0
      tank.dim.updatedTanks[tank.id] = tank
      if(tank.update) { tank.update() }
    },
    dimLabel: function(name) {
      return String(name).replace(/^voidd/, 'void')
    },
    internalDims: function() {
      let all = (dimension.allDims || []).slice()
      for(let n in dimension.dims) { if(all.indexOf(n) < 0) { all.push(n) } }
      return all
    },
    dimNames: function() {
      return commands.internalDims().map(commands.dimLabel)
    },
    findDim: function(name) {
      let all = commands.internalDims(), n = String(name || '').toLowerCase()
      let exact = all.find(d => commands.dimLabel(d).toLowerCase() === n || d.toLowerCase() === n)
      if(exact) { return exact }
      let starts = all.filter(d => commands.dimLabel(d).toLowerCase().startsWith(n)).sort((a, b) => a.length - b.length)
      return starts[0] || false
    },
    isSandbox: function(dim) {
      return !!(dim && (dim.sandbox || (dim.name && dim.name.includes('sandbox'))))
    },
    can: function(ws, name, dim) {
      let info = commands.info[name]
      if(!info || !ws || !ws.data) { return false }
      if(commands.level(ws.data.role) >= commands.level(info[0])) { return 'full' }
      if(ws.data.commands && ws.data.commands[name]) { return 'full' }
      if(info[4] && commands.isSandbox(dim)) { return 'self' }
      return false
    },
    sendList: function(ws, dim) {
      if(!ws || !ws.sendPacket || !ws.data) { return }
      let list = []
      for(let n in commands.info) {
        let can = commands.can(ws, n, dim)
        if(can) { list.push([n, commands.info[n][2], commands.info[n][3], can === 'self' ? 1 : 0]) }
      }
      ws.sendPacket('flag', ['commands', list, commands.dimNames()])
    },
    help: function(ws, dim, name) {
      if(name) {
        name = commands.aliases[name] || name
        let info = commands.info[name]
        if(!info) {
          return ws.sendPacket('announcement', `There is no /${name}. Type /help for your commands.`)
        }
        let can = commands.can(ws, name, dim)
        ws.sendPacket('announcement', `${info[2]} - ${info[3]}` + (can === 'self' ? ' (here: only on yourself)' : can ? '' : ` (${info[0]} only)`))
        return
      }
      let groups = {}, order = []
      for(let n in commands.info) {
        if(n === 'help' || !commands.can(ws, n, dim)) { continue }
        let g = commands.info[n][1]
        if(!groups[g]) { groups[g] = []; order.push(g) }
        groups[g].push(n)
      }
      if(!order.length) {
        ws.sendPacket('announcement', 'There are no commands you can use here.')
        return
      }
      ws.sendPacket('announcement', 'Type /help <command> to see how to use one.')
      for(let i=order.length-1;i>=0;i--) {
        ws.sendPacket('announcement', `${order[i]}: ${groups[order[i]].join(', ')}`)
      }
      let role = ws.data.role || 'player'
      ws.sendPacket('announcement', commands.isSandbox(dim) && commands.level(role) < commands.level('admin') ? `Sandbox commands (use them on 'me'):` : `Your commands (${role}):`)
    },
    execute: function(message, tank, ws, override, verify) {
      let i = message.indexOf(';'), nextExecute = ''
      if(i >= 0) {
        nextExecute = message.slice(i + 1).trimStart()
        message = message.slice(0, i)
      }
      let rr = (function() {
        let params = message.replace(/^\/+/, '').split(' ').filter(p => p.length > 0)
        let command = (params[0] || '').toLowerCase()
        params = params.slice(1)
        command = commands.aliases[command] || command
        if(command === 'help') {
          commands.help(ws, tank.dim, params[0] && params[0].toLowerCase())
          return false
        }
        let rules = commands.rules[command]
        if(!rules || !commands.info[command]) {
          ws.sendPacket('announcement', `Unknown command /${command}. Type /help for your commands.`)
          return false
        }
        let can = override ? 'full' : commands.can(ws, command, tank.dim)
        if(verify && !verify(command)) { can = false }
        if(!can) {
          ws.sendPacket('announcement', `You can't use /${command}.`)
          return false
        }
        let ctx = { selfOnly: can === 'self', level: override ? commands.roles.length : commands.level(ws.data.role) }
        let errors = []
        for(let i=0,l=rules.length;i<l;i++) {
          let rule = rules[i]
          let data = commands.parse(rule[0], params.slice(0), tank, ctx)
          if(data.ok !== false) {
            rule[1](data, tank, ws, verify)
            return commands.info[command][0] === 'player' ? 'player' : true
          }
          if(errors.indexOf(data.error) < 0) { errors.push(data.error) }
        }
        ws.sendPacket('announcement', `Usage: ${commands.info[command][2]}`)
        ws.sendPacket('announcement', errors[errors.length - 1] + '.')
        return false
      })();
      if(nextExecute) {
        let k = commands.execute(nextExecute, tank, ws, override, verify)
        rr = rr === true || k === true ? true : rr || k
      }
      return rr
    }
  }
