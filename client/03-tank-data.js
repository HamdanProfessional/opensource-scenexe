    const resetTankData = function() {
      tankData = { ...defaultTankData }
      for(let i in tankData) {
        tankData[i] = { ...tankData[i] }
      }
    }

    tankData = defaultTankData;
    resetTankData()

	  const cpo = {
		  o: false,
		  x: 0,
		  y: 0
	  }

