  const arrasPhysics = {
    constants: {
      lengthScale: 2.5,
      osaTickRate: 30,
      runSpeed: 1.5,
      glideDamp: 0.05,
      stealthStillSpeed: 0.316,
      stealthTargetAlpha: 0.5,
      droneOrbit: 30,
      droneOrbitNear: 0.8,
      droneOrbitFar: 1.5,
      droneIdlePower: 0.15,
      droneIdleWander: 30,
      droneIdleTimerRate: 0.3,
      droneSpeedFactor: 0.055,
      droneFacingSmooth: 4,
      snakeScaleMin: 45,
      snakeScaleMax: 75,
      snakePullMax: 0.1,
      snakePullGain: 0.01,
      familyBodySpeed: { bullet: 3.75, swarm: 4.5, trap: 0, boomerang: 3.75 },
      familyRange: { bullet: 90, swarm: 225, trap: 450, boomerang: 120 },
      lifetimeScale: { bullet: 0.719, swarm: 0.719, trap: 1, boomerang: 1 },
      projectileSpeedScale: { bullet: 0.533, swarm: 0.533, trap: 1, boomerang: 0.533, drone: 1 },
      homingTurn: 0.12,
      boomerangTurn: 0.16,
      boomerangTurnAt: 0.5,
      boomerangReach: 3,
      boomerangRecovery: 0.05,
      targetReachLimit: 1.6,
      movementScale: 0.833,
      damageScale: { bullet: 1.143, swarm: 1.143, drone: 1.4, minion: 1.4, trap: 0.816, boomerang: 0.816 },
      penetrationScale: { bullet: 0.6, swarm: 0.6, drone: 0.6, minion: 0.6, trap: 1, boomerang: 1 },
      speedDamageCap: 2,
      speedSkillBase: 1.5,
      speedSkillGain: 1.5,
      originalSpeedSkillBase: 0.5,
      originalSpeedSkillGain: 1.5,
      mobilitySkillGain: 0.8,
      skillMax: 15,
      maxSizeReduction: 2,
      fallbackAcceleration: 1.6,
      fallbackSpeedFactor: 5.25,
      recoilGain: 1.08,
      springStiffness: 0.25,
      springDamping: 0.75,
      springRest: 0.001
    },
    tickFactor: function() {
      return arrasPhysics.constants.osaTickRate / dimension.tickRate
    },
    speedSkill: function(tank) {
      let c = arrasPhysics.constants
      return c.speedSkillBase + c.speedSkillGain * tank.upgrades[1] / c.skillMax
    },
    originalSpeedSkill: function(tank) {
      let c = arrasPhysics.constants
      return c.originalSpeedSkillBase + c.originalSpeedSkillGain * tank.upgrades[1] / c.skillMax
    },
    mobilitySkill: function(tank) {
      let c = arrasPhysics.constants
      return 1 + c.mobilitySkillGain * tank.upgrades[4] / c.skillMax
    },
    appliesToBullet: function(data, tank) {
      let arras = data.arras
      return tank.physics === 'arras' && arras && arras.family in arrasPhysics.constants.familyBodySpeed
    },
    move: function(tank) {
      let c = arrasPhysics.constants
      let f = arrasPhysics.tickFactor()
      let body = tank.bodyData.arras || { speed: c.fallbackSpeedFactor * tank.movementSpeed, accel: c.fallbackAcceleration }
      let reduce = Math.min(c.maxSizeReduction, tank.size / (30 * (tank.bodyData.size || 1)))
      let mobility = arrasPhysics.mobilitySkill(tank)
      let top = c.runSpeed * body.speed * mobility / reduce * c.lengthScale * c.movementScale * f * tank.speed
      let k = body.accel / (body.speed * mobility)
      let decay = Math.pow(1 + k, -f)
      let gain = top * (1 - decay)
      tank.xv = tank.xv * decay + tank.input.movement[0] * gain
      tank.yv = tank.yv * decay + tank.input.movement[1] * gain
    },
    recoil: function(tank, barrel, sin, cos, body) {
      let c = arrasPhysics.constants
      body = body || tank
      let r = barrel.data.arras.recoil
      let spring = barrel.recoilSpring = barrel.recoilSpring || { motion: 0, position: 0, clock: 1 }
      spring.motion += 3 * Math.log(Math.sqrt(arrasPhysics.speedSkill(tank)) + r + 1) + 1
      spring.sin = sin
      spring.cos = cos
      let bodyFamily = body !== tank && body.barrel && body.barrel.data.arras ? body.barrel.data.arras.family : null
      let bodyScale = bodyFamily ? c.projectileSpeedScale[bodyFamily] || 1 : 1
      spring.strength = r * c.recoilGain * c.lengthScale * c.lengthScale * arrasPhysics.tickFactor() * bodyScale / body.size
      body.recoilSprings = body.recoilSprings || []
      if(body.recoilSprings.indexOf(spring) < 0) { body.recoilSprings.push(spring) }
    },
    stepSpring: function(spring) {
      let c = arrasPhysics.constants
      spring.motion -= c.springStiffness * spring.position
      spring.position += spring.motion
      if(spring.position < 0) {
        spring.position = 0
        spring.motion = -spring.motion
      }
      if(spring.motion > 0) { spring.motion *= c.springDamping }
    },
    applyRecoil: function(body) {
      let springs = body.recoilSprings
      if(!springs || !springs.length) { return }
      let c = arrasPhysics.constants
      let f = arrasPhysics.tickFactor()
      for(let i = springs.length - 1; i >= 0; i--) {
        let spring = springs[i]
        spring.clock += f
        while(spring.clock >= 1) {
          spring.clock -= 1
          arrasPhysics.stepSpring(spring)
        }
        if(spring.motion > 0) {
          let push = spring.position * spring.strength * f
          body.xv += push * spring.sin
          body.yv -= push * spring.cos
        }
        if(spring.position < c.springRest && Math.abs(spring.motion) < c.springRest) {
          spring.position = spring.motion = 0
          springs.splice(i, 1)
        }
      }
    },
    bulletSpeed: function(data, tank) {
      let c = arrasPhysics.constants
      let v0 = data.arras.speed * c.runSpeed * arrasPhysics.speedSkill(tank) * c.lengthScale * c.projectileSpeedScale[data.arras.family] * arrasPhysics.tickFactor()
      return v0 / dimension.tickMultiplier
    },
    isArrasDrone: function(bullet, tank) {
      let data = bullet.barrel && bullet.barrel.data
      return bullet.type === 2 && tank.physics === 'arras' && !!data && !!data.arras && data.arras.family === 'drone'
    },
    droneIdleGoal: function(bullet, tank) {
      let c = arrasPhysics.constants
      let orbit = c.droneOrbit * c.lengthScale
      let near = orbit * c.droneOrbitNear + tank.size + bullet.size
      let far = orbit * c.droneOrbitFar + tank.size + bullet.size
      let distance = Math.hypot(bullet.x - tank.x, bullet.y - tank.y)
      if(!bullet.idleGoal || distance > far || bullet.idleTimer > c.droneIdleWander) {
        bullet.idleTimer = 0
        let angle = Math.atan2(bullet.y - tank.y, bullet.x - tank.x) + Math.PI * Math.random() * 0.5
        let length = near + (far - near) * Math.random()
        bullet.idleGoal = [tank.x + length * Math.cos(angle), tank.y + length * Math.sin(angle)]
      }
      if(distance < far) {
        bullet.idleTimer += c.droneIdleTimerRate * arrasPhysics.tickFactor()
        return c.droneIdlePower
      }
      return 1
    },
    driveDrone: function(bullet, tank) {
      let c = arrasPhysics.constants
      let accel = dimension.tickMultiplier * dimension.tickMultiplier * bullet.speed * c.droneSpeedFactor * tank.sBulletSpeed
      let goal, face = null, power = 1, repel = false
      bullet.target = false
      if(tank.droneControl) {
        goal = tank.mousePosition
        repel = true
      } else if(tank.firing) {
        goal = face = tank.mousePosition
      } else if(!tank.passive && tank.detector && tank.detector.closestObject) {
        bullet.target = tank.detector.closestObject
        goal = face = [bullet.target.x, bullet.target.y]
      } else {
        power = arrasPhysics.droneIdleGoal(bullet, tank)
        goal = bullet.idleGoal
      }
      if(goal !== bullet.idleGoal) { bullet.idleGoal = null }
      let dx = goal[0] - bullet.x, dy = goal[1] - bullet.y
      let distance = Math.hypot(dx, dy)
      if(repel && distance > 0) {
        bullet.xv -= accel * dx / distance
        bullet.yv -= accel * dy / distance
      } else if(!repel && distance > bullet.size * 2) {
        bullet.xv += accel * power * dx / distance
        bullet.yv += accel * power * dy / distance
      } else if(!repel) {
        bullet.xv = 0
        bullet.yv = 0
      }
      let fx = face ? face[0] - bullet.x : bullet.xv
      let fy = face ? face[1] - bullet.y : bullet.yv
      if(fx !== 0 || fy !== 0) {
        bullet.d = dimension.averageAngles(bullet.d, Math.atan2(-fx, fy), dimension.smooth(c.droneFacingSmooth))
      }
    },
    updateStealth: function(tank) {
      let rates = tank.bodyData && tank.bodyData.stealth
      if(!rates) {
        tank.alpha = 1
        tank.hitThisTick = false
        return
      }
      let c = arrasPhysics.constants
      let f = arrasPhysics.tickFactor()
      let still = Math.hypot(tank.xv, tank.yv) <= c.stealthStillSpeed * c.lengthScale * f
      let alpha = tank.alpha >= 0 ? tank.alpha : 1
      if(still && !tank.hitThisTick) {
        alpha -= rates[1] * f
      } else {
        alpha += rates[0] * f
      }
      tank.alpha = alpha < 0 ? 0 : (alpha > 1 ? 1 : alpha)
      tank.hitThisTick = false
    },
    speedDamage: function(bullet) {
      if(!(bullet.arrasTop > 0)) { return 1 }
      let factor = Math.pow(Math.hypot(bullet.xv, bullet.yv) / bullet.arrasTop, 0.25)
      return Math.min(arrasPhysics.constants.speedDamageCap, Math.max(factor, 1) * factor)
    },
    scaleBullet: function(bullet) {
      let c = arrasPhysics.constants
      let family = bullet.barrel.data.arras.family
      bullet.damageMultiplier *= c.damageScale[family] || 1
      bullet.maxHealth *= c.penetrationScale[family] || 1
      bullet.health = bullet.maxHealth
    },
    initBullet: function(bullet, data, tank, turret) {
      let c = arrasPhysics.constants
      let family = data.arras.family
      let spd = arrasPhysics.speedSkill(tank)
      bullet.arrasTop = c.runSpeed * c.familyBodySpeed[family] * data.arras.maxSpeed * spd * c.lengthScale * c.projectileSpeedScale[family] * arrasPhysics.tickFactor()
      let bodyRange = data.arras.bodyRange || c.familyRange[family]
      let spawner = !!data.bulletWeapon
      let skillRange = data.arras.fixedRange ? 1 : Math.sqrt(spawner ? arrasPhysics.originalSpeedSkill(tank) : spd)
      let rangeScale = spawner ? 1 : c.lifetimeScale[family]
      bullet.lifeTime = bodyRange * data.arras.range / skillRange / c.osaTickRate * rangeScale
      if(data.arras.snake) { arrasPhysics.startSnake(bullet, data.arras.snake, tank) }
      if(data.arras.homing) { bullet.arrasHoming = true }
      if(data.arras.autoTarget) { bullet.arrasAutoTarget = true }
      if(data.arras.spin) { bullet.arrasSpin = data.arras.spin }
      if(data.arras.turnWithSpeed) { bullet.arrasTurn = data.arras.turnWithSpeed }
      if(data.arras.boomerang) {
        bullet.arrasBoomerang = true
        bullet.arrasTop = Math.hypot(bullet.xv, bullet.yv)
        let aim = tank.mousePosition
        bullet.boomerangGoal = [tank.x + c.boomerangReach * (aim[0] - tank.x), tank.y + c.boomerangReach * (aim[1] - tank.y)]
      }
      if(data.arras.goToTarget) {
        let point = turret ? turret.aimPoint : tank.mousePosition
        if(data.arras.reverseTarget && point) { point = [2 * tank.x - point[0], 2 * tank.y - point[1]] }
        arrasPhysics.aimAtTarget(bullet, point)
      }
    },
    aimAtTarget: function(bullet, point) {
      let speed = Math.hypot(bullet.xv, bullet.yv)
      if(!(speed > 0) || !point) { return }
      let c = arrasPhysics.constants
      let decay = Math.pow(1 + c.glideDamp, -arrasPhysics.tickFactor())
      let naturalReach = speed / (1 - decay)
      let dx = point[0] - bullet.x
      let dy = point[1] - bullet.y
      let distance = Math.hypot(dx, dy)
      if(!(distance > 0)) {
        bullet.xv = bullet.yv = 0
        return
      }
      let reach = Math.min(distance, naturalReach * c.targetReachLimit)
      let launch = reach * (1 - decay) / distance
      bullet.xv = dx * launch
      bullet.yv = dy * launch
    },
    steer: function(bullet, targetX, targetY, turn) {
      let speed = Math.hypot(bullet.xv, bullet.yv)
      if(!(speed > 0)) { return }
      let heading = Math.atan2(bullet.yv, bullet.xv)
      let diff = Math.atan2(targetY - bullet.y, targetX - bullet.x) - heading
      diff = Math.atan2(Math.sin(diff), Math.cos(diff))
      let limit = turn * arrasPhysics.tickFactor()
      heading += Math.max(-limit, Math.min(limit, diff))
      bullet.xv = Math.cos(heading) * speed
      bullet.yv = Math.sin(heading) * speed
      bullet.d = Math.atan2(-bullet.xv, bullet.yv)
    },
    home: function(bullet) {
      let owner = bullet.parent
      let target = false
      if(owner.firing && owner.mousePosition && !bullet.arrasAutoTarget) {
        target = owner.mousePosition
      } else if(!owner.passive && owner.detector && owner.detector.closestObject) {
        target = [owner.detector.closestObject.x, owner.detector.closestObject.y]
      }
      if(target) {
        arrasPhysics.steer(bullet, target[0], target[1], arrasPhysics.constants.homingTurn)
      }
    },
    keepSpeed: function(bullet) {
      let speed = Math.hypot(bullet.xv, bullet.yv)
      if(speed > 0 && speed < bullet.arrasTop) {
        let scale = Math.min(bullet.arrasTop, speed + bullet.arrasTop * arrasPhysics.constants.boomerangRecovery * arrasPhysics.tickFactor()) / speed
        bullet.xv *= scale
        bullet.yv *= scale
      }
    },
    returnToOwner: function(bullet) {
      let c = arrasPhysics.constants
      if(bullet.timeExisted < bullet.lifeTime * c.boomerangTurnAt) {
        arrasPhysics.steer(bullet, bullet.boomerangGoal[0], bullet.boomerangGoal[1], c.boomerangTurn)
        return
      }
      let owner = bullet.parent
      arrasPhysics.steer(bullet, owner.x, owner.y, c.boomerangTurn)
      if(Math.hypot(owner.x - bullet.x, owner.y - bullet.y) < owner.size + bullet.size) {
        bullet.remove()
      }
    },
    startSnake: function(bullet, settings, tank) {
      let c = arrasPhysics.constants
      let d = bullet.d + settings.angle * Math.PI / 180
      let reach = Math.hypot(tank.mousePosition[0] - tank.x, tank.mousePosition[1] - tank.y) / Math.PI
      bullet.arrasSnake = {
        x: bullet.x,
        y: bullet.y,
        forwardX: -Math.sin(d),
        forwardY: Math.cos(d),
        sideX: -Math.cos(d),
        sideY: -Math.sin(d),
        scale: Math.min(c.snakeScaleMax * c.lengthScale, Math.max(c.snakeScaleMin * c.lengthScale, reach)),
        period: settings.period,
        amplitude: settings.amplitude * c.lengthScale * settings.invert * (tank.droneControl ? -1 : 1),
        offset: settings.yOffset * c.lengthScale,
        pull: 0
      }
    },
    snake: function(bullet) {
      let c = arrasPhysics.constants
      let wave = bullet.arrasSnake
      let ticks = bullet.timeExisted * c.osaTickRate
      let along = wave.scale * ticks / wave.period
      let across = wave.amplitude * Math.sin(along / wave.scale) + wave.offset
      let goalX = wave.x + wave.forwardX * along + wave.sideX * across
      let goalY = wave.y + wave.forwardY * along + wave.sideY * across
      wave.pull = Math.min(c.snakePullMax, wave.pull + c.snakePullGain / c.runSpeed * arrasPhysics.tickFactor())
      let step = 1 - Math.pow(1 - wave.pull, arrasPhysics.tickFactor())
      bullet.xv = (goalX - bullet.x) * step
      bullet.yv = (goalY - bullet.y) * step
    },
    update: function(bullet) {
      arrasPhysics.applyRecoil(bullet)
      if(bullet.arrasSnake) {
        arrasPhysics.snake(bullet)
      } else if(bullet.arrasHoming) {
        arrasPhysics.home(bullet)
      } else if(bullet.arrasBoomerang) {
        arrasPhysics.keepSpeed(bullet)
        arrasPhysics.returnToOwner(bullet)
      }
      if(bullet.arrasSpin) {
        bullet.d += bullet.arrasSpin * arrasPhysics.tickFactor()
      }
      if(bullet.arrasTurn) {
        bullet.d += bullet.arrasTurn * Math.hypot(bullet.xv, bullet.yv) / arrasPhysics.constants.lengthScale / 90 * Math.PI
      }
    },
    glide: function(bullet) {
      if(bullet.arrasSnake) { return }
      let v = Math.hypot(bullet.xv, bullet.yv)
      let excess = v - bullet.arrasTop
      if(excess > 0) {
        let scale = (bullet.arrasTop + excess * Math.pow(1 + arrasPhysics.constants.glideDamp, -arrasPhysics.tickFactor())) / v
        bullet.xv *= scale
        bullet.yv *= scale
      }
    }
  }
