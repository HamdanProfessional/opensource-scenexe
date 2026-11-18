const { makeOver } = require("../facilitators.js")

Class.bentCrossbreedAR = {
    ...makeOver("tripleShot", "Bent Crossbreed", { count: 1, independent: true, widthOffset: 3, maxDrones: 1, extraStats: [{ size: 1.6, health: 1.5, damage: 1.3 }] }),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["bentHybrid"], "bentCrossbreedAR")
