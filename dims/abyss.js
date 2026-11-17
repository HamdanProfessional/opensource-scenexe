let noAG = false
!function() {
  const dim = dimension.create({
    mapSize: 7650,
    displayName: 'Abyss',
    displayRadiant: 127,
    name: 'abyss',
    exitMessage: 'Returning From The Abyss...',
    type: 'abyss',
    ambientParticles: [
      {
        amount: 20,
        radiant: 1,
        size: [5, 5],
        color: { r: 255, g: 228, b: 107 },
        d: 0,
        range: 100,
        speed: 150,
        fade: 25,
        t: 80,
        opacity: 100
      }
    ],
    walls: [[-300,7350,7350,300],[7350,-4050,300,3600],[7350,3750,300,3900],[150,-900,300,150],[300,-600,150,150],[150,300,300,150],[300,0,150,150],[-750,-900,300,150],[-900,-600,150,150],[-750,300,300,150],[-900,0,150,150]],
    gates: [
      [2,7200,-300,2,150,false,0],
      [2,300,-300,2,150,false,0],
      [2,-900,-300,0,150,false,0],
      [2,-300,-900,1,150,false,0],
      [2,-300,300,3,150,false,0]
    ],
    background: {
      r: 12,
      g: 12,
      b: 12
    },
    grid: {
      r: 21,
      g: 21,
      b: 21
    },
    gridSize: 100,
    maxPolygonSides: 12,
    maxPolygonCount: 200,
    spawnPlayer: function(team, tank) {
      return [7500, -300]
    },
    spawnPolygon: function(sides) {
      return spawnOutsideRadius(7500, 18000000)
    }
  })
  const sw = function(x, y) {
    let index = 5
    generator.wormhole({
      x: x,
      y: y,
      size: 40,
      type: 0,
      time: 30,
      color: 4,
      dim: dim,
      ruptured: true,
      action: function(tank) {
        if(index === 5) {
          for(let ii=0,l=dim.bullets.length;ii<l;ii++) {
            let tank = dim.bullets[ii]
            let dx = tank.x - x, dy = tank.y - y
            let d = dx * dx + dy * dy, r = 100 + tank.size
            if(d < 1) {
              d = 1
              let r = Math.random() * 2 * Math.PI
              dx = Math.cos(r)
              dy = Math.sin(r)
            }
            let i = 1 / Math.sqrt(d)
            if(d < r * r) {
              let k = r * i
              tank.x = x + dx * k
              tank.y = y + dy * k
            }
            if(d < 250000) {
              let f = 50 * (250000 - d) / 250000
              tank.xv = dx * i * f * dimension.per50
              tank.yv = dy * i * f * dimension.per50
            }
          }
          for(let ii=0,l=dim.tanks.length;ii<l;ii++) {
            let tank = dim.tanks[ii]
            let dx = tank.x - x, dy = tank.y - y
            let d = dx * dx + dy * dy, r = 100 + tank.size
            if(d < 1) {
              d = 1
              let r = Math.random() * 2 * Math.PI
              dx = Math.cos(r)
              dy = Math.sin(r)
            }
            let i = 1 / Math.sqrt(d)
            if(d < r * r) {
              let k = r * i
              tank.x = x + dx * k
              tank.y = y + dy * k
            }
            if(d < 250000) {
              let f = 50 * (250000 - d) / 250000
              tank.xv = dx * i * f * dimension.per50
              tank.yv = dy * i * f * dimension.per50
            }
          }
        }
        if(index <= 0) { return }
        let amount = Math.random() < 0.7 ? 5 : 6
        amount *= index * 0.2
        index --
        for(let i=0;i<amount;i++) {
          let sides = Math.random() < 0.7 ? 6 : 7
          let radiant = Math.random() < 0.7 ? 3 : 4
          let p = generator.polygon({
            x: x,
            y: y,
            d: 2 * Math.PI * Math.random(),
            sides: sides,
            dim: dim,
            radiant: radiant,
            onDeath: function() {
              generator.polygon({
                x: p.x,
                y: p.y,
                d: 2 * Math.PI * Math.random(),
                sides: Math.floor(11 + Math.random() * 1.3),
                dim: dim,
                radiant: Math.floor(1.5 + Math.random() * 2.8)
              })
            }
          })
          let r = Math.random() * 2 * Math.PI
          p.xv = 60 * Math.cos(r) * dimension.per50
          p.yv = 60 * Math.sin(r) * dimension.per50
        }
      }
    })
  }
  const spawnGuardian = function() {
    noAG = false
    dim.gleaming = false
    let d = 0
    let lastDirectionChange = 0
    let lockedTime = 0
    let guardian = generator.tank({
      alwaysShowOnMinimap: true,
      dim: dim,
      x: -2000,
      y: -2000,
      static: true,
      forceDeathScore: 1e11,
      ignorePolygonDamage: true,
      name: 'Abyss Guardian',
      weapon: 'abyssGuardian',
      body: 'abyssGuardian',
      score: 1e24,
      radiant: 1,
      team: 8,
      invincible: false,
      onDeath: function() {
        let r = Math.random()
        r = (1 - r * r) * 1000
        let d = Math.random() * 2 * Math.PI
        sw(guardian.x + r * Math.cos(d), guardian.y + r * Math.sin(d))
        dim.gleaming = true
        noAG = true
        for(let i=dim.polygons.length-1;i>=0;i--) {
          let p = dim.polygons[i]
          p.score *= 0.05
          p.update()
        }
        dim.after(spawnGuardian, 30 * 60 * 1000)
        dim.after(function() {
          dim.gleaming = false
        }, 10 * 60 * 1000)
      },
      ai: function(data) {
        let now = data.now
        let c = 100
        guardian.speed = 1.5 - 0.5 * guardian.health / guardian.maxHealth
        let dx = -Math.sin(guardian.d)
        let dy = Math.cos(guardian.d)
        guardian.mousePosition = [0, 0]
        guardian.controlPosition = [0, 0]
        guardian.input.movement = [dx, dy]
        guardian.firing = true
        dx = -Math.sin(d)
        dy = Math.cos(d)
        if(Math.random() < 0.008 * dimension.per50 && now - lastDirectionChange > 5000) {
          d = Math.random() * 2 * Math.PI
          lastDirectionChange = now
        }
        if(Math.random() < 0.005 * dimension.per50 && !guardian.target) {
          let p = [], tanks = dim.tanks
          for(let i=tanks.length-1;i>=0;i--) {
            let tank = tanks[i], x = tank.x + 300, y = tank.y + 300
            if(!dimension.isSameTeam(tank, guardian) && tank.score > 1e8 && !tank.static && !tank.invincible && x * x + y * y > 300000) {
              let s = tank.score - 1e9
              let h = tank.health / tank.maxHealth
              let dx = tank.x - guardian.x, dy = tank.y - guardian.y
              let chance = s / (2 * s + 1e10) * h
              if(dx * dx + dy * dy < 5000000 && Math.random() < chance) {
                p.push(tank)
              }
            }
          }
          if(p[0]) {
            let n = p[Math.floor(Math.random() * p.length)]
            guardian.target = n
            lockedTime = now
          }
        }
        if(guardian.target) {
          let target = guardian.target
          if(guardian.target.alive) {
            d = Math.atan2(guardian.x - guardian.target.x, guardian.target.y - guardian.y)
            let dt = now - lockedTime
            let dx = guardian.target.x - guardian.x, dy = guardian.target.y - guardian.y
            if(dt > 5000 && (Math.random() < (dt - 5000) / 1000 * 0.05 * dimension.per50) && (guardian.target.health / guardian.target.maxHealth < 0.5 || Math.random() < 0.05)) {
              guardian.target = false
              d = Math.random() * 2 * Math.PI
              lastDirectionChange = now
              console.log('random unlock', dt, (dt - 5000) / 1000 * 0.1)
            } else if(dx * dx + dy * dy > 15000000) {
              guardian.target = false
              d = Math.random() * 2 * Math.PI
              lastDirectionChange = now
              console.log('distance, unlock')
            }
            if(dt > 3000) {
              c = 100 - (dt - 3000) / 10
              if(c < 10) { c = 10 }
            }
          } else {
            console.log('died, unlock')
            guardian.target = false
            d = Math.random() * 2 * Math.PI
            lastDirectionChange = now
          }
        }
        if(guardian.y < -7600) {
          guardian.y = -7600
          dy = Math.abs(dy)
          d = Math.atan2(-dx, dy)
          guardian.yv = 0
          lastDirectionChange = 0
          s = 1
        } else if(guardian.y > 6715) {
          guardian.y = 6715
          dy = -Math.abs(dy)
          d = Math.atan2(-dx, dy)
          guardian.yv = 0
          lastDirectionChange = 0
          s = 1
        } if(guardian.x < -7600) {
          guardian.x = -7600
          dx = Math.abs(dx)
          d = Math.atan2(-dx, dy)
          guardian.xv = 0
          lastDirectionChange = 0
          s = 1
        } else if(guardian.x > 6715) {
          guardian.x = 6715
          dx = -Math.abs(dx)
          d = Math.atan2(-dx, dy)
          guardian.xv = 0
          lastDirectionChange = 0
          s = 1
        }
        let gx = guardian.x + 300
        let gy = guardian.y + 300
        let sd = gx * gx + gy * gy
        if(sd < 4000000) {
          let d = Math.sqrt(sd)
          let r = 1
          if(d < 1) { d = 2000 }
          else {
            r = 1 / d
            d = 2000 * r
          }
          guardian.x = gx * d - 300
          guardian.y = gy * d - 300
          guardian.target = false
          d = Math.random() * 2 * Math.PI
          lastDirectionChange = now
        }
        guardian.d = dimension.averageAngles(guardian.d, d, dimension.smooth(c))
      }
    })
    guardian.upgrades[6] = -190
  }
  spawnGuardian()
  generator.wormhole({
    static: true,
    x: 7500,
    y: -300,
    size: 60,
    type: 2,
    dim: dim,
    action: function(tank) {
      tank.xv = -50 * dimension.per50
      tank.yv = 0
      tank.x -= 1
    },
  })
  dim.every(function() {
    let color = 1 + Math.floor(Math.random() * 3)
    let cdim = ['ffa', '2teams', '4teams'][color - 1]
    if(Math.random() < 0.0001) {
      dim.broadcast(`[404]: CRITICAL ERROR OCCURED DURING WORMHOLE CREATION!`)
        generator.wormhole({
          x: x,
          y: y,
          size: 500,
          type: 0,
          radiant: 1,
          time: 60 + 120 * Math.random(),
          dim: dim,
          action: function(tank) {
            dimension.sendTankTo({
              tank: tank,
              dim: 'voiddMaze'
            })
          }
        })
    } else {
      generator.wormhole({
        x: (2 * Math.random() - 1) * 400 - 300,
        y: (2 * Math.random() - 1) * 400 - 300,
        size: 100,
        type: 0,
        time: 20,
        dim: dim,
        ruptured: true,
        color: color,
        action: function(tank) {
          dimension.sendTankTo({
            tank: tank,
            dim: cdim,
          })
        }
      })
    }
  }, 10000)
  let ayg = function() {
    if(noAG) {
      let num = Math.floor(1 + 3 * Math.random())
      for(let i=0;i<num;i++) {
        dim.after(createAbysslingGuardian, 10000 * Math.random())
      }
    }
    dim.after(ayg, 60000 * (2 + 8 * Math.random()))
  }
  ayg()
  const createAbysslingGuardian = function() {
    let abyssling = generator.tank({
      dim: dim,
      x: 7500,
      y: -300,
      name: 'Abyssling Guardian',
      weapon: 'abyssling',
      body: 'abyssling',
      score: 1e9,
      radiant: Math.random() < 0.2 ? (Math.random() < 0.2 ? 3 : 2) : 1,
      team: 8,
      invincible: false,
      ai: function(options) {
        let target = [-300, -300]
        if(!obj || !obj.alive || obj === abyssling) {
          if(Math.random() < 0.7) {
            let randomPolygon = dim.polygons[Math.floor(Math.random() * dim.polygons.length)]
            if(randomPolygon) {
              obj = randomPolygon
            }
          } else {
            let randomTank = dim.tanks[Math.floor(Math.random() * dim.tanks.length)]
            if(randomTank && (!randomTank.team || randomTank.team !== abyssling.team)) {
              obj = randomTank
            }
          }
        }
        try {
          if(obj) {
            controller.tank = obj
            target[0] = obj.x
            target[1] = obj.y
          } else {
            controller.tank = abyssling
          }
          controller.update(options.now, target[0], target[1], [abyssling.x, abyssling.y])
          let i = controller.getImpulse(abyssling.x, abyssling.y)
          if(controller.directPath(abyssling.x, abyssling.y, target[0], target[1])) {
            controller.lastTarget = target
          } else if(i >= 0) {
            let dx = [50, 0, -50, 0][i], dy = [0, 50, 0, -50][i]
            target[0] = dx ? abyssling.x + dx : abyssling.x
            target[1] = dy ? abyssling.y + dy : abyssling.y
            controller.lastTarget = target
          } else {
            target = controller.lastTarget
          }
        } catch(e) { console.log(e) }
        abyssling.firing = true
        let d = [target[0] - abyssling.x, target[1] - abyssling.y]
        abyssling.d = dimension.averageAngles(abyssling.d, Math.atan2(-d[0], d[1]), dimension.smooth(2))
        abyssling.input.movement[0] = -Math.sin(abyssling.d)
        abyssling.input.movement[1] = Math.cos(abyssling.d)
        if(abyssling.x < 300 && abyssling.x > -900 && abyssling.y < 300 && abyssling.y > -900) {
          abyssling.remove()
        }
      }
    })
    let obj = false
    abyssling.abyssling = true
    let controller = pathfind.controller({
      tank: abyssling,
      range: 12,
      maxSteps: 100,
      updateInterval: 1000,
      dx: 0,
      dy: 0,
      extraWalls: [
        [-300, -300, 750, 750]
      ]
    })
    controller.lastTarget = [-300, -300]
    return abyssling
  }
}()
!function() {
  const dim = dimension.create({
    mapSize: 3750,
    displayName: 'Abyss Hallway',
    displayRadiant: 127,
    name: 'abyssHallway',
    entryMessage: 'Entering The Abyss...',
    type: 'abyss',
    ambientParticles: [
      {
        amount: 20,
        radiant: 1,
        size: [5, 5],
        color: { r: 255, g: 228, b: 107 },
        d: 0,
        range: 100,
        speed: 150,
        fade: 25,
        t: 80,
        opacity: 100
      }, {
        amount: 10,
        radiant: 0,
        size: [75, 200],
        color: { r: 54, g: 54, b: 54 },
        d: 50,
        range: 30,
        speed: 650,
        fade: 20,
        t: 80,
        opacity: 50
      }
    ],
    walls: [[3450,-375,300,225],[3450,375,300,225],[2700,-1200,1050,600],[0,-2775,3750,975],[-3450,-375,300,225],[-3450,375,300,225],[3000,1200,750,600],[0,2775,3750,975],[900,-1200,450,600],[-300,-1200,450,600],[-1500,-1200,450,600],[-3000,-1200,750,600],[1500,1200,450,600],[300,1200,450,600],[-900,1200,450,600],[1800,150,150,450],[1200,-150,150,450],[600,150,150,450],[0,-150,150,450],[-600,150,150,450],[-1200,-150,150,450],[-1800,150,150,450],[-2400,-150,150,450],[-2700,1200,1050,600]],
    gates: [[2,3300,0,2,150,false,0],[2,-3300,0,2,150,false,0],[2,1500,-750,1,150,false,0],[2,300,-750,1,150,false,0],[2,-900,-750,1,150,false,0],[2,-2100,-750,1,150,false,0],[2,2100,750,3,150,false,0],[2,900,750,3,150,false,0],[2,-300,750,3,150,false,0],[2,-1500,750,3,150,false,0]],
    background: {
      r: 12,
      g: 12,
      b: 12
    },
    grid: {
      r: 21,
      g: 21,
      b: 21
    },
    gridSize: 100,
    maxPolygonSides: 8,
    maxPolygonCount: 50,
    spawnPlayer: function(team, tank) {
      start(tank)
      return [3600, 0]
    },
    spawnPolygon: function(sides) {
      return [3900 * Math.random() - 2250, 600 * (Math.random() * 2 - 1)]
    }
  })
  generator.wormhole({
    static: true,
    x: 3600,
    y: 0,
    size: 60,
    type: 2,
    dim: dim,
    action: function(tank) {
      tank.xv = -50 * dimension.per50
      tank.x --
    },
  })
  generator.wormhole({
    static: true,
    x: -3600,
    y: 0,
    size: 60,
    type: 2,
    dim: dim,
    action: function(tank) {
      if(!tank.abyssling) {
        dimension.sendTankTo({
          tank: tank,
          dim: 'abyss',
        })
      } else {
        tank.remove()
      }
    },
  })
  for(let i=0;i<4;i++) {
    generator.wormhole({
      static: true,
      x: 1500 - 1200 * i,
      y: -1650,
      size: 60,
      type: 2,
      dim: dim,
      action: function(tank) {
        tank.xv = 0
        tank.yv = 15 * dimension.per50
        tank.y += 1
      }
    })
    generator.wormhole({
      static: true,
      x: 2105 - 1200 * i,
      y: 1650,
      size: 60,
      type: 2,
      dim: dim,
      action: function(tank) {
        tank.xv = 0
        tank.yv = -15 * dimension.per50
        tank.y -= 1
      }
    })
  }
  const createAbyssling = function(tank, ss, sss) {
    if(!tank.alive) { return }
    let s = Math.floor((1650 - tank.x) / 600)
    let p = [3600, 0]
    if(s >= 0) {
      if(s > 7) { s = 7 }
      p[0] = 2100 - 600 * s
      p[1] = s & 1 ? -1645 : 1645
    }
    let abyssling = generator.tank({
      weight: 1,
      speed: sss || 1,
      dim: dim,
      x: p[0],
      y: p[1],
      name: "I'm hungry, and I want " + tank.name + "s",
      weapon: 'abyssling',
      body: 'abyssling',
      score: 1e9,
      radiant: 1,
      team: 8,
      invincible: false,
      ai: function(options) {
        let target = [-3600, 0]
        let tx = tank.x, ty = tank.y
        if(!tank.alive) {
          tx = -3600
          ty = 0
        }
        try {
          controller.update(options.now, tx, ty, [abyssling.x, abyssling.y])
          let i = controller.getImpulse(abyssling.x, abyssling.y)
          if(controller.directPath(abyssling.x, abyssling.y, tx, ty)) {
            target[0] = tx
            target[1] = ty
            controller.lastTarget = target
          } else if(i >= 0) {
            let dx = [50, 0, -50, 0][i], dy = [0, 50, 0, -50][i]
            target[0] = dx ? abyssling.x + dx : abyssling.x
            target[1] = dy ? abyssling.y + dy : abyssling.y
            controller.lastTarget = target
          } else {
            target = controller.lastTarget
          }
        } catch(e) { console.log(e) }
        abyssling.firing = true
        let d = [target[0] - abyssling.x, target[1] - abyssling.y]
        abyssling.d = dimension.averageAngles(abyssling.d, Math.atan2(-d[0], d[1]), dimension.smooth(2))
        abyssling.input.movement[0] = -Math.sin(abyssling.d)
        abyssling.input.movement[1] = Math.cos(abyssling.d)
      }
    })
    abyssling.abyssling = true
    let controller = pathfind.controller({
      tank: tank,
      range: 12,
      maxSteps: 100,
      updateInterval: 1000,
      dx: 0,
      dy: 0.5
    })
    controller.lastTarget = [abyssling.x, abyssling.y]
    return abyssling
  }
  const start = function(tank) {
    if(tank.static || !tank.ws.data.isPlayer) { return }
    dim.after(function() {
      let t = createAbyssling(tank)
	    if(!t) { return }
      let speed = 1
      let c = function() {
        if(!t.alive) {
          createAbyssling(tank, speed, speed)
          speed += 0.3
          if(speed < 10) {
            speed *= 1.1
          }
        }
        if(tank.alive) {
          dim.after(c, 3 * 1000)
        }
      }
      c()
    }, 3 * 60000)
  }
}();
5