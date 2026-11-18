const { makeOver } = require("../facilitators.js")
const preset = require("../presets.js")

Class.spambridAR = {
    ...makeOver("bentGunner", "Spambrid", preset.hybrid),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["bentHybrid"], "spambridAR")
