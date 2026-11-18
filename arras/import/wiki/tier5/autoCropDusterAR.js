const { makeAuto } = require("../facilitators.js")

Class.autoCropDusterAR = {
    ...makeAuto("cropDuster", "Auto-Crop Duster"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["cropDuster", "autoMinigun"], "autoCropDusterAR")
