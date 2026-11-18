const { makeOver, makeDrive } = require("../facilitators.js")

Class.bentHybriddriveAR = {
    ...makeDrive(makeOver("tripleShot", "Bent Hybriddrive", { count: 2, independent: true, maxDrones: 3 }), "Bent Hybriddrive", "drone"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["bentHybrid"], "bentHybriddriveAR")
