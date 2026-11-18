const { makeOver } = require("../facilitators.js")
const preset = require("../presets.js")

Class.junkerAR = {
    ...makeOver("bentMinigun", "Junker", preset.hybrid),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["bentHybrid","bentMinigun","cropDuster"], "junkerAR")
