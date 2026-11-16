      updateTank: function(tank, directionChange, dt) {
        if(tank.fadeTime < 1) {
          tank.fadeTime -= dt * 0.006
          if(tank.fadeTime <= 0) {
            tank.fadeTime = 0
            let i = gameData.tanks.indexOf(tank)
            if(i >= 0) {
              gameData.tanks.splice(i, 1)
              return
            }
          }
        }
        if(tank.team === 0 || tank.team > 9) {
          if(tank === gameData.me || (tank.team && tank.team === gameData.me.team)) {
            tank.color = render.teamColors[1]
          } else {
            tank.color = render.teamColors[0]
          }
        }
        let lerp = render.lerpOf(tank)
        tank.x = render.slide(tank.ox, tank.nx, lerp)
        tank.y = render.slide(tank.oy, tank.ny, lerp)
        tank.size = util.average(tank.size, tank._size, 15)
        if(tank._d) {
          let length = tank._d[1].length
          if(tank._d[2]) {
            tank._d[0] = 0
          } else {
            if(tank._d[0] < length) {
              tank._d[0] += dt / (1000 / ((render.serverInfo && render.serverInfo[0] > 0) ? render.serverInfo[0] : 60))
            }
          }
          let i = Math.floor(tank._d[0])
          if(i > length - 1) {
            i = tank._d[0] = length - 1
          }
          tank.d = util.averageAngle(tank.d, tank._d[1][i], 0.75)
        }
        tank.passiveFade = util.average(tank.passiveFade, tank.passive ? 1 : 0, 2)
        tank.damageFlash = util.average(tank.damageFlash, tank._damageFlash, 15)
        for(let i=tank._turrets.length-1;i>=0;i--) {
          let turret = tank._turrets[i].turret, turretData = {}
          if(turret.id >= 0 && tank.turretData) {
            let data = tank.turretData[turret.id]
            if(data) {
              turretData = data
            } else if(turret.angle >= 0 || turretData.angle <= 0) {
              turretData = tank.turretData[turret.id] = {
                d: turret.angle + tank.d
              }
            }
            turretData.d = util.averageAngle(turretData.d || turretData._d, (turretData._d >= 0 || turretData._d <= 0) ? turretData._d : (turret.angle + tank.d), 3)
          }
        }
        if(tank._barrels && tank._barrels[0]) {
          for(let i=0,l=tank._barrels.length;i<l;i++) {
            let barrel = tank._barrels[i].barrel
            let speed = 2 / barrel.reload * directionChange
            if(barrel.v > 1) {
              barrel.v -= 0.2 * directionChange
              if(barrel.v < 1) {
                barrel.v = 1
              }
            } else if(barrel.v > 0) {
              barrel.v -= 0.05 * speed
              if(barrel.v < 0) {
                barrel.v = 0
              }
            }
          }
        }
      },
      updateBullet: function(bullet, dt) {
        if(bullet.fadeTime < 1) {
          bullet.fadeTime -= dt * 0.006
          if(bullet.fadeTime <= 0) {
            bullet.fadeTime = 0
            let i = gameData.bullets.indexOf(bullet)
            if(i >= 0) {
              gameData.bullets.splice(i, 1)
              return
            }
          }
        } else if(bullet.fadeTime > 1) {
          bullet.fadeTime -= dt * 0.006
          if(bullet.fadeTime < 1) {
            bullet.fadeTime = 1
          }
        }
        if(bullet.parent) {
          bullet.passive = bullet.parent.passive
          bullet.passiveFade = bullet.parent.passiveFade
        }
        render.moveObject(bullet)
        bullet.damageFlash = util.average(bullet.damageFlash, bullet._damageFlash, 15)
        let tank = bullet.parent
        if(tank) {
          if(tank.team === 5) {
            bullet.color = render.getTankColor(tank.team, bullet.sides)
          } else {
            bullet.color = tank.color
          }
          bullet.radiant = tank.radiant
          let barrel = tank._barrels[bullet.barrelId]
          if(barrel) {
            bullet.size = tank.size * barrel.barrel.relativeSize
          }
        }
        if(bullet.turrets && bullet.turrets[0]) {
          for(let i=0,l=bullet.turrets.length;i<l;i++) {
            let turret = bullet.turrets[i], turretData = {}
            if(turret.id >= 0 && tank.turretData) {
              let data = bullet.turretData[turret.id]
              if(data) {
                turretData = data
                turretData.d = util.averageAngle(turretData.d || turretData._d, turretData._d, 3)
              }
            }
          }
        }
      },
      updatePolygon: function(polygon, dt) {
        if(polygon.fadeTime < 1) {
          polygon.fadeTime -= dt * 0.006
          if(polygon.fadeTime <= 0) {
            polygon.fadeTime = 0
            let i = gameData.polygons.indexOf(polygon)
            if(i >= 0) {
              gameData.polygons.splice(i, 1)
              return
            }
          }
        } else if(polygon.fadeTime > 1) {
          polygon.fadeTime -= dt * 0.006
          if(polygon.fadeTime < 1) {
            polygon.fadeTime = 1
          }
        }
        render.moveObject(polygon)
        polygon.color = render.averageColors(polygon.color, polygon._color, 0.1)
        polygon.size = util.average(polygon.size, polygon._size, 6)
        polygon.damageFlash = util.average(polygon.damageFlash, polygon._damageFlash, 15)
      },
      moveObject: function(e) {
        let lerp = render.lerpOf(e)
        e.x = render.slide(e.ox, e.nx, lerp)
        e.y = render.slide(e.oy, e.ny, lerp)
        e.d = util.slideAngle(e.od, e.nd, lerp)
      },
      updateWall: function(wall) {
        if(!wall) { return }
        wall.x = render.slide(wall.ox, wall.nx, game.lerp)
        wall.y = render.slide(wall.oy, wall.ny, game.lerp)
      },
      drawCircle: function (circle) {
        ctx.beginPath();
        ctx.ellipse(
          circle.x,
          circle.y,
          circle.size + 2.5,
          circle.size + 2.5,
          0,
          0,
          2 * Math.PI
        );
        ctx.fill();
        ctx.closePath();
        if (circle.fillOnly) {
          return;
        }
        ctx.beginPath();
        ctx.ellipse(
          circle.x,
          circle.y,
          circle.size,
          circle.size,
          0,
          0,
          2 * Math.PI
        );
        ctx.stroke();
        ctx.closePath();
      },
