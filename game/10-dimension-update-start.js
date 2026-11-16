    update: function(dim, options, now) {
	    let startTime = _performance.now()
      dim.lastTickDelta = startTime - dim.lastTick
      dim.lastTick = startTime

	    let stats = {
		    detect: {
			    auras: 0,
			    aurasTotal: 0,
			    turrets: 0,
			    turretsTotal: 0,
		    }
	    }
      if(dim.onUpdate) {
        dim.onUpdate({
          now: now
        })
        if(dim.isMain && Math.random() < 0.003 * dimension.per50) {
          const teams = dim.type === 'ffa' ? [0] : dim.type === '2teams' ? [dim.teamCodeA, dim.teamCodeB] : [1, 2, 3, 4]
          const count = {}
          for(const t of teams) { count[t] = 0 }
          for(let i=dim.tanks.length-1;i>=0;i--) {
            const t = dim.tanks[i]
            if(t.isAiBot && !t.ws.data.isPlayer) { count[dim.type === 'ffa' ? 0 : t.team] ++ }
          }
          let team = -1
          for(const t of teams) {
            if(count[t] < 2 && (team < 0 || count[t] < count[team])) { team = t }
          }
          if(team >= 0) {
            let t = addBot([dim.name, [{
              name: `[ai] `  + aiNames[Math.floor(Math.random() * aiNames.length)],
              weapon: 'node',
              body: 'base',
              score: 0,
              radiant: 0,
              team: team,
              ai: 'fallen'
            }, '']])
            t.isAiBot = true
            t.ws.accountNameParsed = 'ai'
          }
        }
      }
      if(dim.mapSizeSpeed > 0) {
        let d = dim.mapSize - dim._mapSize
        if(Math.abs(d) <= dim.mapSizeSpeed) {
          dim.mapSize = dim._mapSize
          dim.mapSizeSpeed = 0
        } else {
          dim.mapSize += (dim.mapSize > dim._mapSize) ? -dim.mapSizeSpeed : dim.mapSizeSpeed
        }
      } else {
        dim._mapSize = dim.mapSize
      }
      if(dim.tanks.length > 1000) {
        for(let i=dim.tanks.length-1;i>=0;i--) {
          let t = dim.tanks[i]
          if(!t.static && !t.ws.data.isPlayer) {
            t.remove()
          }
        }
        if(dim.tanks.length > 1000) {
          for(let i=dim.tanks.length-1;i>=0;i--) {
            let t = dim.tanks[i]
            if(!t.static) {
              t.remove()
            }
          }
        }
      }
      let cro = (dim === dimension.dims.crossroads)
      let aby = (dim === dimension.dims.abyss)
      let voi = (dim === dimension.dims.voidd)
      if(now - dim.lastPolyhedra > 120000) {
        dim.lastPolyhedra = now
        if(Math.random() < 0.01 && !voi && !aby && !cro) {
          dim.nextSpawnPolyhedra = true
          console.log(`Polyhedra spawned in ${dim}!`)
        }
        if (Math.random() < 0.02 && cro) {
          dim.nextSpawnPolyhedra = true
        }
        if (Math.random() < 0.1 && voi) {
          dim.nextSpawnPolyhedra = true
        }
        if(voi) {
          dim.nextSpawnPolyhedra = true
        }
      }
      if(options.gameUpdate) {
        if(dim.lastMapSize !== dim.mapSize) {
          dim.mapSizeUpdated = dim.lastMapSize = dim.mapSize
        }
        for(let i=dim.newTanks.length-1;i>=0;i--) {
          let tank = dim.newTanks[i], ws = tank[1]
          let team = 0, x = 0, y = 0
          if(tank[0].team >= 5 && !(dimension.noPinkTeam && tank[0].team === 6)) {
            team = tank[0].team
          } else {
            if(dim.type === '2teams') {
              let teamCodeA = dim.teamCodeA, teamCodeB = dim.teamCodeB
              if(ws.data.lastTeam === teamCodeA || ws.data.lastTeam === teamCodeB) {
                team = ws.data.lastTeam
              } else {
                team = Math.random() < 0.5 ? teamCodeA : teamCodeB
              }
            } else if(dim.type === 'ffa') {
              team = 0
            } else {
              if(ws.data.lastTeam > 0 && ws.data.lastTeam < 5) {
                team = ws.data.lastTeam
              } else {
                team = 1 + Math.floor(4 * Math.random())
              }
            }
          }
          ws.data.lastTeam = team;
          tank[0].team = team
          tank[1].data.tank = generator.tank(tank[0], tank[1]);
          [x, y] = dim.spawnPlayer(team, tank[1].data.tank, tank[2])
          tank[1].data.tank.x = x
          tank[1].data.tank.y = y
          console.log('dim', `name:${tank[0].name} score:${Math.round(tank[0].score)} dim:${dim.name}`)
          tank[1].data.waiting = false
          if(ws && ws.accountData) {
            let data = ws.accountData
		        let prev = data.dims[dim.name]
            data.dims[dim.name] = prev > 0 ? prev + 1 : 1
            let t = tank[1].data.tank
            if(data.dims['ffa'] && data.dims['2teams'] && data.dims['4teams']) {
              if(!data.achievements[8]) {
                let y = data.achievements[8] = createAchievement(8)
                sendAchievement(t, y)
              }
            }
            if(t.celestial && dim.type === 'sanctuary') {
              if(!data.achievements[3]) {
                let y = data.achievements[3] = createAchievement(3)
                sendAchievement(t, y)
              }
              if(t.level >= 90) {
                if(!data.achievements[5]) {
                  let y = data.achievements[5] = createAchievement(5)
                  sendAchievement(t, y)
                }
              }
            }
		        if(!(prev > 0)) {
              if(dim.name === 'crossroads') {
                args.parentPort.postMessage(['dimension', [ws.accountName, 'crossroads']])
                if(!data.achievements[4]) {
                  let y = data.achievements[4] = createAchievement(4)
                  sendAchievement(t, y)
                }
              } if(dim.name === 'abyss') {
                args.parentPort.postMessage(['dimension', [ws.accountName, 'abyss']])
                if(!data.achievements[17]) {
                  let y = data.achievements[17] = createAchievement(17)
                  sendAchievement(t, y)
                }
              }
		        }
          }
          if(tank[1].sendPacket) {
            tank[1].sendPacket('gameStart', packer.gameStart({
              tank: tank[1].data.tank,
              dim: tank[0].dim,
              upgrades: tank[1].data.tank.upgrades
            }))
          }
        }
        dim.newTanks = []
      }
      let objects = [], viewObjects = []
      for(let i=dim.gates.length-1;i>=0;i--) {
        let gate = dim.gates[i]
        if(gate[0] === 1 || gate[0] === 3) {
          if(gate[6] > 0) {
            gate[6] -= dimension.tickMultiplier * 0.01
            if(gate[6] <= 0) {
              gate[6] = 0
            }
          }
          gate[5] = (gate[6] !== 0)
        } else {
          gate[5] = false
          gate[6] = 0
        }
      }
