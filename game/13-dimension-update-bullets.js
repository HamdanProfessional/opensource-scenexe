      for(let i=dim.bullets.length-1;i>=0;i--) {
        let bullet = dim.bullets[i], tank = bullet.parent
        if(bullet.arrasTop >= 0) {
          arrasPhysics.update(bullet)
        }

        dimension.confine(bullet, dim.mapSize - (bullet.size < 2 * dimension.clipSize ? bullet.size / 2 : bullet.size - dimension.clipSize), (dim.mapSizeSpeed > 0) ? (dim.mapSize > dim._mapSize ? dim.mapSizeSpeed : -dim.mapSizeSpeed) : 0)
        if(bullet.arrasOrbit) {
        } else if(arrasPhysics.isArrasDrone(bullet, tank)) {
          arrasPhysics.driveDrone(bullet, tank)
        } else if(bullet.type === 2 || bullet.type === 4) {
          let speed = dimension.tickMultiplier * bullet.speed * 0.05
          let dir = 1
          let moveTo = [tank.x, tank.y]
          let attacking = false
          bullet.target = false
          if(tank.firing || tank.droneControl) {
            moveTo = tank.mousePosition
            attacking = true
            if(tank.droneControl) {
              speed = -speed
            }
          } else if(tank.passive == false) {
            if(tank.detector) {
              if(tank.detector.closestObject) {
                bullet.target = tank.detector.closestObject
                moveTo = [bullet.target.x, bullet.target.y]
                attacking = true
              } else {
                bullet.target = false
              }
            }
          }
          let d
          if(speed >= 0) {
            d = Math.atan2(bullet.x - moveTo[0], moveTo[1] - bullet.y)
            if(bullet.type === 4 && attacking && bullet.visualType !== 2) {
              let d = [bullet.x - moveTo[0], bullet.y - moveTo[1]]
              d = Math.sqrt(d[0] * d[0] + d[1] * d[1]) - bullet.size - (bullet.target ? bullet.target.size : 0)
              if(d < ((tank.size + bullet.size * 0.5) * (tank.firing ? 2.5 : 0.5) + bullet.size) * (bullet.parent.fovMultiplier || 1)) {
                dir = -1
              }
            }
          } else {
            d = Math.atan2(moveTo[0] - bullet.x, bullet.y - moveTo[1])
            speed = -speed
          }
          if(bullet.timeExisted < 1.5) {
            let slide = 10 * (1 - bullet.timeExisted / 1.5)
            bullet.d = dimension.averageAngles(bullet.d, d, dimension.smooth(slide))
          } else {
            bullet.d = d
          }
          speed *= 1.1 * (bullet.type === 2 ? 1 : 0.8) * tank.sBulletSpeed
          bullet.xv += -dimension.tickMultiplier * Math.sin(bullet.d) * speed * dir
          bullet.yv += dimension.tickMultiplier * Math.cos(bullet.d) * speed * dir
        } if(bullet.type === 3 || bullet.type === 4 || bullet._barrels.length > 0) {
          for(let i=0,l=bullet._barrels.length;i<l;i++) {
            let barrel = bullet._barrels[i]
            if(barrel.data.type === 6 || barrel.data.type === 7 || barrel.data.type > 9) { continue }
            barrel.current += dimension.tickMultiplier * 0.01
            let reload = barrel.data.reload * 0.5 * (1 - tank.upgrades[3] / 30) / bullet.parent.sReload
            let active
            if(barrel.data.type === 2 || barrel.data.type === 4) {
              if(barrel.bullets.length >= barrel.data.drones * (1 + tank.upgrades[0] * 0.05666666667)) {
                active = false
              } else {
                active = true
              }
            } else {
              if(bullet.type === 4) {
                active = tank.firing || tank.droneControl || (!tank.passive && bullet.target)
              } else {
                active = !tank.passive
              }
              if(barrel.turret && !barrel.turret.active) {
                active = false
              }
              if(barrel.data.maxChildren > 0 && !barrel.data.destroyOldest && barrel.bullets.length >= barrel.data.maxChildren) {
                active = false
              }
            }
            if(bullet.dying) {
              active = barrel.data.shootOnDeath === true
              if(active && barrel.current < reload) {
                barrel.current = reload
              }
            } else if(barrel.data.shootOnDeath) {
              active = false
            }
            if(active) {
              if(barrel.current >= reload) {
                if(reload) {
                  barrel.current -= reload
                  if(barrel.current >= reload) {
                    barrel.current = barrel.current % reload
                  }
                } else {
                  barrel.current = 0
                }
                if(barrel.data.type === 1 || barrel.data.type === 3) {
                  if(barrel.bullets.length > barrel.maxTraps) {
                    barrel.bullets[0].remove()
                  }
                }
                let d = (barrel.turret ? barrel.turret.d : bullet.d) + barrel.data.d
                let x = bullet.x
                let y = bullet.y
                let tank = bullet.parent
                let arrasChild = tank.physics === 'arras' && barrel.data.arras
                let offsetX = -barrel.data.x
                let offsetY = -barrel.data.y + barrel.data.height * (arrasChild ? 2 : 1)
                let sin = Math.sin(d)
                let cos = Math.cos(d)
                let speed = dimension.getBulletSpeed(barrel.data, bullet.parent) * tank.sBulletSpeed
                let [time, health] = dimension.getBulletData(barrel.data.type, bullet.parent)
                let rsize, size
                if(arrasChild) {
                  let unit = barrel.turret ? barrel.turret.size * 0.5 : 1
                  rsize = unit * bullet.size
                  size = unit * (barrel.data.size || 1) * barrel.data.width
                } else {
                  rsize = barrel.data.relativeSizeS * tank.size
                  size = (barrel.data.relativeSizeS || barrel.data.relativeSize) * barrel.data.width
                }
                if(barrel.data.type === 8) {
                  let p = generator.polygon({
                    x: x + rsize * (cos * offsetX - sin * offsetY),
                    y: y + rsize * (cos * offsetY + sin * offsetX),
                    d: d,
                    sides: 3,
                    dim: tank.dim,
                    radiant: 1,
                  })
                  p.xv = -sin * speed * dimension.per50
                  p.yv = cos * speed * dimension.per50
                } else if(barrel.data.type < 9) {
                  let rsin = sin, rcos = cos
                  if(barrel.data.spread) {
                    d += ((Math.random() - 0.5) * barrel.data.spread * Math.PI) % (2 * Math.PI)
                    rsin = Math.sin(d)
                    rcos = Math.cos(d)
                  }
                  generator.bullet({
                    dim: dim,
                    parent: tank,
                    sparent: bullet,
                    barrelId: barrel.id,
                    size: size,
                    d: d,
                    damage: (1 + tank.upgrades[2] / 22.5) * tank.sBulletDamage * (1 + tank.upgrades[1] / 60),
                    health: barrel.data.penetration * health * (1 + tank.upgrades[0] / 17.6),
                    lifeTime: barrel.data.time * time,
                    x: x + rsize * (cos * offsetX - sin * offsetY),
                    y: y + rsize * (cos * offsetY + sin * offsetX),
                    xv: -rsin * speed,
                    yv: rcos * speed,
                    speed: speed,
                    barrel: barrel
                  })
                }
                if(barrel.data.recoil) {
                  if(arrasChild) {
                    arrasPhysics.recoil(tank, barrel, sin, cos, bullet)
                  } else {
                    let recoil = 0.6 * barrel.data.recoil * size * size * (1 + tank.upgrades[1] / 30)
                    bullet.xv += recoil * sin * dimension.per50
                    bullet.yv -= recoil * cos * dimension.per50
                  }
                }
              }
            } else {
              let max = reload * (1 - barrel.data.delay)
              if(barrel.current > max) {
                barrel.current = max
              }
            }
          }
          if(bullet.auras) {
            for(let u=0,k=bullet.auras.length;u<k;u++) {
              let aura = bullet.auras[u]
              let m = (1 + tank.upgrades[3] / 15) * tank.sReload * (1 + tank.upgrades[2] / 15) * tank.sBulletDamage * (1 + tank.upgrades[0] / 15)
              if(aura.detector && tank.passive === false && aura.detector && aura.detector.objects) {
                if(aura.type === 0) {
                  for(let i=aura.detector.objects.length-1;i>=0;i--) {
                    let c = aura.detector.objects[i]
                    if(!(c.invincible || c.inBase || c.prevInBase)) {
                      let max = c.size * 2
                      let distance = aura.detector.distances[i] + max
                      let im = distance < 0 ? 1 : ((1 - distance / max) * 0.5 + 0.5)
                      c.damage(dimension.tickMultiplier * im * m * aura.auraDamage * 5 * tank.levelMultiplier, tank, 'tanks')
                    }
                  }
                } else if(aura.type === 1 && aura.healing) {
                  for(let i=aura.detector.objects.length-1;i>=0;i--) {
                    aura.detector.objects[i].regen += ((aura.healing - 1) * (1 + tank.upgrades[3] / 20) * tank.sReload * 0.1 * (1 + tank.upgrades[6] / 15))
                  }
                } else if(aura.type === 2 && aura.auraPull) {
                  for(let i=aura.detector.objects.length-1;i>=0;i--) {
                    let c = aura.detector.objects[i]
                    if(!(c.invincible || c.inBase || c.prevInBase)) {
                      let dx = c.x - aura.gameX
                      let dy = c.y - aura.gameY
                      let d = Math.sqrt(dx * dx + dy * dy)
                      let m = aura.auraPull * 0.3 * (bullet.size * tank.weight) / (c.size * (c.weight || 1))
                      if(d < 1) { d = m }
                      else { d = m / d }
                      c.xv -= dx * d * dimension.per50 * dimension.per50
                      c.yv -= dy * d * dimension.per50 * dimension.per50
                    }
                  }
                }
              }
            }
          }
        }
        if(bullet.turrets && bullet.turrets[0]) {
          for(let u=0,k=bullet.turrets.length;u<k;u++) {
            let turret = bullet.turrets[u]

            dimension.updateTurret(turret, bullet, tank)
          }
        }
        bullet.lx = bullet.x
        bullet.ly = bullet.y
        if(bullet.dying) {
          bullet.remove()
        }
      }
