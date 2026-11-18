const { makeAuto } = require("../facilitators.js")

Class.autoFoamerAR = {
    ...makeAuto("foamer", "Auto-Foamer"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["foamer", "autoSprayer"], "autoFoamerAR")
