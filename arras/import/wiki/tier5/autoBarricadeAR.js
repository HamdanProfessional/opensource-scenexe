const { makeAuto } = require("../facilitators.js")

Class.autoBarricadeAR = {
    ...makeAuto("barricade", "Auto-Barricade"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["autoMinigun", "barricade", "autoMachineTrapper"], "autoBarricadeAR")
