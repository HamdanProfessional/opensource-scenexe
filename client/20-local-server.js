    let localServer = false
    if(isLocal) {
      let starts = document.createElement('textarea')
      starts.className = 'input'
      starts.style.width = 'calc(100% - 900px)'
      starts.style.height = 'calc(100% - 600px)'
      starts.style.position = 'absolute'
      starts.style.top = 'calc(50% - 200px)'
      starts.style.left = '50%'
      starts.style.transform = 'translate(-50%, -50%)'
      starts.style.fontFamily = 'monospace'
      starts.style.fontSize = '25px'
      starts.style.background = 'rgba(0, 0, 0, 0.9)'
      starts.style.backdropFilter = 'blur(10px)'
      starts.style.resize = 'none'
      starts.style.fontWeight = '600'
      let startbutton = document.createElement('button')
      startbutton.textContent = 'Start Server'
      startbutton.style.width = 'calc(100% - 878px)'
      startbutton.style.height = '70px'
      startbutton.style.position = 'absolute'
      startbutton.style.top = 'calc(100% - 455px)'
      startbutton.style.left = '50%'
      startbutton.style.transform = 'translate(-50%, -50%)'
      startbutton.style.fontFamily = 'monospace'
      startbutton.style.fontSize = '25px'
      startbutton.style.background = 'rgba(0, 0, 0, 0.9)'
      startbutton.style.backdropFilter = 'blur(10px)'
      startbutton.style.fontWeight = '600'
      startbutton.className = 'input'
      panel.appendChild(starts)
      panel.appendChild(startbutton)
      startbutton.addEventListener('click', function() {
        let options = {
          parentPort: {
            postMessage: function() {}
          },
          port: 3000,
          testing: 1,
          start: '',
          secret: {},
          standalone: 1
        }
        options.start = starts.value
        console.log(localServer, options)
        if(localServer) {
          options.start = starts.value
          starts.remove()
          startbutton.remove()
          try {
            data = localServer.run(options)
            window.data = data
          } catch(e) {
            confirm(e)
          }
        }
      })
      starts.value = `!function() {
  const dim = dimension.create({
    mapSize: 2000,
    name: 'ffa',
    type: 'ffa',
    freeJoin: true,
    allowScale: true,
    displayName: 'Private Test',
    displayColor: -5,
    displayRadiant: 0,
    walls: [],
    gates: [],
    background: {
      r: 205,
      g: 205,
      b: 205
    },
    grid: {
      r: 200,
      g: 200,
      b: 200
    },
    gridSize: 25,
    maxPolygonSides: 13,
    maxPolygonCount: 50,
    spawnPlayer: function(team, tank) {
      let s = dim.mapSize
      if(tank.team > 4) { s -= 2000 }
      return [(2 * Math.random() - 1) * s, (2 * Math.random() - 1) * s]
    }
  })
}()`
      setInterval(gamePing, 500)
      render.loop()

    } else {
      game.captchaResponse = localStorage.token || (localStorage.token = 'openscenexe-nocaptcha')
      gameConnect()
      setInterval(gamePing, 500)
      render.loop()
    }

