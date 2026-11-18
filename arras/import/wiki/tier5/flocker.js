const { makeOver } = require("../facilitators.js")
const preset = require("../presets.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.flocker = uncensored(makeOver("swarmer", "Flocker", preset.hybrid))

upgrade(["swarmer", "heaver"], "flocker")
