const { makeAuto } = require("../facilitators.js")

Class.autoTaser = {
    ...makeAuto("taser", "Auto-Taser"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["taser", "autoMinigun"], "autoTaser")
