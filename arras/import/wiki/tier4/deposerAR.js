const { makeOver } = require("../facilitators.js")
const preset = require("../presets.js")

Class.deposerAR = {
    ...makeOver("subverter", "Deposer", preset.hybrid),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false,
    DANGER: 8
}

upgrade(["cropDuster", "subverter"], "deposerAR")
