    bounceCircles: function(a, b, data, maxForce, minForce) {
      let distance = (Math.sqrt(data.distance) || 0)
      if(distance <= 1) { distance = 1 }
      let force = (data.size - distance + 1) * 0.01 * maxForce
      if(force > 0.5) { force = 0.5 }
      else if(force < minForce) { force = minForce }
      let rt = force / distance
      let x = (a.x - b.x)
      let y = (a.y - b.y)

      if(x === 0) {
        x = (Math.random() - 0.5) * 0.1
      } if(y === 0) {
        y = (Math.random() - 0.5) * 0.1
      }
      x = x * rt
      y = y * rt
      let fA = 1
      let fB = 1
      let sA = a.size * (a.weight || 1)
      let sB = b.size * (b.weight || 1)
      if(b.size > a.size) {
        fB = (fB = sA / sB) * fB
      } else {
        fA = (fA = sB / sA) * fA
      }
      if(a.objectType === 'bullet') { fB *= 0.25 }
      if(b.objectType === 'bullet') { fA *= 0.25 }
      if(!a.static || a.canBePushed) {
        fA *= dimension.tickMultiplier * dimension.per50 / (a.density || 1)
        a.xv += x * fA
        a.yv += y * fA
      } if(!b.static || b.canBePushed) {
        fB *= dimension.tickMultiplier * dimension.per50 / (b.density || 1)
        b.xv += -x * fB
        b.yv += -y * fB
      }
    },
    collideMatrix: function(object) {
      if(object.noHitBox) { return }
      let dim = object.dim
      let xl = dim.flat(object.x - object.size), xh = dim.flat(object.x + object.size)
      let yl = dim.flat(object.y - object.size), yh = dim.flat(object.y + object.size)
      for(let x=xl;x<=xh;x++) {
        let m = dim.matrixWalls[x]
        if(m) {
          for(let y=yl;y<=yh;y++) {
            if(m[y]) {
              let wx = x * 50 + 25, wy = y * 50 + 25
              let dx = object.x - wx, dy = object.y - wy
              let ix = dx >= -25 && dx <= 25, iy = dy >= -25 && dy <= 25
              if(ix && iy) {
                if(object.objectType !== 'tank') {
                  object.remove()
                } else {
                  let ldx = object.lx - wx, ldy = object.ly - wy
                  if(Math.abs(ldx) > Math.abs(ldy)) {
                    if(ldx < 0) {
                      object.x = wx - 25 - object.size
                      object.xv = -Math.abs(object.xv) * dimension.wallRestitution
                    } else {
                      object.x = wx + 25 + object.size
                      object.xv = Math.abs(object.xv) * dimension.wallRestitution
                    }
                  } else {
                    if(ldy < 0) {
                      object.y = wy - 25 - object.size
                      object.yv = -Math.abs(object.yv) * dimension.wallRestitution
                    } else {
                      object.y = wy + 25 + object.size
                      object.yv = Math.abs(object.yv) * dimension.wallRestitution
                    }
                  }
                }
              } else if(ix ^ iy) {
                if(ix) {
                  if(dy < 0) {
                    object.y = wy - 25 - object.size
                    object.yv = -Math.abs(object.yv) * dimension.wallRestitution
                  } else {
                    object.y = wy + 25 + object.size
                    object.yv = Math.abs(object.yv) * dimension.wallRestitution
                  }
                } else {
                  if(dx < 0) {
                    object.x = wx - 25 - object.size
                    object.xv = -Math.abs(object.xv) * dimension.wallRestitution
                  } else {
                    object.x = wx + 25 + object.size
                    object.xv = Math.abs(object.xv) * dimension.wallRestitution
                  }
                }
              } else {
                let sx = dx < 0 ? -1 : 1, sy = dy < 0 ? -1 : 1
                let side = dim.matrixWalls[x + sx]
                let alongX = side && side[y], alongY = m[y + sy]
                if(alongX && !alongY) {
                  if(Math.abs(dy) < 25 + object.size) {
                    object.y = wy + sy * (25 + object.size)
                    object.yv = sy * Math.abs(object.yv) * dimension.wallRestitution
                  }
                } else if(alongY && !alongX) {
                  if(Math.abs(dx) < 25 + object.size) {
                    object.x = wx + sx * (25 + object.size)
                    object.xv = sx * Math.abs(object.xv) * dimension.wallRestitution
                  }
                } else if(!alongX) {
                  let ox = dx < 0 ? 25 : -25, oy = dy < 0 ? 25 : -25
                  let cx = dx + ox, cy = dy + oy
                  let d = cx * cx + cy * cy
                  if(d < object.size * object.size) {
                    let len = d < 1 ? 1 : Math.sqrt(d)
                    d = d < 1 ? object.size : object.size / len
                    object.x = wx - ox + cx * d
                    object.y = wy - oy + cy * d
                    dimension.stopInto(object, cx / len, cy / len)
                  }
                }
              }
            }
          }
        }
      }
    },
    collideWall: function(data) {
      let rect = data.rect, obj = data.circle.object
      if(data.cinX || data.cinY) {
        if(data.cinX && data.cinY) {
          if(Math.abs((obj.y - rect.y) * rect.w) > Math.abs((obj.x - rect.x) * rect.h)) {
            if(obj.y > rect.y) {
              obj.y = data.rect.top + data.size
            } else {
              obj.y = data.rect.bottom - data.size
            }
          } else {
            if(obj.x > rect.x) {
              obj.x = data.rect.right + data.size
            } else {
              obj.x = data.rect.left - data.size
            }
          }
          if(obj.objectType !== 'tank') {
            obj.remove()
          } else {
            obj.health -= obj.maxHealth * 0.002 * dimension.per50
          }
        } else {
          if(data.cinY && data.inX) {
            let b = (obj.x > rect.x)
            if(b) {
              obj.x = data.rect.right + data.size
            } else {
              obj.x = data.rect.left - data.size
            }
            obj.xv = (b ? 1 : -1) * Math.abs(obj.xv * dimension.wallRestitution)
          } if(data.cinX && data.inY) {
            let b = (obj.y > rect.y)
            if(b) {
              obj.y = data.rect.top + data.size
            } else {
              obj.y = data.rect.bottom - data.size
            }
            obj.yv = (b ? 1 : -1) * Math.abs(obj.yv * dimension.wallRestitution)
          }
        }
      } else {
        let distance = Math.sqrt(data.distance)
        if(distance < 0.1) {
          distance = 0.1
        }
        let r = obj.size / distance
        obj.x = data.cx + (obj.x - data.cx) * r
        obj.y = data.cy + (obj.y - data.cy) * r
        dimension.stopInto(obj, data.dcx / distance, data.dcy / distance)
      }
    },
    stopInto: function(obj, nx, ny) {
      if(!(obj.xv === obj.xv && obj.yv === obj.yv)) { return }
      let vn = obj.xv * nx + obj.yv * ny
      if(vn < 0) {
        vn *= 1 + dimension.wallRestitution
        obj.xv -= vn * nx
        obj.yv -= vn * ny
      }
    },
    wallCorners: function(list) {
      let covers = function(a, px, py) {
        for(let i=0;i<list.length;i++) {
          let b = list[i]
          if(b === a || b.object.team !== a.object.team) { continue }
          if(px > b.x - b.w && px < b.x + b.w && py > b.y - b.h && py < b.y + b.h) { return true }
        }
        return false
      }
      for(let i=0;i<list.length;i++) {
        let a = list[i], corners = []
        for(let k=0;k<4;k++) {
          let sx = (k & 1) ? 1 : -1, sy = (k & 2) ? 1 : -1
          let px = a.x + sx * a.w, py = a.y + sy * a.h
          let alongX = covers(a, px + sx, py - sy)
          let alongY = covers(a, px - sx, py + sy)
          corners.push(alongX && alongY ? 3 : alongX ? 1 : alongY ? 2 : 0)
        }
        a.corners = corners.some(c => c) ? corners : null
      }
    },
    bounceGate: function(b, c, e) {
      e *= dimension.tickMultiplier
      if((b.d === 0) + (b.d === 2)) {
        if(c.xv > 0) {
          c.xv = -e
          c.x = b.left - c.size - 1
        } else {
          c.xv = e
          c.x = b.right + c.size + 1
        }
      } else {
        if(c.yv > 0) {
          c.yv = -e
          c.y = b.bottom - c.size - 1
        } else {
          c.yv = e
          c.y = b.top + c.size + 1
        }
      }
    },
    collideGate: function(data, c) {
      let b = data.rect, open = b.object[5]
      if(b.gateType === 2 || (c.timeExisted < 1 && c.objectType === 'tank')) {
        let nv = (b.d < 2 ? 50 : -50) * dimension.per50
        if(b.d === 0 || b.d === 2) {
          c.xv = nv
        } else {
          c.yv = nv
        } if(b.gateType === 1) {
          if(c.radiant > 0) {
            b.object[5] = true
            b.object[6] = 75
          }
        }
      } else if(b.gateType === 1) {
        if(!open && !(c.parent && c.parent.radiant > 0)) {
          if(c.radiant > 0) {
            b.object[5] = true
            b.object[6] = 75
          } else if(b.d === 0 || b.d === 2) {
            if(c.xv > 0) {
              c.xv = -30 * dimension.per50
              c.x = b.left - c.size - 1
            } else {
              c.xv = 30 * dimension.per50
              c.x = b.right + c.size + 1
            }
          } else {
            if(c.yv > 0) {
              c.yv = -30 * dimension.per50
              c.y = b.bottom - c.size - 1
            } else {
              c.yv = 30 * dimension.per50
              c.y = b.top + c.size + 1
            }
          }
        }
      } else if(b.gateType === 0) {
        const ascensionEnabled = false
        if(ascensionEnabled && c.level >= 60 && c.team !== 7) {
          if(c.team !== 6) {
            c.ascend()
            if(c.ws && c.ws.sendPacket) {
              c.ws.sendPacket('setStats', c.upgrades)
            }
          }
        } else {
          if(c.objectType === 'tank' || c.objectType === 'polygon') {
            dimension.bounceGate(b, c, 30)
          } else { c.remove() }
        }
      } else if(b.gateType === 3) {
        if(!open) {
          if([
            c.xv > 0,
            c.yv > 0,
            c.xv < 0,
            c.yv < 0
          ][b.d]) {
            b.object[5] = true
            b.object[6] = 15

            if(b.d === 0 || b.d === 2) {
              c.xv = (b.d === 2 ? -100 : 100) * dimension.per50
            } else {
              c.yv = (b.d === 3 ? -100 : 100) * dimension.per50
            }
          } else {
            if(b.d === 0 || b.d === 2) {
              if(b.d === 2) {
                c.xv = -30 * dimension.per50
                c.x = b.left - c.size - 1
              } else {
                c.xv = 30 * dimension.per50
                c.x = b.right + c.size + 1
              }
            } else {
              if(b.d === 3) {
                c.yv = -30 * dimension.per50
                c.y = b.bottom - c.size - 1
              } else {
                c.yv = 30 * dimension.per50
                c.y = b.top + c.size + 1
              }
            }
          }
        }
      }
    },
    polygonDamage: 3,
    bulletDamage: 1,
    checkAngle: function(d, range, x, y) {
      return dimension.validateAngle(Math.atan2(-x, y), d, range)
    },
    validateAngle: function(angle, d, range) {
      if(range <= 0) { return false }
      if((d <= 0 || d >= 0) && range > 0) {
        return Math.abs(((angle - d + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI) <= range
      }
      return true
    },
    clampAngle: function(angle, d, range) {
      if((d <= 0 || d >= 0) && range > 0) {
        let r = ((angle - d + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI
        if(Math.abs(r) <= range) {
          return angle
        } else {
          if(r < 0) {
            return d - range
          } else {
            return d + range
          }
        }
      }
      return angle
    },
    collideOrder: {
      tank: 0,
      detectEnemies: 1,
      bullet: 2,
      polygon: 3,
      detectFriends: 4,
      wall: 5,
      gate: 6,
      wormhole: 7,
    },
    bulletClass: [0, 1, 2, 1, 2, 0],
    collide: function(a, b, data) {
      let order = dimension.collideOrder
      let c = a.object, d = b.object
      if(order[a.type] > order[b.type]) {
        [a, b] = [b, a];
        [c, d] = [d, c];
      }
      if(a.type === 'tank') {
        if(b.type === 'tank') {
          dimension.bounceCircles(c, d, data, 1, 0.2)
          if(!dimension.isSameTeam(c, d) && !(c.invincible || d.invincible)) {
            if(!(c.inBase || c.prevInBase)) {
              c.damage(dimension.tickMultiplier * 10 * d.bodyDamage * d.levelMultiplier * d.bodyDamageMultiplier, d, 'tanks')
            } if(!(d.inBase || d.prevInBase)) {
              d.damage(dimension.tickMultiplier * 10 * c.bodyDamage * c.levelMultiplier * c.bodyDamageMultiplier, c, 'tanks')
            }
          }
        } else if(b.type === 'detectEnemies') {
          if(!dimension.isSameTeam(b.parent, c) && !(c.invincible || c.inBase || c.prevInBase) && !(c.alpha < arrasPhysics.constants.stealthTargetAlpha) && dimension.checkAngle(b.d, b.range, c.x - b.x, c.y - b.y)) {
            b.objects.push(c)
            let distance = Math.sqrt(data.distance) - data.size
            b.distances.push(distance)
            if(distance < b.closest || b.closest === false) {
              b.closest = distance
              b.closestObject = c
            } if(distance < b.closestTankDistance || b.closestTank === false) {
              b.closestTankDistance = distance
              b.closestTank = c
            }
          }
        } else if(b.type === 'bullet') {
          if(!dimension.isSameTeam(c, d.parent) && !(c.inBase || c.prevInBase)) {
            if(c.invincible) {
              d.remove()
            } else {
              c.damage(dimension.tickMultiplier * dimension.bulletDamage * d.damageMultiplier * d.barrel.data.damage * d.parent.levelMultiplier * d.damageMultiplier * arrasPhysics.speedDamage(d), d.parent, 'tanks')
              d.damage(dimension.tickMultiplier * 10 * (c.bodyDamage >= 0 ? c.bodyDamage : 1) * c.levelMultiplier * (c.bodyDamageMultiplier >= 0 ? c.bodyDamageMultiplier : 1))
              let typeD = dimension.bulletClass[d.type]
              if(typeD === 0) {
                dimension.bounceCircles(c, d, data, 0.02, 0)
              } else if(typeD === 1) {
                dimension.bounceCircles(c, d, data, 0.5, 0)
              } else {
                dimension.bounceCircles(c, d, data, 0.02, 0)
              }
            }
          }
        } else if(b.type === 'polygon') {
          dimension.bounceCircles(c, d, data, 1, 0.2)
          if(!c.invincible && c.team !== 5) {
            if(!(c.inBase || c.prevInBase || c.ignorePolygonDamage)) {
              c.damage(dimension.tickMultiplier * dimension.polygonDamage, d, 'polygons')
            }
            d.damage(dimension.tickMultiplier * 10 * c.bodyDamage * c.levelMultiplier * c.bodyDamageMultiplier, c, 'tanks')
          }
        } else if(b.type === 'detectFriends') {
          if(dimension.isSameTeam(b.parent, c)) {
            b.objects.push(c)
            let distance = Math.sqrt(data.distance) - data.size
            b.distances.push(distance)
            if(distance < b.closest || b.closest === false) {
              b.closest = distance
              b.closestObject = c
            }
          }
        } else if(b.type === 'wall' && !c.clip) {
          if(dimension.isSameTeam(c, d)) {
            if(!b.noInvincibility) {
              c.inBase = true
            }
          } else {
            dimension.collideWall(data, c)
            if(b.object.team >= 0 && !(c.inBase || c.prevInBase || c.static || c.invincible) && c.maxHealth) {
              c.health -= dimension.tickMultiplier * c.maxHealth * 0.003
              c.regenTime = 0
            }
          }
        } else if(b.type === 'gate') {
          dimension.collideGate(data, c)
        } else if(b.type === 'wormhole') {
          if(d.type === 0) {
            if((c.level >= 60 || d.ruptured) && !((c.invincible && c.invincibleTime) || c.static)) {
              d._objects[c.id] = c
              let xv = d.x - c.x
              let yv = d.y - c.y
              let _d = xv * xv + yv * yv
              let r = 0.01 * dimension.per50 * dimension.per50 * (_d > 1 ? 1 / Math.sqrt(_d) : 1)
              c.xv += xv * r
              c.yv += yv * r
            } else {
              dimension.bounceCircles(c, d, data, 1, 0.5)
            }
          } else if(d.type === 1) {
            if((c.radiant > 0 || d.ruptured) && !((c.invincible && c.invincibleTime) || c.static)) {
              d._objects[c.id] = c
              let xv = d.x - c.x
              let yv = d.y - c.y
              let _d = xv * xv + yv * yv
              let r = 0.01 * dimension.per50 * dimension.per50 * (_d > 1 ? 1 / Math.sqrt(_d) : 1)
              c.xv += xv * r
              c.yv += yv * r
            } else {
              dimension.bounceCircles(c, d, data, 1, 0.5)
            }
          } else {
            d._objects[c.id] = c
          }
        }
      } else if(a.type === 'detectEnemies') {
        if(b.type === 'polygon') {
          if(a.parent.team !== 5 && dimension.checkAngle(a.d, a.range, d.x - a.x, d.y - a.y)) {
            a.objects.push(d)
            let distance = Math.sqrt(data.distance) - data.size
            a.distances.push(distance)
            if(distance < a.closest || a.closest === false) {
              a.closest = distance
              a.closestObject = d
            }
          }
        } else if(b.type === 'bullet') {
          if(!dimension.isSameTeam(a.parent, d.parent)) {
            if(a.bullets) {
              a.objects.push(d)
            }
            let distance = Math.sqrt(data.distance) - data.size
            if(a.bullets) {
              a.distances.push(distance)
            }
            if(distance < a.closestBulletDistance || a.closestBullet === false) {
              a.closestBulletDistance = distance
              a.closestBullet = d
            }
          }
        }
      } else if(a.type === 'bullet') {
        if(b.type === 'bullet') {
          if(dimension.isSameTeam(c.parent, d.parent)) {
            let typeC = dimension.bulletClass[c.type]
            let typeD = dimension.bulletClass[d.type]
            if(typeC === typeD) {
              if(typeC === 0) {
              } else if(typeC === 1) {
                dimension.bounceCircles(c, d, data, 0.5, 0.4)
              } else {
                dimension.bounceCircles(c, d, data, 1, 0.4)
              }
            }
          } else if(c.health >= 0 && d.health >= 0) {
            dimension.bounceCircles(c, d, data, 0.5, 0.1)
            let m = 3
            let damageC = dimension.tickMultiplier * dimension.bulletDamage * d.barrel.data.damage * d.parent.levelMultiplier * m * d.damageMultiplier * arrasPhysics.speedDamage(d)
            let damageD = dimension.tickMultiplier * dimension.bulletDamage * c.barrel.data.damage * c.parent.levelMultiplier * m * c.damageMultiplier * arrasPhysics.speedDamage(c)
            let oC = damageC > c.health
            let oD = damageD > d.health
            if(oC || oD) {
              let sC = c.health / damageC
              let sD = d.health / damageD
              let s = sC < sD ? sC : sD
              damageC *= s
              damageD *= s
            }
            c.damage(damageC)
            d.damage(damageD)
          }
        } else if(b.type === 'polygon') {
          let typeC = [0, 1, 2, 1, 2, 0][c.type]
          if(typeC === 0) {
            dimension.bounceCircles(c, d, data, 0.02, 0)
          } else if(typeC === 1) {
            dimension.bounceCircles(c, d, data, 0.2, 0)
          } else {
            dimension.bounceCircles(c, d, data, 0.5, 0.15)
          }
          if(c.parent.team !== 5) {
            let hit = dimension.tickMultiplier * dimension.bulletDamage * c.damageMultiplier * c.barrel.data.damage * c.parent.levelMultiplier * c.damageMultiplier * arrasPhysics.speedDamage(c)
            if(c.barrel.data.arras && c.barrel.data.arras.family !== 'trap' && c.health > 0 && hit > 0) {
              let wear = dimension.tickMultiplier * dimension.polygonDamage
              let ticks = Math.min(c.health / wear, d.health / hit)
              d.damage(hit * ticks, c.parent, 'tanks')
              c.damage(wear * ticks)
            } else {
              c.damage(dimension.tickMultiplier * dimension.polygonDamage)
              d.damage(hit, c.parent, 'tanks')
            }
          }
        } else if(b.type === 'wall') {
          if(!dimension.isSameTeam(c.parent, d) && !b.noInvincibility) {
            dimension.collideWall(data, c)
            if(b.object.team >= 0 && !(c.inBase || c.prevInBase || c.static || c.invincible)) {
              c.damage(dimension.tickMultiplier * c.maxHealth * 0.003)
              c.regenTime = 0
            }
          }
        } else if(b.type === 'gate') {
          dimension.collideGate(data, c)
        } else if(b.type === 'wormhole') {
          if(d.type === 2) {
            dimension.bounceCircles(c, d, data, 1, 0.5)
          }
        }
      } else if(a.type === 'polygon') {
        if(b.type === 'polygon') {
          dimension.bounceCircles(c, d, data, 1, 0.2)
        } else if(b.type === 'wall') {
		if(b.object.team !== 5) {
          dimension.collideWall(data, c)
          if(b.object.team >= 0) {
            c.health -= dimension.tickMultiplier * c.maxHealth * 0.003
            c.regenTime = 0
          }
		}
        } else if(b.type === 'gate') {
          if(d[8] && d[8].noPolygonCollide) { return }
          dimension.collideGate(data, c)
        } else if(b.type === 'wormhole') {
          dimension.bounceCircles(c, d, data, 1, 0.5)
        }
      } else if(a.type === 'detectFriends') {
      }
    },
    getRadiantName: function(radiant) {
      if(radiant < 1) {
        return ''
      } else if(radiant < 5) {
        return ['Radiant', 'Gleaming', 'Luminous', 'Lustrous'][radiant - 1]
      } else {
        return `Highly Radiant (${radiant})`
      }
    },
    getPolygonName: function(sides) {
      if(sides < 0) {
        return [
          'Tetrahedron',
          'Cube',
          'Octahedron',
          'Dodecahedron',
          'Icosahedron'
        ][-sides - 1]
      }
      if(sides < 3) {
        return "???"
      }
      if (sides < 21) {
        return [
          "Triangle",
          "Square",
          "Pentagon",
          "Hexagon",
          "Heptagon",
          "Octagon",
          "Nonagon",
          "Decagon",
          "Hendecagon",
          "Dodecagon",
          "Tridecagon",
          "Tetradecagon",
          "Pentadecagon",
          "Hexadecagon",
          "Heptadecagon",
          "Octadecagon",
          "Nonadecagon",
          "Icosagon",
        ][sides - 3];
      } else {
        return `Circle (${sides})`
      }
    },
    getFullPolygonName: function(polygon, noprefix) {
      let name = dimension.getPolygonName(polygon.sides)
      let prefix = ''
      if(!noprefix) {
        if(polygon.radiant < 1) {
          prefix = ('AEIOU'.indexOf(name[0]) < 0 ? 'a ' : 'an ')
        } else {
          prefix = `a ${dimension.getRadiantName(polygon.radiant)} `
        }
      } else {
        if(polygon.radiant >= 1) {
          prefix = `${dimension.getRadiantName(polygon.radiant)} `
        }
      }
      return prefix + name
    },
    updateTurret: function(turret, tank, parent) {
      if(turret.position = 'weaponTurret') {
        turret.active = parent.passive ? false : true
      } else if(turret.position = 'turret') {
        turret.active = parent.passive ? false : true
      }
      if(turret.rotationType === 1) {
        turret.d += turret.rotationSpeed * dimension.per50
        turret.d = turret.d % (2 * Math.PI)
      } else if(!turret.rotationType) {
        let item = turret.detector.closestTank || turret.detector.closestObject
        let followMouse = false
        if(parent.physics === 'arras' && parent.firing && parent.mousePosition) {
          let d = Math.atan2(turret.gameX - parent.mousePosition[0], parent.mousePosition[1] - turret.gameY) - tank.d
          if(dimension.validateAngle(d, turret.angle, turret.angleRange)) {
            turret.d = tank.d + d
            followMouse = true
          }
        }
        turret.followingMouse = followMouse
        turret.aimPoint = followMouse ? parent.mousePosition : (item ? [item.x, item.y] : null)
        if(followMouse) {
          turret.active = !parent.passive
        } else if(item) {
          let d = dimension.aimAtTarget({
            x: turret.gameX,
            y: turret.gameY
          }, item, turret.barrels[0] ? dimension.getBulletSpeed(turret.barrels[0].data, parent) : 0)
          turret.d = tank.d + dimension.clampAngle(Math.atan2(-d[0], d[1]) - tank.d, turret.angle, turret.angleRange)
        } else {
          turret.active = false
          let ud = true
          if(parent.firing) {
            let dx = turret.gameX - parent.mousePosition[0]
            let dy = parent.mousePosition[1] - turret.gameY
            let d = Math.atan2(dx, dy) - tank.d
            if(dimension.validateAngle(d, turret.angle, turret.angleRange)) {
              turret.d = tank.d + d
              ud = false
            }
          } if(ud) {
            if(turret.angle >= 0 || turret.angle <= 0) {
              let d = (turret.angle + tank.d) % (2 * Math.PI)
              turret.d = dimension.averageAngles(turret.d, d, dimension.smooth(2))
            } else {
              turret.d += dimension.tickMultiplier * 0.01
              if(turret.d >= 2 * Math.PI) {
                turret.d -= 2 * Math.PI
              }
            }
          }
        }
      }
    },
