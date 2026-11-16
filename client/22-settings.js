    !function() {
      const start = function(connect, j) {
        let receive = function(a) {}, send = function(a) {}
        localSocket = function() {
          return {
            readyState: 1,
            send: function(a) {
              send(a)
            },
            addEventListener: function(a, b) {
              if(a === 'open') {
                b()
              } else if(a === 'message') {
                receive = function(c) {
                  b({
                    data: c
                  })
                }
              }
            }
          }
        }
        gameConnect()
        connect({
          on: function(a, b) {
            if(a === 'message') {
              send = function(c) {
                b(c)
              }
            }
          },
          send: function(a) {
            receive(a)
          }
        })
      }
      let ref = false
      Object.defineProperty(window, 'tankData', { get:function() {
        if(ref) {
          ref = false
          return tankData
        }
      } })
      window.require = function(a) {
        if(a === 'msgpackr') {
          return {
            pack: function() {
              return msgpack.encode(...arguments)
            },
            unpack: function() {
              return msgpack.decode(...arguments)
            }
          }
        } else if(a === 'ws') {
          return {
            WebSocketServer: function(c) {
              return {
                on: function(d, e) {
                  if(d === 'connection') {
                    setTimeout(function() {
                      start(e)
                    }, 1000)
                  }
                }
              }
            }
          }
        } else if(a === 'perf_hooks') {
          return {
            performance
          }
        } else if(a === 'fs') {
          return {
            readFileSync: function(b) {
              if(b === './tankData.js') {
                ref = true
                return `window.tankData=tankData`
              }
            }
          }
        } else if(a === 'https' || a === 'http') {
          return {
            createServer: function(b) {
              return {
                on: function(c, d) {},
                listen: function(c) {}
              }
            }
          }
        }
      }
      let m = {}
      window.__dirname = ''
      window.module = m
      Object.defineProperty(m, 'exports', {
        get: function() {
          return {}
        }, set: function(s) {
          if(isLocal) {
            localServer = s
          }
        }
      })
      window.process = {
        on: function() {},
        exit: function() {}
      }
    }()
    !function() {
      const r = new RegExp("/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])/")
      const j = function() {
        let email = prompt('Enter email address:')
        if(!r.test(email)) {
          return alert('Email invalid')
        }
        let at = email.indexOf('@')
        if(at < 0) {
          return alert('Email invalid')
        }
        let string = email.slice(0, at)
        let end = email.slice(at + 1)
        let allowed = ['gmail.com', 'outlook.com', 'hotmail.com', 'msn.com']
        if(string.length >= 256) {
          return alert('Email too long')
        }
        if(allowed.indexOf(end) < 0) {
          return alert(`Email domain invalid. Please use one of: ${allowed.join(', ')}`)
        }
        gameSend(gameCurrentServer.ws, ['createAccount', [string, end]])
      }
      const byId = function(id) { return document.getElementById(id) }
      const reconnect = function() {
        gameCurrentServer.ws.forceClose = true
        gameConnect()
        render.serverSelectSlide.data = false
        serverSelectLowerText.textContent = '???'
        render.slideSelect('Connecting...', render.teamColors[7], 0, 1)
        respawnText.textContent = ''
        game.respawnScore = 0
        render.reset()
        page.setPlayButton(false)
        page.setOverlay(0)
        if(respawnPanel.style.top === '-100%') {
          panel.style.opacity = 1
        }
      }
      const validName = function(u) {
        if(!u || u.length > 30) { return false }
        for(let i=u.length-1;i>=0;i--) {
          if('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-=_+[]{}\\|;\':",./<>?`~'.indexOf(u[i]) < 0) { return false }
        }
        return true
      }
      let authMode = 'login', authBusy = false, authTimer = false
      const authForm = byId('authForm'), authDark = byId('authDark'), authUser = byId('authUser'), authPass = byId('authPass')
      const authError = byId('authError'), authSwitch = byId('authSwitch')
      const setAuthMode = function(m) {
        authMode = m
        byId('authTitle').textContent = byId('authSubmit').textContent = m === 'login' ? 'Log in' : 'Create Account'
        authPass.autocomplete = m === 'login' ? 'current-password' : 'new-password'
        authSwitch.innerHTML = m === 'login' ? 'No account? <a data-m="create">Create one</a>' : 'Already have an account? <a data-m="login">Log in</a>'
        authError.textContent = ''
      }
      const openAuth = function(m) {
        setAuthMode(m)
        authBusy = false
        authForm.classList.add('open')
        authDark.classList.add('open')
        setTimeout(function() { (authUser.value ? authPass : authUser).focus() }, 50)
      }
      const closeAuth = function() {
        authForm.classList.remove('open')
        authDark.classList.remove('open')
        authPass.value = ''
        authBusy = false
        clearTimeout(authTimer)
      }
      window.authResult = function(ok, msg, name) {
        authBusy = false
        clearTimeout(authTimer)
        if(ok) { return closeAuth() }
        if(!authForm.classList.contains('open')) {
          openAuth('login')
          if(name) { authUser.value = name }
        }
        authError.textContent = msg || 'Failed'
      }
      window.setAccountUI = function(name) {
        byId('b2').textContent = name || 'Log in'
        byId('b1').textContent = name ? 'Log out' : 'Create Account'
      }
      authSwitch.addEventListener('click', function(e) {
        if(e.target.dataset && e.target.dataset.m) { setAuthMode(e.target.dataset.m) }
      })
      byId('authCancel').addEventListener('click', closeAuth)
      authDark.addEventListener('click', closeAuth)
      authForm.addEventListener('keydown', function(e) {
        if(e.key === 'Escape') { closeAuth() }
      })
      authForm.addEventListener('submit', function(e) {
        e.preventDefault()
        if(authBusy) { return }
        let u = authUser.value.trim(), p = authPass.value
        if(!validName(u)) { return authError.textContent = 'Invalid username' }
        if(!p || p.length > 30) { return authError.textContent = 'Password must be 1-30 characters' }
        authBusy = true
        authError.textContent = 'Please wait...'
        authTimer = setTimeout(function() {
          if(authBusy) {
            authBusy = false
            game.pendingLogin = false
            authError.textContent = 'No response from server, try again'
          }
        }, 10000)
        if(authMode === 'create') {
          game.pendingLogin = [u.toLowerCase(), p]
          gameSend(gameCurrentServer.ws, ['createAccount', [u, p]])
        } else {
          game.pendingLogin = false
          game.login = [u.toLowerCase(), p]
          reconnect()
        }
      })
      window.clicked2 = function(e) {
        if(game.loggedIn) {
          page.openAccount()
        } else {
          openAuth('login')
        }
      }
      window.clicked = function(e) {
        if(game.loggedIn || game.login) {
          try { delete localStorage.login } catch(e) {}
          try { delete sessionStorage.login } catch(e) {}
          game.login = false
          game.loggedIn = false
          window.setAccountUI(false)
          reconnect()
        } else {
          openAuth('create')
        }
      }
    }()

    window.connectTo = game.connectTo
    window.loaded = function() {
      !function() {
        let s = window.screenshots, l = s.length
        const r = function() {
          let j = []
          for(let i=0;i<l;i++) {
            j.splice(Math.floor(Math.random() * (i + 1)), 0, i)
          }
          return j
        }
        let c = 0, arr = r()
        setTimeout(function() {
          const k = function(id) {
            try {
              if(c >= l && !(id >= 0)) {
                c = 0
                arr = r()
              }
              let o = window.screenshots[id >= 0 ? id : arr[c]]
              if(!o.decoded) {
                let l = pako.ungzip(atob(o).split('').map(x => x.charCodeAt(0)),{ to: 'string' })
                l = window.msgpack.decode(game.base64.decode(l))
                o = window.screenshots[id >= 0 ? id : arr[c]] = l
                o.decoded = true
              }
              game.splash.next(o)
              if(!(id >= 0)) {
                c ++
              }
            } catch(e) { console.warn(e) }
          }
          k()
          window.__k = k
        })
      }()
    }

    !function() {
      if(window.screenshots && window.screenshots.length) { return }
      const themes = [
        {
          background: { r: 205, g: 205, b: 205 }, lines: { r: 200, g: 200, b: 200 }, size: 30,
          sides: [3, 3, 3, 3, 4, 4, 4, 4, 5, 5], nest: 6, radiantChance: 0.04, particles: [],
        },
        {
          background: { r: 54, g: 54, b: 54 }, lines: { r: 39, g: 39, b: 39 }, size: 30,
          sides: [3, 3, 4, 4, 5, 5, 6], nest: 7, radiantChance: 0.12, particles: [],
        },
        {
          background: { r: 12, g: 12, b: 12 }, lines: { r: 21, g: 21, b: 21 }, size: 100,
          sides: [4, 4, 5, 5, 6, 6, 7], nest: 8, radiantChance: 0.3,
          particles: [{ amount: 3, radiant: 0, size: [4, 9], color: { r: 255, g: 228, b: 107 }, d: 0, range: 100, speed: 150, fade: 25, t: 80, opacity: 60 }],
        },
        {
          background: { r: 0, g: 0, b: 0 }, lines: { r: 10, g: 10, b: 10 }, size: 250,
          sides: [-1, -1, -2, 4, 5, 5, 6], nest: 7, radiantChance: 0.35,
          particles: [{ amount: 4, radiant: 1, size: [6, 10], color: { r: 255, g: 255, b: 255 }, d: 90, range: 35, speed: 600, fade: 20, t: 120, opacity: 50 }],
        },
      ]
      let nextId = 1
      const makePolygon = function(x, y, sides, radiant) {
        const d = Math.random() * Math.PI * 2
        const size = render.getPolygonSize(sides)
        const color = render.getPolygonColor(sides)
        return {
          id: nextId ++,
          x: x, ox: x, nx: x,
          y: y, oy: y, ny: y,
          d: d, od: d, nd: d,
          sides: sides, health: 1, _health: 1, healthBarFade: 0,
          color: color, _color: color,
          fadeTime: 1, radiant: radiant,
          size: size, _size: size,
          damageFlash: 0, _damageFlash: 0,
          menuSpin: (Math.random() - 0.5) * 0.004,
          menuVx: (Math.random() - 0.5) * 0.15,
          menuVy: (Math.random() - 0.5) * 0.15,
        }
      }
      const tankWeapons = ['alpha', 'streamliner', 'amalgam', 'annihilator', 'hybrid', 'octo', 'penta', 'flamethrower', 'executive', 'emperor', 'nova', 'deca', 'omega', 'hepta', 'king', 'vulcan', 'eradicator', 'marksman', 'minigun', 'arsenal']
      const tankBodies = ['saw', 'inferno', 'bastion', 'fortalice', 'ziggurat', 'mothership', 'quadruplet', 'battalion', 'blade', 'hellfire', 'flagship', 'minaret', 'spire', 'pound', 'alcazar', 'quintuplet']
      const sceneTeams = function(name) {
        if(name.includes('4team')) { return [1, 2, 3, 4] }
        if(name.includes('2team')) {
          const t = [1, 2, 3, 4], a = t.splice(Math.floor(Math.random() * 4), 1)[0]
          return [a, t[Math.floor(Math.random() * 3)]]
        }
        if(name.includes('void') || name.includes('sanctuary')) { return [5] }
        if(name.includes('abyss')) { return [8, 8, 2] }
        return [2]
      }
      const makeTank = function(x, y, team) {
        const pick = function(list) {
          const ok = list.filter(n => tankData[list === tankWeapons ? 'weapons' : 'bodies'][n])
          return ok.length ? ok[Math.floor(Math.random() * ok.length)] : ''
        }
        const d = Math.random() * Math.PI * 2
        const tank = {
          id: nextId ++,
          x: x, ox: x, nx: x,
          y: y, oy: y, ny: y,
          d: d, _d: [0, [d], 1],
          fadeTime: 1, weapon: '', body: '', size: 0, _size: 30,
          health: 1, _health: 1, maxHealth: 1, healthBarFade: 0,
          team: team, color: { r: 0, g: 0, b: 0 }, radiant: 0, sides: 0,
          barrels: [], weaponTurrets: [], turrets: [], auras: [], _turrets: [], _barrels: [], turretData: {},
          passive: false, passiveFade: 0, chat: [], typing: false, typingFade: 0,
          className: '', name: '', level: 60 + Math.floor(Math.random() * 31),
          damageFlash: 0, _damageFlash: 0, invincible: false,
          menuVx: (Math.random() - 0.5) * 0.6,
          menuVy: (Math.random() - 0.5) * 0.6,
        }
        tank.weapon = pick(tankWeapons)
        tank.body = pick(tankBodies)
        game.updateTank(tank)
        tank.color = render.getTankColor(team, tank.body) || render.teamColors[2]
        return tank
      }
      const menuGap = function(a, b) { return (a._size + b._size) * 3 }
      const makeScene = function(theme, name) {
        const polygons = [], tanks = []
        name = String(name || '').toLowerCase()
        const pick = function() { return theme.sides[Math.floor(Math.random() * theme.sides.length)] }
        const radiant = function() { return Math.random() < theme.radiantChance ? 1 + Math.floor(Math.random() * 3) : 0 }
        const spread = 3200
        const place = function(x, y, sides, rad) {
          const size = render.getPolygonSize(sides)
          for(let i=polygons.length-1;i>=0;i--) {
            const o = polygons[i], dx = o.x - x, dy = o.y - y, m = (o.size + size) * 1.4
            if(dx * dx + dy * dy < m * m) { return false }
          }
          polygons.push(makePolygon(x, y, sides, rad))
          return true
        }
        for(let n=0;n<3;n++) {
          const cx = (Math.random() * 2 - 1) * spread * 0.7, cy = (Math.random() * 2 - 1) * spread * 0.7
          place(cx, cy, theme.nest, Math.random() < 0.5 ? 1 + Math.floor(Math.random() * 2) : 0)
          for(let i=0;i<30;i++) {
            const a = Math.random() * Math.PI * 2, r = 200 + Math.random() * 450
            place(cx + Math.cos(a) * r, cy + Math.sin(a) * r, pick(), radiant())
          }
        }
        for(let i=0;i<260;i++) {
          place((Math.random() * 2 - 1) * spread, (Math.random() * 2 - 1) * spread, pick(), radiant())
        }
        try {
          const teams = sceneTeams(name)
          for(let i=0;i<16;i++) {
            const team = teams[i % teams.length]
            let cx = 0, cy = 0
            if(teams.length > 1) {
              const a = (teams.indexOf(team) / teams.length) * Math.PI * 2 + Math.PI / 4
              cx = Math.cos(a) * spread * 0.45
              cy = Math.sin(a) * spread * 0.45
            }
            const r = teams.length > 1 ? spread * 0.4 : spread * 0.9
            const tank = makeTank(cx, cy, team)
            for(let tries=0;tries<40;tries++) {
              const x = cx + (Math.random() * 2 - 1) * r, y = cy + (Math.random() * 2 - 1) * r
              tank.x = tank.ox = tank.nx = x
              tank.y = tank.oy = tank.ny = y
              if(!tanks.some(o => Math.hypot(o.x - x, o.y - y) < menuGap(o, tank) * 1.6)) { break }
            }
            tanks.push(tank)
            for(let u=polygons.length-1;u>=0;u--) {
              const o = polygons[u], dx = o.x - tank.x, dy = o.y - tank.y, m = (o.size + tank._size) * 2
              if(dx * dx + dy * dy < m * m) { polygons.splice(u, 1) }
            }
          }
        } catch(e) { console.warn('menu tanks', e) }
        return {
          decoded: true,
          me: { id: 0, x: 0, y: 0 },
          tanks: tanks, bullets: [], polygons: polygons,
          wormholes: {}, bases: [], walls: [], gates: [],
          mapSize: 100000, _mapSize: 100000,
          grid: {
            background: theme.background, lines: theme.lines, size: theme.size,
            ambientParticles: theme.particles, wallType: 0, darkness: 0,
          },
        }
      }
      window.menuScene = function(name) {
        name = String(name || '').toLowerCase()
        const i = name.includes('void') ? 3 : name.includes('abyss') ? 2 : name.includes('cross') ? 1 : 0
        game.splash.next(makeScene(themes[i], name))
      }
      setTimeout(function() {
        try {
          window.screenshots = themes.map(t => makeScene(t, 'ffa'))
          window.loaded()
        } catch(e) { console.warn('menu background', e) }
      })
      setInterval(function() {
        if(game.override !== game.splash || !game.splash.current) { return }
        const polygons = game.splash.current.polygons
        for(let i=polygons.length-1;i>=0;i--) {
          const p = polygons[i]
          if(p.menuSpin === undefined) { continue }
          p.d = p.od = p.nd = p.d + p.menuSpin
          p.x = p.ox = p.nx = p.x + p.menuVx
          p.y = p.oy = p.ny = p.y + p.menuVy
        }
        const tanks = game.splash.current.tanks || []
        for(let i=tanks.length-1;i>=0;i--) {
          for(let u=i-1;u>=0;u--) {
            const a = tanks[i], b = tanks[u], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1
            if(d < menuGap(a, b) && (b.menuVx - a.menuVx) * dx + (b.menuVy - a.menuVy) * dy < 0) {
              const nx = dx / d, ny = dy / d
              const pa = a.menuVx * nx + a.menuVy * ny, pb = b.menuVx * nx + b.menuVy * ny
              a.menuVx += (pb - pa) * nx; a.menuVy += (pb - pa) * ny
              b.menuVx += (pa - pb) * nx; b.menuVy += (pa - pb) * ny
            }
          }
        }
        for(let i=tanks.length-1;i>=0;i--) {
          const t = tanks[i]
          if(t.menuVx === undefined) { continue }
          t.x = t.ox = t.nx = t.x + t.menuVx
          t.y = t.oy = t.ny = t.y + t.menuVy
        }
      }, 33)
    }()
