let voidlings = 0;
let firstVoidlings = 0;
!function() {
  const dim = dimension.create({
    mapSize: 15000,
    wrap: true,
    displayName: 'Void',
    displayRadiant: 127,
    name: 'voidd',
    exitMessage: '[SERVER]: Error resolved...',
    type: 'voidd',
    noMinimap: true,
    ambientParticles: [
      {
        amount: 100,
        radiant: 1,
        size: [10, 10],
        color: { r: 255, g: 255, b: 255 },
        d: 90,
        range: 35,
        speed: 5000,
        fade: 20,
        t: 80,
        opacity: 100
      }, {
        amount: 100,
        radiant: 1,
        size: [10, 10],
        color: { r: 255, g: 255, b: 255 },
        d: -90,
        range: 35,
        speed: 5000,
        fade: 20,
        t: 80,
        opacity: 100
      }
    ],
    walls: [],
    gates: [],
    darkness: 1,
    background: {
      r: 0,
      g: 0,
      b: 0
    },
    grid: {
      r: 10,
      g: 10,
      b: 10
    },
    gridSize: 250,
    maxPolygonSides: 20,
    maxPolygonCount: 500,
    spawnPlayer: function(team, tank) {
      return [(2 * Math.random() - 1) * 14500, (2 * Math.random() - 1) * 14500]
    },
    spawnPolygon: function(sides) {
      return spawnOutsideRadius(14500, 18000000)
    }
  })
  const createVoidling = function() {
    voidlings++
    firstVoidlings++
    let abyssling = generator.tank({
      dim: dim,
      x: (2 * Math.random() - 1) * 14500,
      y: (2 * Math.random() - 1) * 14500,
      name: '[THE DARKNESS]',
      weapon: 'voidling',
      body: 'voidling',
      score: 1e12,
      radiant: Math.random() < 0.2 ? (Math.random() < 0.2 ? 3 : 2) : 1,
      team: 8,
      invincible: false,
      onDeath: function() {
        voidlings--
        let amount = Math.random() < 0.7 ? 4 : 5
        for(let i=0;i<amount;i++) {
          let sides = -1
          while(sides > -5 && Math.random() < 0.35) {
            sides --
          }
          let p = generator.polygon({
            x: abyssling.x,
            y: abyssling.y,
            d: 2 * Math.PI * Math.random(),
            sides: sides,
            dim: dim,
            radiant: abyssling.radiant + (Math.random() < 0.3 ? 1 : 0)
          })
          let r = Math.random() * 2 * Math.PI
          p.xv = 60 * Math.cos(r) * dimension.per50
          p.yv = 60 * Math.sin(r) * dimension.per50
        }
      },
      ai: function(options) {
        let target = [0, 0]
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

      }
    })
    abyssling.upgrades[8] = 15
    let obj = false
    abyssling.abyssling = true
    let controller = pathfind.controller({
      tank: abyssling,
      range: 12,
      maxSteps: 100,
      updateInterval: 1000,
      dx: 0,
      dy: 0,

    })
    controller.lastTarget = [-300, -300]
    return abyssling
  }
  dim.every(function() {
    if (firstVoidlings < 8) {
      createVoidling()
    }
  }, 600)
  dim.every(function() {
    if (voidlings < 8) {
      createVoidling()
    }
  }, 60000)
  generator.wormhole({
    static: true,
    x: 0,
    y: 0,
    size: 360,
    type: 2,
    dim: dim,
    action: function(tank) {
      if(!tank.abyssling) {
        dimension.sendTankTo({
          tank: tank,
          dim: 'crossroadsLobby',
        })
      } else {
        tank.remove()
      }
    },
  })
}()
!function() {
  const dim = dimension.create({
    mapSize: 5000,
    displayName: 'Void Maze',
    displayRadiant: 127,
    name: 'voiddMaze',
    entryMessage: '[SERVER]: An unexpected error occured...',
    type: 'voidd',
    noMinimap: true,
    ambientParticles: [
      {
        amount: 100,
        radiant: 1,
        size: [10, 10],
        color: { r: 255, g: 255, b: 255 },
        d: 90,
        range: 35,
        speed: 5000,
        fade: 20,
        t: 80,
        opacity: 100
      }, {
        amount: 100,
        radiant: 1,
        size: [10, 10],
        color: { r: 255, g: 255, b: 255 },
        d: -90,
        range: 35,
        speed: 5000,
        fade: 20,
        t: 80,
        opacity: 100
      }
    ],
    walls: [[0,3600,5000,1400],[0,-3600,5000,1400],[4600,-1200,400,1000],[4600,1200,400,1000],[-4600,-1200,400,1000],[-4600,1200,400,1000],[3700,-500,500,100],[3300,100,100,300],[3800,300,200,100],[3900,800,100,400],[4100,1100,100,100],[3200,1100,400,100],[-2100,-700,100,100],[2900,500,100,300],[2700,900,100,300],[3100,700,100,100],[3300,-1200,100,400],[3700,-1500,300,100],[3700,-900,300,100],[2900,-300,100,300],[2900,100,100,100],[3700,-1900,100,300],[2500,1500,900,100],[1700,1200,100,200],[2200,1100,400,100],[3800,1500,200,100],[3700,2000,100,200],[3000,1900,400,100],[2700,2100,100,100],[1900,1900,700,100],[1300,1300,100,300],[1800,700,600,100],[2500,500,300,100],[900,1300,100,700],[900,300,100,300],[1900,100,900,100],[3900,100,100,100],[2500,-900,500,100],[2300,-300,100,300],[2500,-1300,500,100],[2100,-1100,100,100],[2300,-1700,700,100],[1500,-1600,100,400],[1600,-900,200,100],[3500,-100,100,100],[2900,-2000,100,200],[3200,-1900,200,100],[1500,-400,100,200],[1900,-400,100,200],[500,1400,100,800],[700,700,100,100],[400,-300,400,100],[100,400,100,600],[500,200,100,200],[1100,-800,100,600],[700,-900,100,500],[900,-1300,100,100],[-100,1700,100,500],[300,-1400,100,400],[700,-1700,300,100],[300,-700,100,300],[900,-2100,100,100],[-400,-100,200,100],[-400,500,200,100],[-800,-100,200,100],[-900,400,100,400],[-500,900,100,100],[-500,1300,100,300],[-700,1700,300,100],[-900,2000,100,200],[-500,2100,100,100],[-900,1200,100,200],[-500,300,100,100],[-700,-500,100,300],[-300,-500,100,100],[3700,-1300,100,100],[300,-1900,100,100],[-1200,-1100,600,100],[-1300,-200,100,600],[-1100,-700,100,100],[300,1500,100,100],[-300,-1200,100,200],[-700,-1400,100,200],[-300,-1700,100,100],[-500,-2100,100,100],[-900,-1700,100,300],[-1900,-1600,100,600],[-1400,-1700,200,100],[-1300,-1500,100,100],[-1500,-1900,100,100],[-1400,-1300,200,100],[-1700,0,100,800],[-1400,700,200,100],[-1400,1100,200,100],[-1500,1500,300,100],[-1900,1300,100,300],[-1600,1900,400,100],[-2300,1800,100,400],[-1300,2100,100,100],[-2700,1600,100,400],[-2600,1100,200,100],[-2400,900,200,100],[-3100,1300,300,100],[-3300,1800,100,200],[-2900,1700,100,100],[-3800,2100,200,100],[-3700,1700,100,300],[-3300,800,100,400],[-3700,300,500,100],[-3700,900,100,300],[-4000,900,200,100],[-3900,1700,100,100],[-4100,1300,100,100],[-3300,2100,100,100],[-2600,500,400,100],[-2900,700,100,100],[-3100,700,100,100],[-2300,0,100,400],[-1900,100,100,100],[-2200,-500,200,100],null,[-2800,100,200,100],[-2900,-900,500,100],[-3700,-200,100,400],[-3700,-1500,100,700],[-3100,-100,300,100],[-3200,-500,400,100],[-2500,-1300,500,100],[-3300,-1300,100,300],[-2700,-1700,700,100],[-2500,-500,100,100],[-2900,-2100,100,100],[-100,-1400,100,800]],
    gates: [[2,4700,0,2,200,false,0],[2,-4700,0,2,200,false,0]],
    darkness: 1,
    background: {
      r: 5,
      g: 5,
      b: 5
    },
    grid: {
      r: 15,
      g: 15,
      b: 15
    },
    gridSize: 100,
    maxPolygonSides: 3,
    maxPolygonCount: 100,
    spawnPlayer: function(team, tank) {
      return [4900, 0]
    },
    spawnPolygon: function(sides) {
      return [(2 * Math.random() - 1) * 4500, (2 * Math.random() - 1) * 1900]
    }
  })
  generator.wormhole({
    static: true,
    x: 4900,
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
    x: -4900,
    y: 0,
    size: 60,
    type: 2,
    dim: dim,
    action: function(tank) {
      if(!tank.abyssling) {
        dimension.sendTankTo({
          tank: tank,
          dim: 'voidd',
        })
      } else {
        tank.remove()
      }
    },
  })
}();
6