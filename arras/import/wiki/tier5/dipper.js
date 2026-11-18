const { makeOver } = require("../facilitators.js")
const preset = require("../presets.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.dipper = uncensored(makeOver("skimmer", "Dipper", preset.hybrid))

upgrade(["skimmer", "heaver"], "dipper")
