const { makeOver } = require("../facilitators.js")
const preset = require("../presets.js")

Class.rampartAR = {
    ...makeOver("barricade", "Rampart", preset.hybrid),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false,
    DANGER: 8
}

upgrade(["cropDuster", "barricade", "deviation"], "rampartAR")
