const { makeAuto } = require("../facilitators.js")

Class.autoSubverterAR = {
    ...makeAuto("subverter", "Auto-Subverter"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["autoMinigun", "subverter"], "autoSubverterAR")
