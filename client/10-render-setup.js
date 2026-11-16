    let renderRestart = {
      timer: 61,
      a1: 0,
      a2: 0,
      a3: 0,
    }

    let renderAmbientParticles = []

    let renderHideNames = false

    let renderCtx = {
      gameCanvas: gameCanvas.getContext("2d"),
      darknessCanvas: darknessCanvas.getContext("2d"),
      hudCanvas: hudCanvas.getContext("2d"),
      mapCanvas: mapCanvas.getContext("2d"),
      respawnCanvas: respawnCanvas.getContext("2d")
    }

    let wallEdit = false, walls = {}, flat = function(x) {
      if(x > data.mapSize) { x = gameData.mapSize }
      if(x < -data.mapSize) { x = -gameData.mapSize }
      return x > 0 ? -Math.floor(1 - x / 50) : Math.floor(x / 50)
    }

    let extraChats = {}

    const render = {
