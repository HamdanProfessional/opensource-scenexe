const { parentPort, workerData, threadId, isMainThread } = require('worker_threads');
const engine = require(workerData.options.engineFile)

workerData.options.parentPort = parentPort

const data = engine.run(workerData.options)

let servers = []
for(let n in data.dimension.dims) {
  let d = data.dimension.dims[n]
  servers.push([d.freeJoin, [n, d.displayName, d.displayColor, d.displayRadiant, d.entryMessage || false, d.exitMessage || false]])
}

parentPort.postMessage(['dims', servers])

parentPort.on('message', function(message) {
  if(message[0] === 'allDims') {
    data.dimension.allDims = message[1]
    return
  }
  if(message[0] === 'exit') {
	  if(message[1]) {
      setTimeout(function() {
        console.log('WARNING: [worker] process.exit(0)')
        process.exit(0)
      })
		  for(let d in data.dimension.dims) {
			  let dim = data.dimension.dims[d]
			  for(let i=dim.tanks.length-1;i>=0;i--) {
				  let tank = dim.tanks[i]
				  if(tank.ws && tank.ws.data.isPlayer) {
            if(dim.sandbox) { return tank.ws.close() }
					  console.log('send', tank.name)
					  data.dimension.sendTankTo({
						  tank: tank,
						  dim: data.dimension.dims['2teams'] ? '4teams' : '2teams'
					  })
				  }
			  }
		  }
      return
	  }
    setTimeout(function() {
      console.log('WARNING: [worker] process.exit(0)')
      process.exit(0)
    }, 7500)
    for(let d in data.dimension.dims) {
      let dim = data.dimension.dims[d]
      let t = dim.tanks
      for(let i=t.length-1;i>=0;i--) {
        let tank = t[i]
        if(!tank.static) {
          tank.health = 0
          tank.regenTime = 0
          tank.finalDamage = {
            tanks: {},
            polygons: {}
          }
        }
      }
    }
  } else if(message[0] === 'totalPlayers') {
    data.game.totalPlayers = message[1]
  } else if(message[0] === 'addBot') {
    data.addBot(message[1])
  } else if(message[0] === 'globalAnnounce') {
    let c = data.game.clients, d = message[1]
    if(!d) { return }
    for(let i=c.length-1;i>=0;i--) {
      let j = c[i]
      if(j.data.tank) {
        j.sendPacket('announcement', d)
      }
    }
  }
})