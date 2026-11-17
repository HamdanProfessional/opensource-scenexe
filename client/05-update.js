    const update = {
      removed: function(removed) {
        return removed
      },
      spectate: function(spectate) {
        return spectate
      },
      tanks: function(tanks) {
        let arr = {}
        for(let i=0,l=tanks.length;i<l;i++) {
          let tank = tanks[i]
          let entry = {
            id: tank[0],
            x: tank[1],
            y: tank[2],
            d: tank[3],
            health: 1 - tank[5] * 0.01,
            turrets: {},
            typing: tank[6] & 1,
            passive: tank[6] & 2,
            invincible: tank[6] & 4,
            invisible: tank[6] & 8,
            alwaysShowOnMinimap: tank[6] & 16,
            stealth: (tank[6] >> 5) / 20,
            level: tank[7],
            barrelsFired: {},
          }
          if(tank[8]) {
            for(let i=tank[8].length-1;i>=0;i--) {
              entry.barrelsFired[tank[8][i]] = true
            }
          }
          if(Array.isArray(entry.d)) {
            for(let i=entry.d.length-1;i>=0;i--) {
              entry.d[i] = entry.d[i] / 1000 * Math.PI
            }
          } else {
            entry.d = entry.d / 1000 * Math.PI
          }
          for(let u=0,k=tank[4].length;u<k;u++) {
            entry.turrets[u] = tank[4][u] / 50 * Math.PI
          }
          arr[tank[0]] = entry
        }
        return arr
      }, tankData: function(tanks) {
        let updated = {}
        for(let i=tanks.length-1;i>=0;i--) {
          let tank = tanks[i], arr
          if(gameTankData[tank[0]]) {
            arr = gameTankData[tank[0]]
          } else {
            arr = (gameTankData[tank[0]] = {})
          }
          updated[tank[0]] = arr
          arr.name = tank[1]
          arr.team = tank[2]
          arr.radiant = tank[3]
          arr.weapon = tank[4]
          arr.body = tank[5]
          arr.accountName = tank[6] || false
          arr.maxHealth = tank[7] || 0
          arr.staff = tank[8] ? true : false
        }
        return updated
      }, chatMessages: function(chatMessages) {
        let messages = {}
        for(let i=chatMessages.length-1;i>=0;i--) {
          let block = chatMessages[i], t = block[1]
          if(isBad(t)) {
            t = '<censored>'
          }
          messages[block[0]] = t
        }
        return messages
      }, bullets: function(bullets) {
        let objects = {}
        for(let i=bullets.length-1;i>=0;i--) {
          let arr = bullets[i]
          let parentId = arr[0]
          for(let u=arr.length-1;u>0;u--) {
            let obj = arr[u]
            let barrelId = obj[0]
            for(let y=obj.length-1;y>0;y--) {
              let data = obj[y]
              let o = {
                x: data[1],
                y: data[2],
                d: data[3] * Math.PI / 100,
                parentId: parentId,
                barrelId: barrelId,
                health: 1 - data[4] * 0.01,
                vx: (data[5] || 0) / 1000,
                vy: (data[6] || 0) / 1000,
                vd: 0
              }
              if(data[7]) {
                let t = {}
                for(let i=0,l=data[7].length;i<l;i++) {
                  t[i] = data[7][i] * Math.PI / 100
                }
                o.turretData = t
              }
              objects[data[0]] = o
            }
          }
        }
        return objects
      }, polygons: function(polygons) {
        let objects = {}
        for(let i=polygons.length-1;i>=0;i--) {
          let arr = polygons[i]
          let radiant = arr[0]
          for(let u=arr.length-1;u>0;u--) {
            let arr2 = arr[u]
            let sides = arr2[0]
            for(let y=arr2.length-1;y>0;y--) {
              let data = arr2[y]
              objects[data[0]] = {
                x: data[1],
                y: data[2],
                d: data[3] / 500 * Math.PI,
                health: 1 - data[4] * 0.002,
                vx: (data[5] || 0) / 1000,
                vy: (data[6] || 0) / 1000,
                vd: (data[7] || 0) * Math.PI / 500000,
                sides: sides,
                radiant: radiant
              }
            }
          }
        }
        return objects
      }, leaderboard: function(data) {
        let entries = pageLeaderboard.order
        for(let i=data.length-1;i>=0;i--) {
          let arr = data[i]
          let type = (arr[2] === 0 ? 'tank' : 'polygon')
          let entry = (entries[arr[0]] = {
            place: arr[0],
            id: arr[1],
            type: type,
            name: false,
            score: arr[3],
            sides: false,
            radiant: false,
          })
          if(type === 'tank') {
            let data = gameTankData[entry.id]
            if(data) {
              entry.name = data.name
              entry.radiant = data.radiant
              entry.accountName = data.accountName
              entry.sides = 0
            }
          } else {
            entry.name = render.getFullPolygonName({
              sides: arr[2][0],
              radiant: arr[2][1]
            })
            entry.sides = arr[2][0]
            entry.radiant = arr[2][1]
          }
        }
        pageLeaderboard.update(entries)
      }, gates: function(data) {
        for(let i=data.length-1;i>=0;i--) {
          let gate = gameData.gates[data[i][0]]
          if(gate) {
            gate.open = data[i][1] ? true : false
          }
        }
      }, resizedWormholes: function(data) {
        for(let i=data.length-1;i>=0;i--) {
          let wormhole = gameData.wormholes[data[i][0]]
          if(wormhole) {
            wormhole._size = data[i][1]
            if(data[i].length > 2) {
              wormhole.lifeMs = data[i][2]
              wormhole.lifeAt = performance.now()
            }
          }
        }
      }, rupturedWormholes: function(data) {
        for(let i=data.length-1;i>=0;i--) {
          let wormhole = gameData.wormholes[data[i]]
          if(wormhole) {
            wormhole.ruptured = true
            wormhole.fadeTime = 0
          }
        }
      }, removedWormholes: function(data) {
        for(let i=data.length-1;i>=0;i--) {
          let wormhole = gameData.wormholes[data[i]]
          if(wormhole) {
            delete gameData.wormholes[data[i]]
          }
        }
      }, addedWormholes: function(data) {
        for(let i=data.length-1;i>=0;i--) {
          let arr = data[i]
          let c = { r:0, g:0, b:0 }
          if(arr[3] === 0) {
            c = render.averageColors([
              { r:255, g:255, b:255 },
              render.teamColors[2],
              render.teamColors[4],
              render.teamColors[3],
              { r:265, g:165, b:0 },
              { r:265, g:0, b:165 }
            ][arr[7]], { r:255, b:255, g:255 }, 0.5)
          } else if(arr[3] === 2) {
            c = render.teamColors[arr[7]]
          }
          gameData.wormholes[arr[0]] = {
            id: arr[0],
            type: arr[3],
            x: arr[1],
            y: arr[2],
            size: arr[4],
            _size: arr[4],
            fadeTime: 1 - arr[6] * 0.01,
            ruptured: arr[5],
            radiant: arr[8] ? true : false,
            color: c,
            cRadiant: arr[8] || 0,
            mapColor: render.averageColors(c, { r:0, g:0, b:0 }, 0.5),
            lifeMs: arr[9] >= 0 || arr[9] < 0 ? arr[9] : -1,
            lifeAt: performance.now()
          }
        }
      }, fadeTimeChanges: function(data) {
        for(let i=data.length-1;i>=0;i--) {
          let wormhole = gameData.wormholes[data[i][0]]
          if(wormhole) {
            wormhole.fadeTime = 1 - data[i][1] * 0.01
          }
        }
      }, darkness: function(data) {
        if(data >= 0) {
          gameData.darkness = data * 0.01
        }
      }, updatedPortals: function(data) {
        for(let i=data.length-1;i>=0;i--) {
          let wormhole = gameData.wormholes[data[i][0]]
          if(wormhole && wormhole.type === 2) {
            wormhole.cRadiant = data[i][2]
            wormhole.color = render.teamColors[data[i][1]]
            render.portalParticles(wormhole)
          }
        }
      }, updatedWalls: function(data) {
        for(let i=data.length-1;i>=0;i--) {
          let wall = gameData.walls[data[i][0]]
          if(wall) {
            if(data[i][1] === false) {
              wall.color = false
            } else if(data[i][1] >= 0) {
              wall.color = render.teamColors[data[i][1]]
            }
            wall.nx = data[i][2]
            wall.ny = data[i][3]
            wall.w = data[i][4]
            wall.h = data[i][5]
          } else {
            gameData.walls[data[i][0]] = {
              x: data[i][2],
              ox: data[i][2],
              nx: data[i][2],
              y: data[i][3],
              oy: data[i][3],
              ny: data[i][3],
              w: data[i][4],
              h: data[i][5],
              color: data[i][1] >= 0 ? render.teamColors[data[i][1]] : false
            }
          }
        }
      }, mapSizeUpdated: function(data) {
        gameData._mapSize = data
      }, removedWalls: function(data) {
        for(let i=data.length-1;i>=0;i--) {
          let t = data[i]
          let wall = gameData.walls[t]
          let l = gameData.walls.length - 1
          if(wall) {
            if(t === l) {
              gameData.walls.splice(l, 1)
            } else {
              delete gameData.walls[t]
            }
          }
        }
      }, matrixWallChanges: function(data) {
        let add = data[0]
        for(let i=add.length-1;i>=0;i--) {
          let m = walls[add[i][0]]
          if(!m) { m = walls[add[i][0]] = {} }
          m[add[i][1]] = true
        }
        let remove = data[1]
        for(let i=remove.length-1;i>=0;i--) {
          let m = walls[remove[i][0]]
          if(m) {
            delete m[remove[i][1]]
            if(Object.keys(m).length <= 0) {
              delete walls[remove[i][0]]
            }
          }
        }
      }, serverInfo: function(data) {
        render.serverInfo = data
      }
    }
