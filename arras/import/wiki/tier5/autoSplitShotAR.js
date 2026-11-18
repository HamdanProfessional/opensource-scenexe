const { makeAuto } = require("../facilitators.js")

Class.autoSplitShotAR = {
    ...makeAuto("splitShot", "Auto-Split Shot"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["splitShot","autoTripleShot"], "autoSplitShotAR")
