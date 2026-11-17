!(function () {
  const dim = dimension.create({
    mapSize: 6000,
    name: "sanctuary",
    type: "4teams",
    freeJoin: false,
    allowScale: true,
    removeFallens: true,
    displayName: "Sanctuary",
    entryMessage: "Ascending to the Sanctuary...",
    displayRadiant: 0,
    displayColor: 6,
    walls: [[4e3, 4e3, 2e3, 2e3], [-4e3, 4e3, 2e3, 2e3], [4e3, -4e3, 2e3, 2e3], [-4e3, -4e3, 2e3, 2e3], [1100, 4e3, 900, 2e3], [-1100, 4e3, 900, 2e3], [1100, -4e3, 900, 2e3], [-1100, -4e3, 900, 2e3], [4e3, 1100, 2e3, 900], [4e3, -1100, 2e3, 900], [-4e3, 1100, 2e3, 900], [-4e3, -1100, 2e3, 900], [0, 0, 1e3, 1e3, 6]],
    gates: [[3, -2300, 0, 0, 200, false, 0], [3, 2300, 0, 2, 200, false, 0], [3, 0, -2300, 1, 200, false, 0], [3, 0, 2300, 3, 200, false, 0]],
    background: {
      r: 80,
      g: 80,
      b: 80,
    },
    grid: {
      r: 75,
      g: 75,
      b: 75,
    },
    gridSize: 25,
    maxPolygonSides: 8,
    maxPolygonCount: 0,
    spawnPlayer: function (team, tank) {
        if(tank.team != 6 && tank.ws && tank.ws.data && tank.ws.data.isPlayer){
        tank.ascend();
        tank.ws.sendPacket("announcement", "Ascention complete.");
        }
      if(tank.body === 'abyssal' && dim.eventAbyssal) {
        setTimeout(function() {
          if(tank.dim === dim && tank.body === 'abyssal') {
            try { dimension.sendTankTo({ tank: tank, dim: ['ffa', '2teams', '4teams'][Math.floor(Math.random() * 3)] }) } catch(e) {}
          }
        }, 100)
      }
      tank.invincible = true;
      tank.invincibleTime = _performance.now() + 15000;
      return [0, 0];
    },
  });
  generator.wormhole({
    x: 5750,
    y: 0,
    size: 75,
    type: 2,
    dim: dim,
    action: function (tank) {
      tank.xv = -20 * dimension.per50
      tank.yv = 0
      console.log(tank.lastDim)
        dimension.sendTankTo({
          x: 9150,
          y: 0,
          tank: tank,
          dim: "crossroads",
        });
    },
  });

  generator.wormhole({
    x: -5750,
    y: 0,
    size: 75,
    type: 2,
    dim: dim,
    action: function (tank) {
      tank.xv = 20 * dimension.per50
      tank.yv = 0
        dimension.sendTankTo({
          x: -9150,
          y: 0,
          tank: tank,
          dim: "crossroads",
        });
    },
  });

  generator.wormhole({
    x: 0,
    y: 5750,
    size: 75,
    type: 2,
    dim: dim,
    action: function (tank) {
      tank.yv = -20 * dimension.per50
      tank.xv = 0
        dimension.sendTankTo({
          x: 0,
          y: 9150,
          tank: tank,
          dim: "crossroads",
        });
    },
  });

  generator.wormhole({
    x: 0,
    y: -5750,
    size: 75,
    type: 2,
    dim: dim,
    action: function (tank) {
      tank.yv = 20 * dimension.per50
      tank.xv = 0
        dimension.sendTankTo({
          x: 0,
          y: -9150,
          tank: tank,
          dim: "crossroads",
        });
    },
  });

    generator.tank({
      dim: dim,
      x: 0,
      y: 0,
      name: "Prime celestial",
      weapon: "ganymede",
      body: "andromeda",
      score: 1.8e19,
      radiant: 0,
      ai: "defender",
      static: true,
      team: 6,
    });

  let sanctuary = function ($) {
    $.every(function () {
      if (0.9 > Math.random()) {
        let e = wormhole.count($, 0),
          t = 0;
        let color = Math.floor(Math.random() * 3) + 1;
        const sendto = ["ffa", "2teams", "4teams"][color - 1]
        if (Math.random() < (t = 0 === e.length ? 0.5 : 2 / (3 + e.length))) {
          let a = $.mapSize - 4500,
            n = (2 * Math.random() - 1) * a,
            i = (2 * Math.random() - 1) * a;
          if (!(-1050 < n && n < 1050 && -1050 < i && i < 1050)) {
            generator.wormhole({
              x: n,
              ruptured: 1,
              color: color,
              y: i,
              size: 100,
              type: 0,
              time: 22.5 + 20 * Math.random(),
              dim: $,
              action: function ($) {
                dimension.sendTankTo({
                  tank: $,
                  dim: sendto,
                });
              },
            });
          }
        }
      }
    }, 1e3);
  };
  sanctuary(dim);
  special('./scheduled-events.js', dim)
})();
