const { makeAuto } = require("../facilitators.js")

Class.autoBentGunnerAR = {
    ...makeAuto("bentGunner", "Auto-Bent Gunner"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["autoTripleShot","bentGunner"], "autoBentGunnerAR")
