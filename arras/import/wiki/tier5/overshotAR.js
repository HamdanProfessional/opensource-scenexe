const { makeOver } = require("../facilitators.js")

Class.overshotAR = {
    ...makeOver("tripleShot", "Overshot", { count: 2, maxDrones: 3 }),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["bentHybrid"], "overshotAR")
