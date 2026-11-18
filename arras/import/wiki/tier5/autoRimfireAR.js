const { makeAuto } = require("../facilitators.js")

Class.autoRimfireAR = {
    ...makeAuto("rimfire", "Auto-Rimfire"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["autoGunner", "rimfire"], "autoRimfireAR")
