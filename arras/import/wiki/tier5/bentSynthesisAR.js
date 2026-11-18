const { makeOver } = require("../facilitators.js")

Class.bentSynthesisAR = {
    ...makeOver("tripleShot", "Bent Synthesis", { count: 2, independent: true, widthOffset: -2, maxDrones: 4, extraStats: [{ size: 0.6, reload: 0.7 }] }),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["bentHybrid"], "bentSynthesisAR")
