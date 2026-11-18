const { makeOver } = require("../facilitators.js")
const preset = require("../presets.js")

Class.disperser = {
    ...makeOver("streamliner", "Disperser", preset.hybrid),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false,
    DANGER: 8
}

upgrade(["streamliner", "cropDuster"], "disperser")
