const { makeOver } = require("../facilitators.js")
const preset = require("../presets.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.mongrelAR = uncensored(makeOver("hurler", "Mongrel", preset.hybrid))

upgrade(["hybrid", "hurler", "heaver"], "mongrelAR")
