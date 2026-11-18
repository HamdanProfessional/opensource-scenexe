const { makeAuto } = require("../facilitators.js")

Class.autoBatteryAR = {
    ...makeAuto("battery", "Auto-Battery"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["autoGunner", "battery"], "autoBatteryAR")
