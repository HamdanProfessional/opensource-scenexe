    rules: {
      name: [
        [['targets', '*'], function(data, tank, ws) {
          let targets = data[0]
          let name = words.stripEmoji(data[1])
          if(words.isBad(name)) { return ws.sendPacket('announcement', 'That name isn\'t allowed.') }
          for(let i=targets.length-1;i>=0;i--) {
            let object = targets[i]
            if(object.objectType === 'tank') {
              object.name = name.slice(0, 50)
              object.dim.updatedTanks[object.id] = object
            }
          }
        }],
        [['*'], function(data, tank, ws) {
          let name = words.stripEmoji(data[0])
          if(words.isBad(name)) {
            discordReport('profanity', 'tried to rename to a blocked name', name, ws)
            return ws.sendPacket('announcement', 'That name isn\'t allowed.')
          }
          tank.name = name.slice(0, 50)
          tank.dim.updatedTanks[tank.id] = tank
        }],
      ],
      reload: [
        [['targets', 'float'], function(data, tank, ws) {
          let targets = data[0]
          let f = data[1]
          if(f <= 0) { return }
          for(let i=targets.length-1;i>=0;i--) {
            let object = targets[i]
            if(object.objectType === 'tank') {
              object.sReload = f
            }
          }
        }],
      ],
      damage: [
        [['targets', 'float'], function(data, tank, ws) {
          let targets = data[0]
          let f = data[1]
          if(f <= 0) { return }
          for(let i=targets.length-1;i>=0;i--) {
            let object = targets[i]
            if(object.objectType === 'tank') {
              object.sBulletDamage = f
            }
          }
        }],
      ],
      bulletspeed: [
        [['targets', 'float'], function(data, tank, ws) {
          let targets = data[0]
          let f = data[1]
          if(f <= 0) { return }
          for(let i=targets.length-1;i>=0;i--) {
            let object = targets[i]
            if(object.objectType === 'tank') {
              object.sBulletSpeed = f
            }
          }
        }],
      ],
      wallclear: [
        [[], function(data, tank, ws) {
          tank.wallEdit = 0
        }],
        [['targets'], function(data, tank, ws) {
          let targets = data[0]
          for(let i=targets.length-1;i>=0;i--) {
            let object = targets[i]
            if(object.objectType === 'tank') {
              object.wallEdit = 0
            }
          }
        }],
      ],
      walladd: [
        [[], function(data, tank, ws) {
          tank.wallEdit = 1
        }],
        [['targets'], function(data, tank, ws) {
          let targets = data[0]
          for(let i=targets.length-1;i>=0;i--) {
            let object = targets[i]
            if(object.objectType === 'tank') {
              object.wallEdit = 1
            }
          }
        }],
      ],
      wallremove: [
        [[], function(data, tank, ws) {
          tank.wallEdit = 2
        }],
        [['targets'], function(data, tank, ws) {
          let targets = data[0]
          for(let i=targets.length-1;i>=0;i--) {
            let object = targets[i]
            if(object.objectType === 'tank') {
              object.wallEdit = 2
            }
          }
        }],
      ],
      access: [
        [['targets', 'string'], function(data, tank, ws) {
          let targets = data[0], name = data[1].toLowerCase()
          name = commands.aliases[name] || name
          if(!commands.info[name] || name === 'help') {
            return ws.sendPacket('announcement', `There is no /${name}.`)
          }
          if(commands.info[name][0] === 'owner') {
            return ws.sendPacket('announcement', `Owner commands can't be given out. Use /role instead.`)
          }
          let n = 0
          for(let i=targets.length-1;i>=0;i--) {
            let t = targets[i]
            if(t.ws && t.ws.data && t.ws.data.isPlayer && t.ws.data.commands && !t.ws.data.commands[name]) {
              t.ws.data.commands[name] = 2
              t.ws.sendPacket('announcement', `You can now use /${name}. Type /help ${name}`)
              commands.sendList(t.ws, t.dim)
              n ++
            }
          }
          ws.sendPacket('announcement', `Gave /${name} to ${n} player${n === 1 ? '' : 's'}.`)
        }]
      ],
      removeaccess: [
        [['targets', 'string'], function(data, tank, ws) {
          let targets = data[0], name = data[1].toLowerCase()
          name = commands.aliases[name] || name
          let n = 0
          for(let i=targets.length-1;i>=0;i--) {
            let t = targets[i]
            if(t.ws && t.ws.data && t.ws.data.commands && t.ws.data.commands[name]) {
              delete t.ws.data.commands[name]
              t.ws.sendPacket('announcement', `You can no longer use /${name}.`)
              commands.sendList(t.ws, t.dim)
              n ++
            }
          }
          ws.sendPacket('announcement', `Took /${name} from ${n} player${n === 1 ? '' : 's'}.`)
        }]
      ],
      radiant: [
        [['float'], function(data, tank, ws) {
          if(data[0] > 100 || data[0] < -100) {
            return
          }
          tank.radiant = data[0]
          tank.dim.updatedTanks[tank.id] = tank
          tank.update()
        }],
        [['targets', 'float'], function(data, tank, ws) {
          let targets = data[0]
          let radiant = data[1]
          if(data[1] > 100 || data[1] < -100) {
            return
          }
          for(let i=targets.length-1;i>=0;i--) {
            let object = targets[i]
            if('radiant' in object) {
              object.radiant = radiant
              if(object.objectType === 'tank') {
                object.dim.updatedTanks[object.id] = object
              }
              if(object.update) { object.update() }
            }
          }
        }],
      ],
      bot: [
        [['position', '*'], function(data, tank) {
          let position = data[0]
          generator.tank({
            dim: tank.dim,
            x: position[0],
            y: position[1],
            name: data[1],
            weapon: 'node',
            body: 'base',
            score: 0,
            radiant: 0,
            team: 8,

          })
        }]
      ],
      drag: [
        [[], function(data, tank, ws) {
          tank.dragTarget = false
        }],
        [['targets'], function(data, tank, ws) {
          let targets = data[0]
          tank.dragTarget = targets
        }]
      ],