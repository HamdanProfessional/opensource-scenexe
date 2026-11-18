const { makeOver } = require("../facilitators.js")
const preset = require("../presets.js")

Class.splitHybridAR = {
    ...makeOver("splitShot", "Split Hybrid", preset.hybrid),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["bentHybrid","splitShot"], "splitHybridAR")
