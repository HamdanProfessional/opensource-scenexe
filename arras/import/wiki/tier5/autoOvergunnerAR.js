const { makeAuto } = require("../facilitators.js")

Class.autoOvergunnerAR = {
    ...makeAuto("overgunner", "Auto-Overgunner"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["autoGunner", "overgunner", "autoOverseer"], "autoOvergunnerAR")
