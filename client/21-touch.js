    const touch = {
      leftId: false,
      leftPos: [0, 0],
      leftDelta: [0, 0],
      rightId: false,
      rightPos: [0, 0],
      rightDelta: [0, 0],
      start: function(e) {
        if(e.clientX < window.innerWidth * 0.5) {
          if(touch.leftId === false) {
            touch.leftId = e.identifier
            touch.leftPos = [render.scale * e.clientX, render.scale * e.clientY]
            joystickLeft.style.left = `${touch.leftPos[0]}px`
            joystickLeft.style.top = `${touch.leftPos[1]}px`
            joystickLeftInner.style.transform = `translate(10px, 10px)`
            joystickLeft.style.visibility = 'visible'
          }
        } else {
          if(touch.rightId === false) {
            util.mouse.down = true
            touch.rightId = e.identifier
            touch.rightPos = [render.scale * e.clientX, render.scale * e.clientY]
            joystickRight.style.left = `${touch.rightPos[0]}px`
            joystickRight.style.top = `${touch.rightPos[1]}px`
            joystickRightInner.style.transform = `translate(10px, 10px)`
            joystickRight.style.visibility = 'visible'
          }
        }
      },
      move: function(e) {
        if(e.identifier === touch.leftId) {
          let touchX = render.scale * e.clientX
          let touchY = render.scale * e.clientY
          touch.leftDelta = [touchX - touch.leftPos[0], touchY - touch.leftPos[1]]
          let delta = [touch.leftDelta[0], touch.leftDelta[1]]
          let distance = Math.sqrt(touch.leftDelta[0] * touch.leftDelta[0] + touch.leftDelta[1] * touch.leftDelta[1])
          if(distance > 80) {
            let r = 80 / distance
            delta[0] *= r
            delta[1] *= r
          }
          joystickLeftInner.style.transform = `translate(${delta[0] + 10}px, ${delta[1] + 10}px)`
          gameSend(gameCurrentServer.ws, ['direction', (Math.round(Math.atan2(delta[1], delta[0]) * 100 / Math.PI) % 200 + 200) % 200])
        } else if(e.identifier === touch.rightId) {
          let touchX = render.scale * e.clientX
          let touchY = render.scale * e.clientY
          touch.rightDelta = [touchX - touch.rightPos[0], touchY - touch.rightPos[1]]
          let delta = [touch.rightDelta[0], touch.rightDelta[1]]
          let distance = Math.sqrt(touch.rightDelta[0] * touch.rightDelta[0] + touch.rightDelta[1] * touch.rightDelta[1])
          if(distance > 50) {
            let r = 50 / distance
            delta[0] *= r
            delta[1] *= r
          }
          cpo.o = true
          cpo.x = delta[0] * 0.02
          cpo.y = delta[1] * 0.02
          joystickRightInner.style.transform = `translate(${delta[0] + 10}px, ${delta[1] + 10}px)`
          util.mouse.d = Math.atan2(-delta[0], delta[1])
        }
      },
      end: function(e) {
        if(e.identifier === touch.leftId) {
          touch.leftId = false
          joystickLeft.style.visibility = 'hidden'
          gameSend(gameCurrentServer.ws, ['direction', false])
        } else if(e.identifier === touch.rightId) {
          util.mouse.down = false
          touch.rightId = false
          joystickRight.style.visibility = 'hidden'
        }
      }
    }
    document.addEventListener('touchstart', function(e) {
      for(let i=e.changedTouches.length-1;i>=0;i--) {
        touch.start(e.changedTouches[i])
      }
    })
    document.addEventListener('touchmove', function(e) {
      for(let i=e.changedTouches.length-1;i>=0;i--) {
        touch.move(e.changedTouches[i])
      }
      e.preventDefault()
    }, {
      passive: false
    })
    document.addEventListener('touchend', function(e) {
      for(let i=e.changedTouches.length-1;i>=0;i--) {
        touch.end(e.changedTouches[i])
      }
    })

    function pretty() {
      let tankData = window.tankData2
      let str = 'let weaponUpgradeMap = {\n'
      let weaponUpgrades = Object.keys(tankData.weaponUpgradeMap).sort()
      for(let w in weaponUpgrades) {
        let weapon = weaponUpgrades[w]
        str += `  '${weapon}': ${JSON.stringify({
          level: tankData.weaponUpgradeMap[weapon].level,
          upgrades: tankData.weaponUpgradeMap[weapon].upgrades.sort()
        })},\n`
      }
      str += '}\nlet bodyUpgradeMap = {\n'
      let bodyUpgrades = Object.keys(tankData.bodyUpgradeMap).sort()
      for(let b in bodyUpgrades) {
        let body = bodyUpgrades[b]
        str += `  '${body}': ${JSON.stringify({
          level: tankData.bodyUpgradeMap[body].level,
          upgrades: tankData.bodyUpgradeMap[body].upgrades.sort()
        })},\n`
      }
      str += '}\nlet weapons = {\n'
      let convert = function(turrets) {
        if(turrets && turrets.length > 0) {
          for(let i=0,l=turrets.length;i<l;i++) {
            let t = turrets[i]
            if(t.barrels) {
              t.sectionWeapon = {
                barrels: t.barrels,
                weaponTurrets: []
              }
              delete t.barrels
            }
          }
        }
      }
      let weapons = Object.keys(tankData.weapons).sort()
      for(let w in weapons) {
        let weapon = weapons[w]
        let _ = JSON.parse(JSON.stringify(tankData.weapons[weapon]))
        if(_.weaponTurrets) {
          convert(_.weaponTurrets)
        }
        for(let i=_.barrels.length-1;i>=0;i--) {
          let b = _.barrels[i]
          if(b.bulletWeapon) {
            convert(b.bulletWeapon.weaponTurrets)
          } if(b.bulletBody) {
            convert(b.bulletBody.turrets)
          }
        }
        str += `  '${weapon}': ${JSON.stringify(_)},\n`
      }
      str += '}\nlet bodies = {\n'
      let bodies = Object.keys(tankData.bodies).sort()
      for(let b in bodies) {
        let body = bodies[b]
        let _ = JSON.parse(JSON.stringify(tankData.bodies[body]))
        if(_.turrets) {
          convert(_.turrets)
        }
        str += `  '${body}': ${JSON.stringify(_)},\n`
      }
      str += '}\nwindow.tankData = { weapons, bodies, weaponUpgradeMap, bodyUpgradeMap }'
      console.log(str)
    }
    window.pretty = pretty
