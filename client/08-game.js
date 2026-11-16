    const game = {
      toggleDebug: function() {
        game.debug = ((game.debug || 0) + 1) % 4
        if(!game.debug) {
          game.debugTime = performance.now()
        }
        debugSlide.style.left = (game.debug ? 0 : "-500px")
        debugSlide.style.opacity = (game.debug ? 1 : 0)
        render.addAnnouncement(`Debug Mode (M): ${['OFF', 'IDs', 'IDs + Names', 'IDs + Names + Health'][game.debug]}`, 3000)
      },
      sizeScale: 1.01,
      login: (function() {
        try {
          let c = JSON.parse(atob((localStorage.login || sessionStorage.login).replaceAll('_', '=')))
          if(c && c.length === 2) {
            setTimeout(function() {
              if(window.setAccountUI) { window.setAccountUI(c[0]) }
            })
            return c
          }
        } catch(e) {
          return false
        }
        return false
      })(),
      lastSendPing: 0,
      packetSizes: [],
      getDist: function(a, b, c, d) {
        return (a = (a - c)) * a + (b = (b - d)) * b
      },
      counter: function (list, now) {
        let i = 0,
            l = list.length;
        while (i < l) {
          let entry = list[i];
          if (entry[0] < now) {
            i++;
          } else {
            if (i > 0) {
              list.splice(0, i);
            }
            return;
          }
        }
        list.splice(0, l);
      },
      debug: 0,
      debugTime: 0,
      splash: {
        me: false,
        tanks: [],
        bullets: [],
        polygons: [],
        wormholes: {},
        bases: [],
        walls: [],
        gates: [],
        grid: {
          size: 30,
          pattern: false,
          background: { r: 205, g: 205, b: 205 },
          lines: { r: 200, g: 200, b: 200 },
          generate: function () {
            let a = document.createElement("canvas")
            a.width = a.height = game.splash.grid.size;
            let b = a.getContext("2d");
            b.strokeStyle = render.rgb(game.splash.grid.lines);
            b.lineWidth = render.lineWidth;
            b.beginPath();
            b.moveTo(0, 0);
            b.lineTo(game.splash.grid.size, 0);
            b.lineTo(game.splash.grid.size, game.splash.grid.size);
            b.lineTo(0, game.splash.grid.size);
            b.lineTo(0, 0);
            b.stroke();
            b.closePath();
            game.splash.grid.pattern = renderCtx.gameCanvas.createPattern(a, "repeat");
          }
        },
        ambientParticles: [],
        wallType: 0,
        darkness: 0,
        current: false,
        next: function(data) {
          let t = {}
          for(let i=data.tanks.length-1;i>=0;i--) {
            let o = data.tanks[i]
            t[o.id] = o
          }
          for(let i=data.bullets.length-1;i>=0;i--) {
            let o = data.bullets[i]
            o.parent = t[o.parentId]
          }
          if(!data.me || !(data.me.id >= 0)) {
            data.me = t[data.me]
          }
          if(!data) { return }
          game.splash.current = data
          window.c = data
          game.splash.show()
        },
        show: function() {
          let l = game.splash.current
          game.splash.grid.background = l.grid.background
          game.splash.grid.lines = l.grid.lines
          game.splash.grid.size = l.grid.size
          game.splash.grid.generate()
          game.splash.ambientParticles = l.grid.ambientParticles
          game.splash.wallType = l.grid.wallType
          game.splash.darkness = l.grid.darkness || 0
          let d = Math.PI * 2 * Math.random()
          cameraRx = l.me.x - 1000 * Math.sin(d)
          cameraRy = l.me.y - 1000 * Math.cos(d)
        },
        position: {
          x: 0,
          y: 0,
          xv: 0,
          yv: 0,
          d: 2 * Math.random() * Math.PI,
          dv: Math.random() - 0.5,
          kv: 0,
        },
        update: function() {
          let l = game.splash.current, c = 1
          let p = game.splash.position
          let sin = Math.sin(p.d), cos = Math.cos(p.d)
          p.xv += sin * 0.1
          p.yv += cos * 0.1
          let d = Math.sqrt(p.xv * p.xv + p.yv * p.yv)
          if(d < 0.1) { d = 0.1 }
          p.xv /= d
          p.yv /= d
          p.x += p.xv * 1
          p.y += p.yv * 1
          if(p.kv) {
            let f = render.f > 0 ? Math.min(render.f, 4) : 1
            p.x += p.kv * f
            p.kv *= Math.pow(0.88, f)
            if(Math.abs(p.kv) < 0.5) { p.kv = 0 }
          }
          let r = p.x * p.x + p.y * p.y
          if(r > 1000000 || Math.random() * 300 < 1) {
            p.d = Math.PI + Math.atan2(p.x, p.y) + Math.random() * Math.PI
          } if(Math.random() * 100 < 1) {
            p.dv += Math.random() - 0.5
          }
          p.dv *= 0.998
          p.d = (p.d + p.dv * 0.01) % (2 * Math.PI)
          if(l) {
            try {
              let y = ['me', 'tanks', 'bullets', 'polygons', 'wormholes', 'bases', 'walls', 'gates', 'mapSize', '_mapSize']
              for(let i=y.length-1;i>=0;i--) {
                game.splash[y[i]] = l[y[i]]
              }
              cameraTargetX = (game.splash.me.x || 0) + p.x
              cameraTargetY = (game.splash.me.y || 0) + p.y
              cameraBaseSize = 0.75
              cameraSize = util.average(cameraSize, 1.25 * cameraBaseSize, 15)
              c = 0
            } catch(e) {}
          }
          if(c) {
            cameraTargetX = cameraTargetY = 0
          }
        },
      },
      override: false,
      passive: false,
      autoFire: false,
      autoSpin: false,
      autoSpinDirection: 1,
      reverse: false,
      spinLock: false,
      lastTick: performance.now(),
      respawnScore: 0,
      lerp: 0,
      l: 1,
      detecting: false,
      move: (function() {
        const o = window.console.log
        const console = {
          log: function() {
            o(...arguments)
            if(game.detecting) {
              game.detected = true
            }
          }
        }
        let p = (function() { console.log(...arguments) })
        return function(b) {
          if(b) {
            window.console.log = p
          } else {
            if(game.detected) {
              for(;;) {}
            }
            window.console.log = o
          }
        }
      })(),
      detected: false,
      groupRecoil: function(barrels) {
        for(let i=0,l=barrels.length;i<l;i++) {
          let leader = barrels[i]
          if(!leader.arras || leader.type === 10) { continue }
          let members = [leader], base = -leader.y
          for(let j=0;j<l;j++) {
            let other = barrels[j]
            if(other.type !== 10 || other.recoilLeader) { continue }
            if(Math.abs(other.d - leader.d) > 1e-6 || Math.abs(other.x - leader.x) > 1e-3) { continue }
            members.push(other)
            if(-other.y < base) { base = -other.y }
          }
          if(members.length < 2) { continue }
          for(let j=0;j<members.length;j++) {
            members[j].recoilLeader = leader
            members[j].recoilBase = base
          }
        }
      },
      updateTank: function(tank, weapon, body) {
        if(!tank) { return }
        if(!weapon) {
          weapon = tankData.weapons[tank.weapon]
          body = tankData.bodies[tank.body]
        } else {
          tank.weapon = weapon
          tank.body = body
        }
        if(!weapon) {
          weapon = tankData.weapons.node
          tank.weapon = 'node'
        } if(!body) {
          body = tankData.bodies.base
          tank.body = 'base'
        }
        const part = function(n, def) { return n && n[0] ? (n[0] === '@' ? (def && def.name) || 'Custom' : n[0].toUpperCase() + n.slice(1)) : '???' }
        let upgrade = `${part(tank.weapon, tankData.weapons[tank.weapon])}-${part(tank.body, tankData.bodies[tank.body])}`
        if(tank.radiant > 0) {
          tank.className = render.getRadiantName(tank.radiant) + ' ' + upgrade
        } else {
          tank.className = upgrade
        }
        tank.hide = body.hide ? true : false
        if(body.outerSides >= 0 && body.outerSize >= 0) {
          tank.outerSides = body.outerSides
          tank.outerSize = body.outerSize
        } else {
          delete tank.outerSides
          delete tank.outerSize
        }
        let b = tankData.bodies[tank.body]
        let isCele = b && b.celestial
        tank._size = 30 * Math.pow(game.sizeScale, (tank.level - (isCele ? 0 : 1))) * (isCele ? 1.5 : 1) * (b && b.size ? b.size : 1)
        if(tank._size > 1000) { tank._size = 1000 }
        if(tank.size === 0) {
          tank.size = tank._size
        }
        tank.sides = body.sides || 0
        tank.star = body.star || 0
        tank.barrels = []
        tank.weaponTurrets = []
        tank.auras = []
        tank.turrets = []
        tank._turrets = []
        tank._barrels = []
        tank.visualElements = body.visualElements || []
        tank.weaponVisualElements = weapon.weaponVisualElements || []
        let id = 0
        let _id = 0
        let checkBarrel = function(barrel, parent) {
          if(parent) {
            tank._barrels.push({
              barrel: barrel,
              id: id,
              parent: parent
            })
          } else {
            tank._barrels.push({
              barrel: barrel,
              id: id
            })
          }
          let size = barrel.relativeSize
          barrel.id = id
          id ++
          if(barrel.type === 3 || barrel.type === 4 || barrel.bulletWeapon) {
            let weapon = barrel.bulletWeapon
            if(weapon) {
              for(let i=0,l=weapon.barrels.length;i<l;i++) {
                let barrel = { ...weapon.barrels[i] }
                barrel.relativeSize = barrel.width * size * ('size' in barrel ? barrel.size || 1 : 1)
                checkBarrel(barrel)
              }
            }
            let body = barrel.bulletBody
            if(body) {
              for(let i=0,l=body.turrets.length;i<l;i++) {
                let source = body.turrets[i]
                let turret = { ...source }
                let barrels = source.sectionWeapon ? source.sectionWeapon.barrels : source.barrels || []
                for(let u=0,k=barrels.length;u<k;u++) {
                  let barrel = { ...barrels[u] }
                  barrel.relativeSize = barrel.width * size * turret.size * 0.5 * ('size' in barrel ? barrel.size || 1 : 1)
                  checkBarrel(barrel, turret)
                }
              }
            }
          }
        }
        for(let i=0,l=weapon.barrels.length;i<l;i++) {
          let barrel = { ...weapon.barrels[i] }
          barrel.relativeSize = barrel.width * ('size' in barrel ? barrel.size || 1 : 1)
          tank.barrels.push(barrel)
          checkBarrel(barrel)
        }
        game.groupRecoil(tank.barrels)
        let checkTurret = function(source, rsize, a) {
          if(!(a > 0)) { a = 1 }
          let turret = { ...source }
          rsize = turret.relativeSize = rsize * turret.size

          tank._turrets.push({
            turret: turret
          })
          turret.id = _id
          _id ++
          let weapon = turret.sectionWeapon
          if(weapon) {
            let w = weapon
            turret.sectionWeapon = { ...w }
            turret.sectionWeapon.barrels = []
            turret.sectionWeapon.weaponTurrets = []
            if(w.barrels) {
              for(let u=0,k=w.barrels.length;u<k;u++) {
                let barrel = { ...w.barrels[u] }
                barrel.relativeSize = barrel.width * rsize * a * ('size' in barrel ? barrel.size || 1 : 1)
                checkBarrel(barrel, turret)
                turret.sectionWeapon.barrels.push(barrel)
              }
            }
            if(w.weaponTurrets) {
              for(let i=0,l=w.weaponTurrets.length;i<l;i++) {
                let source = w.weaponTurrets[i]
                turret.sectionWeapon.weaponTurrets.push(checkTurret(source, rsize * 0.5 * a))
              }
            }
          }
          let body = turret.sectionBody
          if(body) {
            let b = body
            turret.sectionBody = { ...b }
            turret.sectionBody.auras = []
            turret.sectionBody.turrets = []
            if(b.turrets) {
              for(let i=0,l=b.turrets.length;i<l;i++) {
                let source = b.turrets[i]
                turret.sectionBody.turrets.push(checkTurret(source, rsize * 0.5 * a))
              }
            }

          }
          return turret
        }
        for(let i=0,l=weapon.weaponTurrets.length;i<l;i++) {
          let source = weapon.weaponTurrets[i]
          tank.weaponTurrets.push(checkTurret(source, 1, 0.5))
        }
        for(let i=0,l=body.turrets.length;i<l;i++) {
          let source = body.turrets[i]
          tank.turrets.push(checkTurret(source, 1, 0.5))
        }
        for(let i=0,l=body.auras.length;i<l;i++) {
          tank.auras.push({ ...body.auras[i] })
        }
        if(tank === gameData.me && tank.team === 0) {
          tank.color = render.teamColors[1]
        } else {
          tank.color = render.getTankColor(tank.team, tank.sides)
        }
      },
      connectTo: function(ws, key) {
        gameCurrentServer.address = ws
        gameCurrentServer.key = key || ''
        gameConnect()
      },
      testFalse: false,
      log: Math.log(1.2),
      getLevel: function(score, celestial) {
        if(celestial) {
          return Math.floor(Math.round(10e5 * Math.log((score - 23477631) / 5e6 + 1) / game.log) / 10e5) + 75
        }
        return Math.floor(Math.log(score / 500 + 1) / game.log) + 1
      },
      getTotalScore: function(level, celestial) {
        if(celestial) {
          return 5000000 * (Math.pow(1.2, level - 75) - 1) + 23477631
        }
        return 500 * (Math.pow(1.2, level - 1) - 1)
      },
      getLevelScore: function(level, celestial) {
        if(celestial) {
          return level < 75 ? 0 : 1000000 * Math.pow(1.2, level - 75)
        }
        return level < 1 ? 0 : 100 * Math.pow(1.2, level - 1)
      },
      animations: {
        tankLevelBar: 22,
        part: 0,
        whole: 100,
        _tankLevelBar: 22,
        _part: 0,
        _whole: 100,
      },
      keys: {},
      movement: {
        last: false,
        update: function() {
          let x = (game.keys[68] || game.keys[39] || 0) - (game.keys[65] || game.keys[37] || 0)
          let y = (game.keys[83] || game.keys[40] || 0) - (game.keys[87] || game.keys[38] || 0)
          let d = (x === 0 && y === 0) ? false : Math.round(((100 * Math.atan2(y, x) / Math.PI) % 200 + 200) % 200)
          if(game.movement.last !== d) {
            game.movement.last = d
            gameSend(gameCurrentServer.ws, ['direction', d])
          }
        }
      },
      keydown: function(e) {
        if(!trusted(e)) { return }
        let typing = (document.activeElement === chat)
        let c  = e.target.tagName.toLowerCase()
        if(!typing && (c === 'input' || c === 'textarea')) { return }
        if (e.keyCode >= 49 && e.keyCode <= 56 && typing === false) {
          let c = 1
          if(e.ctrlKey) {
            c = 15
            e.preventDefault()
          }
          for(let i=0;i<c;i++) {
            gameUpgrade([3, 2, 1, 0, 7, 6, 5, 4][e.keyCode - 49])
          }
        }
        cpo.o = false
        if(!(e.keyCode in game.keys)) {
          if(typing) {
            if(e.keyCode === 13) {
              chat.blur()
              let text = chat.value
              if(text && text.length > 0) {
                if(text === '/quit') {
                  if(confirm('Are you sure?')) {
                    gameCurrentServer.ws.close()
                  }
                } if(text === '/debug') {
                  toggleDebug()
                } else {
                  gameSend(gameCurrentServer.ws, ['chat', text])
                }
              }
              chat.value = ''
            }
          } else {
            game.keys[e.keyCode] = true
            if(e.keyCode === 72) {
              render.staticCamera = (render.staticCamera ? false : true)
              render.addAnnouncement(`Static Camera (H): ${render.staticCamera ? 'ON' : 'OFF'}`, 3000)
            } if(e.keyCode === 66) {
              render.chat = (render.chat ? false : true)
              chat.style.visibility = render.chat ? 'visible' : 'hidden'
              render.addAnnouncement(`Show Chat (B): ${render.chat ? 'ON' : 'OFF'}`, 3000)
            } else if(e.keyCode === 86) {
              game.passive = (game.passive ? false : true)
              render.addAnnouncement(`Passive Mode (V): ${game.passive ? 'ON' : 'OFF'}`, 3000)
              gameSend(gameCurrentServer.ws, ['passive', game.passive ? true : false])
            } else if(e.keyCode === 13) {
              if(!render.chat) {
                return
              }
              chat.focus()
              game.keys = {}
            } else if(e.keyCode === 69) {
              game.autoFire = (game.autoFire ? false : true)
              render.addAnnouncement(`Auto Fire (E): ${game.autoFire ? 'ON' : 'OFF'}`, 3000)
            } else if(e.keyCode === 67) {
              game.autoSpin = (game.autoSpin === false ? (game.spinLock === false ? util.mouse.d : game.spinLock) : false)
              if(!game.autoSpin) {
                game.autoSpinDirection = game.autoSpinDirection > 0 ? -1 : 1
              }
              render.addAnnouncement(`Auto Spin (C): ${game.autoSpin === false ? 'OFF' : 'ON'}`, 3000)
            } else if(e.keyCode === 82) {
              game.reverse = (game.reverse ? false : true)
              render.addAnnouncement(`Reverse Direction (R): ${game.reverse ? 'ON' : 'OFF'}`, 3000)
            } else if(e.keyCode === 88) {
              game.spinLock = (game.spinLock === false? util.mouse.d + (game.reverse ? Math.PI : 0) : false)
              render.addAnnouncement(`Spin Lock (X): ${game.spinLock === false ? 'OFF' : 'ON'}`, 3000)
            } else if(e.keyCode === 77) {
              game.toggleDebug()
            } else if(e.keyCode === 78) {
              game.showBulletHealthBars = !game.showBulletHealthBars
              render.addAnnouncement(`Show Bullet Health Bars (N): ${game.showBulletHealthBars ? 'ON' : 'OFF'}`, 3000)
            } else if(e.keyCode === 81) {
              if(gameData.me) {
                render.addAnnouncement(`(${Math.round(gameData.me.x)}, ${Math.round(gameData.me.y)})`, 5000)
              }
            } else if(e.keyCode === 74) {
              if(gameData.me) {
                let c = function(o) {
                  return JSON.parse(JSON.stringify(o))
                }
                let d = {
                  ...c(gameData),
                  grid: {
                    background: gameData.grid.background,
                    lines: gameData.grid.lines,
                    size: gameData.grid.size,
                    darkness: render.darkness,
                    ambientParticles: gameData.ambientParticles,
                    wallType: gameData.wallType || 0,
                  },
                  url: gameCurrentServer.address
                }
                d.me = d.me.id
                let round = [], del = []
                let apply = function(o) {
                  for(let i=round.length-1;i>=0;i--) {
                    let p = round[i]
                    if(p in o) {
                      o[p] = Math.round(o[p])
                    }
                  } for(let i=del.length-1;i>=0;i--) {
                    let p = del[i]
                    delete o[p]
                  }
                }
                round = ['x', 'y', 'size']
                del = ['nd', 'nx', 'ny', 'od', 'ox', 'oy', 'parent', '_size', '_damageFlash']
                for(let i=d.bullets.length-1;i>=0;i--) {
                  let o = d.bullets[i]
                  apply(o)
                  d.bullets[i] = o
                }
                round = ['x', 'y', 'size']
                del = ['nx', 'ny', 'ox', 'oy', 'typing', 'typingFade', '_d', '_health', '_size', '_damageFlash']
                for(let i=d.tanks.length-1;i>=0;i--) {
                  let o = d.tanks[i]
                  apply(o)
                  d.tanks[i] = o
                }
                round = ['x', 'y', 'size']
                del = ['nd', 'nx', 'ny', 'od', 'ox', 'oy', '_health', '_size', '_damageFlash']
                for(let i=d.polygons.length-1;i>=0;i--) {
                  let o = d.polygons[i]
                  apply(o)
                  d.polygons[i] = o
                }
                let data = msgpack.encode(d)
                let str = game.base64.encode(data)
                str = game.base64.encode(pako.gzip(str))
                render.addAnnouncement(game.copyText(str) ? 'Copied screenshot as base64 to clipboard!' : 'Could not copy the screenshot to the clipboard.', 5000)
              }
            } else if(e.keyCode === 76) {
              if(gameData.me) { return }
              if(window.__k) { window.__k() }
              overlay1.style.visibility = 'hidden'
              overlay2.style.visibility = 'hidden'
              panel.style.opacity = 0
            } else if(e.keyCode === 75) {
              if(gameData.me) { return }
              const code = prompt('Enter screenshot code or number:')
              {
                try {
                  let o = pako.ungzip(atob(code).split('').map(x => x.charCodeAt(0)),{ to: 'string' })
                  o = window.msgpack.decode(game.base64.decode(o))
                  game.splash.next(o)
                  game.splash.show()
                  overlay1.style.visibility = 'hidden'
                  overlay2.style.visibility = 'hidden'
                  panel.style.opacity = 0
                } catch(e) { console.warn(e) }
              }
            }
            game.movement.update()
          }
        }
      },
      copyText: function(text) {
        if(navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).catch(function() {})
          return true
        }
        const area = document.createElement('textarea')
        area.value = text
        area.style.position = 'fixed'
        area.style.opacity = '0'
        document.body.appendChild(area)
        area.select()
        let copied = false
        try { copied = document.execCommand('copy') } catch(e) {}
        area.remove()
        return copied
      },
      base64: (function() {
        var fromCharCode = String.fromCharCode;
        var asCharCode = function asCharCode(c) {
          return c.charCodeAt(0);
        };
        return {
          encode: function(uint8array) {
            var output = [];
            for (var i = 0, length = uint8array.length; i < length; i++) {
              output.push(fromCharCode(uint8array[i]));
            }
            return btoa(output.join(''));
          },
          decode: function(chars) {
            return Uint8Array.from(atob(chars), asCharCode);
          }
        }
      })(),
      keyup: function(e) {
        if(!trusted(e)) { return }
        if(e.keyCode in game.keys) {
          delete game.keys[e.keyCode]
          game.movement.update()
        }
      },
      wheel: function(e) {
        if(!trusted(e)) { return }
        if(e.target.id === 'hudCanvas' && admin) {
          let y = e.deltaY * 0.01
          cameraZoom += y
          let max = gameData.mapSize / 200
          if(cameraZoom < 0) { cameraZoom = 0 }
          cameraZoomScale = Math.pow(1.5, cameraZoom)
          if(cameraZoomScale > max) {
            cameraZoomScale = max
            cameraZoom = Math.log(cameraZoomScale) / Math.log(1.5)
          }
        }
      },
      mousedown: function(e) {
        if(!trusted(e)) { return }
        if(e.target.id === 'hudCanvas') {
          if(e.button === 0) {
            util.mouse.down = true
          } else if(e.button === 2) {
            util.mouse.right = true
          }
        }
      },
      mouseup: function(e) {
        if(!trusted(e)) { return }
        if(e.button === 0) {
          util.mouse.down = false
        } else if(e.button === 2) {
          util.mouse.right = false
        }
      },
      mousemove: function(e) {
        if(!trusted(e)) { return }
        util.mouse.screenX = e.clientX - window.innerWidth / 2
        util.mouse.screenY = e.clientY - window.innerHeight / 2
        let t = 2 * Math.PI
        util.mouse.d = (Math.atan2(-util.mouse.screenX, util.mouse.screenY) % t + t) % t
      }
    }

