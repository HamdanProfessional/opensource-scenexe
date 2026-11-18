const { makeOver } = require("../facilitators.js")
const preset = require("../presets.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.crossAR = uncensored(makeOver("queller", "Cross", preset.hybrid))

upgrade(["hybrid", "queller", "force"], "crossAR")
