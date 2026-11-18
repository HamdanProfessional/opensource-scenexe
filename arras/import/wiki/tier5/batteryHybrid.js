const { makeOver } = require("../facilitators.js")
const preset = require("../presets.js")

Class.batteryHybrid = {
    ...makeOver("battery", "Battery Hybrid", preset.hybrid),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false,
    DANGER: 8
}

upgrade(["battery"], "batteryHybrid")
