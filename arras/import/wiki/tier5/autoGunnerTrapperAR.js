const { makeAuto } = require("../facilitators.js")

Class.autoGunnerTrapperAR = {
    ...makeAuto("gunnerTrapper", "Auto-Gunner Trapper"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["autoGunner", "gunnerTrapper", "autoTrapGuard"], "autoGunnerTrapperAR")
