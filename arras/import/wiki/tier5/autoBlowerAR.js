const { makeAuto } = require("../facilitators.js")

Class.autoBlowerAR = {
    ...makeAuto("blower", "Auto-Blower"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["autoGunner", "blower", "autoDestroyer"], "autoBlowerAR")
