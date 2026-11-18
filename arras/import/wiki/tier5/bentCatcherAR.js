const { makeOver } = require("../facilitators.js")
const preset = require("../presets.js")

Class.bentCatcherAR = {
    ...makeOver("waarrk", "Bent Catcher", preset.hybrid),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["bentHybrid","waarrk","coalesce"], "bentCatcherAR")
