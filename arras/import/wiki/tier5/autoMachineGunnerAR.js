const { makeAuto } = require("../facilitators.js")

Class.autoMachineGunnerAR = {
    ...makeAuto("machineGunner", "Auto-Machine Gunner"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["autoGunner", "machineGunner", "autoDiesel"], "autoMachineGunnerAR")
