const { makeOver } = require("../facilitators.js")
const preset = require("../presets.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.catcherAR = uncensored(makeOver("megaTrapper", "Catcher", preset.hybrid))

upgrade(["hybrid", "megaTrapper"], "catcherAR")
