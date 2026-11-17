    roles: ['player', 'mod', 'admin', 'owner'],
    level: function(role) {
      let i = commands.roles.indexOf(role)
      return i < 0 ? 0 : i
    },
    info: {
      help:            ['player', 'General',    '/help [command]',                 'Lists the commands you can use, or explains one command.'],

      kick:            ['mod',    'Moderation', '/kick <player>',                  'Disconnects a player. They can join again.'],
      remove:          ['mod',    'Moderation', '/remove <target>',                'Removes tanks or objects without a kill. Players go back to the menu.'],
      kill:            ['mod',    'Moderation', '/kill <target>',                  'Kills tanks or objects.'],
      name:            ['mod',    'Moderation', '/name [target] <name>',           'Changes a tank\'s name (yours when no target is given).', 1],
      tp:              ['mod',    'Moderation', '/tp <target> [x y | target]',     'Teleports to your mouse, a position, or another tank.', 1],
      announce:        ['mod',    'Moderation', '/announce <text>',                'Shows a message to everyone in this dimension.'],
      localannounce:   ['mod',    'Moderation', '/localannounce <target> <text>',  'Shows a message to the chosen players only.'],
      ban:             ['admin',  'Moderation', '/ban <player>',                   'Bans a player\'s IP and disconnects them.'],
      unban:           ['admin',  'Moderation', '/unban <ip or name>',             'Removes a ban.'],
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
      boss:            ['admin',  'World',      '/boss [boss] [x y | target]',     'Spawns a boss at your mouse: a boss like frost2, a family like frost, or random.'],
      becomeboss:      ['admin',  'Tank',       '/becomeboss [target] <boss>',     'Turns into a boss, e.g. /becomeboss frost2 or /becomeboss magma.', 1],
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
      score: 'xp', teleport: 'tp', tank: 'weapon', dim: 'send', dimension: 'send', travel: 'send'
    },
    spawnBoss: function(tank, ws, name, position) {
      let id = generator.findBoss(name)
      if(!id) { return ws.sendPacket('announcement', `There is no boss called '${name}'.`) }
      position = position || [tank.x, tank.y]
      generator.boss(tank.dim, id, position[0], position[1])
      ws.sendPacket('announcement', `Spawned ${tankData.bodies[id].boss.name} (${id.slice(5)}).`)
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
            return true
          }
          if(errors.indexOf(data.error) < 0) { errors.push(data.error) }
        }
        ws.sendPacket('announcement', `Usage: ${commands.info[command][2]}`)
        ws.sendPacket('announcement', errors[errors.length - 1] + '.')
        return false
      })();
      if(nextExecute) {
        let k = commands.execute(nextExecute, tank, ws, override, verify)
        rr = rr || k
      }
      return rr
    }
  }
