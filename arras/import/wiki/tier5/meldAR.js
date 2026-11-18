const { makeOver } = require("../facilitators.js")
const preset = require("../presets.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.meldAR = uncensored(makeOver("construct", "Meld", preset.hybrid))

upgrade(["hybrid", "construct", "fashioner"], "meldAR")
