const { makeOver } = require("../facilitators.js")
const preset = require("../presets.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.blend = uncensored(makeOver("forger", "Blend", preset.hybrid))

upgrade(["force", "forger", "fashioner"], "blend")
