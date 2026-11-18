const { makeOver } = require("../facilitators.js")

Class.saturator = {
    ...makeOver("atomizer", "Saturator", { count: 1, maxDrones: 3 }),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false,
    DANGER: 8
}

upgrade(["atomizer", "shower"], "saturator")
