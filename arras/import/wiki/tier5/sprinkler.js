const { makeOver } = require("../facilitators.js")
const preset = require("../presets.js")

Class.sprinkler = {
    ...makeOver("machineGunner", "Sprinkler", preset.hybrid),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false,
    DANGER: 8
}

upgrade(["machineGunner", "polluter"], "sprinkler")
