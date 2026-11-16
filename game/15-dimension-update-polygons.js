      if(dim.polygons.length < dim.maxPolygonCount && !dim.noPolygons && dim.maxPolygonSides >= 3) { spawnPolygon(dim) }
      else if(dim.polygons.length > dim.maxPolygonCount * 2) {
        if(dim.polygons[0]) { dim.polygons[0].remove() }
      }
      for(let i=dim.polygons.length-1;i>=0;i--) {
        let polygon = dim.polygons[i]

        dimension.confine(polygon, dim.mapSize - (polygon.size < 2 * dimension.clipSize ? polygon.size / 2 : polygon.size - dimension.clipSize), (dim.mapSizeSpeed > 0) ? (dim.mapSize > dim._mapSize ? dim.mapSizeSpeed : -dim.mapSizeSpeed) : 0)
        if(polygon.health <= 0) {
          if(polygon.onDeath) {
            polygon.onDeath()
          }
          let totalDamage = 0
          let s = polygon.score, s1 = polygon.rScore
          if(polygon.forceDeathScore >= 0) {
            s = s1 = polygon.forceDeathScore
          }
          let rTotalScore = s1 * dimension.getRadiantMultiplier(polygon.radiant)
          let totalScore = s * dimension.getRadiantMultiplier(polygon.radiant)
          let showNotification = (totalScore >= 1e8 || polygon.radiant > 3)
          let tanks = {}
          let tankNames = []
          let tankOrder = {}
          let dimTanks = {}
          let name = dimension.getFullPolygonName(polygon)
          for(let i=polygon.dim.tanks.length-1;i>=0;i--) {
            let obj = polygon.dim.tanks[i]
            dimTanks[obj.id] = obj
          }
          let count = 0

          for(let id in polygon.finalDamage.tanks) {
            let _tank = dimTanks[id]
            if(_tank && !_tank.static) {
              let finalDamage = polygon.finalDamage.tanks[id]
              let damage = 0
              for(let i=0;i<16;i++) { damage += finalDamage[i] }
              tanks[id] = damage
              tankNames.push(_tank.name)
              tankOrder[id] = count
              count ++
              totalDamage += damage
            }
          }
          let highest = [false, 0], tankCount = 0
          for(let id in tanks) {
            let part = tanks[id] / totalDamage
            let obj = dimTanks[id]
            let p = part * totalScore
            if(!p) { continue }
            if(part > highest[1]) {
              highest[1] = part
              highest[0] = obj
            }
            tankCount ++
            if(obj.ws && obj.ws.accountData) {
              let data = obj.ws.accountData
              if(part < 0.1 && !data.achievements[2]) {
                let t = data.achievements[2] = createAchievement(2)
                sendAchievement(obj, t)
              }
              let s = ~~polygon.sides, r = ~~polygon.radiant
              if(r < 0) { r = 0 }
              if(s >= 3) {
                let c = Math.pow(3, s - 3) / 1500 * Math.pow(Math.pow(s, 1 / 3) - 0.7, r)
                c *= part
                if(c > 0) { obj.ws.accountData.stars += c }
              } else if(s <= -1 && s >= -5) {
                let c = 50 * Math.pow(1.2, -s) * Math.pow(1 - s, r)
                c *= part
                if(c > 0) { obj.ws.accountData.stars += c }
              }
            }
            obj.score += p
            obj.rScore += part * rTotalScore
            if(p > 1e6 && obj.ws && obj.ws.accountData) {
              obj.ws.accountData.ohNode = false
              obj.ws.accountData.classic = false
            }
            obj.update()
            if(obj.ws.sendPacket && showNotification) {
              let slice = tankOrder[id]
              let names = tankNames.slice(0, slice).concat(tankNames.slice(slice + 1))
              let length = names.length
              if(length === 0) {
                obj.ws.sendPacket('announcement', `You killed ${name}.`)
              } else if(length === 1) {
                obj.ws.sendPacket('announcement', `You and ${names[0]} killed ${name}.`)
              } else {
                obj.ws.sendPacket('announcement', `You, ${names.slice(0, length - 1).join(', ')}, and ${names[length - 1]} killed ${name}.`)
              }
            }
          }
          if(polygon.o && highest[0] && highest[0].ws && highest[0].ws.accountData && !dim.sandbox) {
            let data = highest[0].ws.accountData
            data.polygonKills ++
            let sides = polygon.o[0], radiant = polygon.o[1]
            if(sides === ~~sides && radiant >= 0 && radiant <= 20 && radiant === ~~radiant && ((sides <= -1 && sides >= -5) || (sides >= 3 && sides <= 17))) {
              let index = (sides < 0 ? -sides - 1 : sides + 2)
              let i = data.gallery[index] || 0
              let m = (1 << radiant)
              if(!(i & m)) {
                i = i | m
                data.gallery[index] = i

                console.log(radiant, sides)
                highest[0].ws.sendPacket('announcement', `New Polygon Discovered: ${dimension.getFullPolygonName({ sides:sides, radiant:radiant }, true)}`)
                args.parentPort.postMessage(['updateGallery', [highest[0].ws.accountName, sides, radiant]])
              }
            }
            if(polygon.radiant > 0) {
              data.radiantPolygonKills ++
		          args.parentPort.postMessage(['polygon', [highest[0].ws.accountName, true]])
              if(!data.achievements[6] && highest[0].dim.isMain) {
                let y = data.achievements[6] = createAchievement(6)
                sendAchievement(highest[0], y)
              }
              if(polygon.radiant >= 4) {
                if(!data.achievements[18]) {
                  let y = data.achievements[18] = createAchievement(18)
                  sendAchievement(highest[0], y)
                }
              }
            } else {
              args.parentPort.postMessage(['polygon', [highest[0].ws.accountName]])
            } if(tankCount === 1 && polygon.sides >= 10 && !data.achievements[1]) {
              let t = data.achievements[1] = createAchievement(1)
              sendAchievement(highest[0], t)
            } if(polygon.sides >= 13 && !data.achievements[9]) {
              let t = data.achievements[9] = createAchievement(9)
              sendAchievement(highest[0], t)
            }
          }
          polygon.remove()
        }
        polygon.lx = polygon.x
        polygon.ly = polygon.y
      }
      if(options.gameUpdate) {
        for(let i=dim.gates.length-1;i>=0;i--) {
          let gate = dim.gates[i]

          if(gate[5] !== gate[7]) {
            gate[7] = gate[5]
            dim.updatedGates[i] = [i, gate[5]]
          }
        }
        let objects = dimension.leaderboard(dim)
	      if(players >= 13 && objects[0] && objects[0].objectType === 'tank') {
		      let t = objects[0]
		      let data = t.ws.accountData
		      if(data) {
			      data.monarchTime += dimension.gameUpdateTicks * dimension.tickTime
			      if(data.monarchTime >= 1200 && !data.achievements[12]) {
				      let y = data.achievements[12] = createAchievement(12)
				      sendAchievement(t, y)
			      }
		      }
	      }
        let leaderboard = [], changes = {}

        for(let i=0;i<8;i++) {
          let current = objects[i], obj
          if(current) {
            obj = {
              place: i,
              id: current.id,
              type: (current.objectType === 'tank' ? 1 : 0),
              score: Math.round(current.score),
              sides: current.sides,
              radiant: current.radiant
            }
          } else {
            obj = {
              place: i,
              id: -i - 1,
              type: 0,
              score: 1,
              sides: 0,
              radiant: 0
            }
          }
          let test = dim.leaderboard[i]
          if(test && (test.id !== obj.id || Math.round(test.score) !== obj.score || test.type !== obj.type || test.radiant !== obj.radiant)) {
            changes[i] = obj
          }
          leaderboard.push(obj)
        }
        dim.leaderboard = leaderboard
        let data = []
        for(let place in changes) {
          let obj = changes[place]
          data.push([
            place,
            obj.id,
            (obj.type ? 0 : [obj.sides, obj.radiant]),
            Math.round(obj.score)
          ])
        }
        dim.leaderboardChanges = data
      }
	    let dt = _performance.now() - startTime
	    dim.dt += dt
      dim.updateTime = dt
    },
    leaderboard: function(dim) {
      let polygons = []
      for(let i=0,l=dim.polygons.length;i<l;i++) {
        let p = dim.polygons[i]

        if(p.radiant > 1 || p.score * dimension.getRadiantMultiplier(p.radiant) >= 1e9) {
          polygons.push(p)
        }
      }
      let sorted = dim.tanks.concat(polygons).sort((a, b) => (a.displayScore === b.displayScore ? b.radiant - a.radiant : b.displayScore - a.displayScore))
      let top = [], k = 0
      for(let i=0,l=sorted.length;i<l;i++) {
        if(!sorted[i].static && !sorted[i].invisible && !sorted[i].hideFromLeaderboard) {
          top.push(sorted[i])
          k ++

          if(k >= 10) { break }
        }
      }
      return top
    }
  }

