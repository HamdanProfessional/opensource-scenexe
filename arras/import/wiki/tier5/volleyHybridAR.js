const { makeOver } = require("../facilitators.js")
const preset = require("../presets.js")

Class.volleyHybridAR = {
    ...makeOver("volley", "Volley Hybrid", preset.hybrid),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false,
    DANGER: 8
}

upgrade(["volley"], "volleyHybridAR")
