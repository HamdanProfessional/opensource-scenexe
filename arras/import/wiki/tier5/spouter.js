const { makeOver } = require("../facilitators.js")
const preset = require("../presets.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.spouter = uncensored(makeOver("twister", "Spouter", preset.hybrid))

upgrade(["twister", "heaver"], "spouter")
