const { makeAuto } = require("../facilitators.js")

Class.autoEqualizerAR = {
    ...makeAuto("equalizer", "Auto-Equalizer"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["autoGunner", "equalizer", "autoMachineTrapper", "autoWark"], "autoEqualizerAR")
