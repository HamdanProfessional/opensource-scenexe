const { makeAuto } = require("../facilitators.js")

Class.autoDoubleFlankTwin = {
    ...makeAuto("doubleFlankTwin", "Auto-Double Flank Twin"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["autoDouble","doubleFlankTwin"], "autoDoubleFlankTwin")
