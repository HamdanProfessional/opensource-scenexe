const { makeAuto } = require("../facilitators.js")

Class.autoBentMinigunAR = {
    ...makeAuto("bentMinigun", "Auto-Bent Minigun"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["autoTripleShot","bentMinigun","autoMinigun"], "autoBentMinigunAR")
