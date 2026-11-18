const { makeOver } = require("../facilitators.js")
const preset = require("../presets.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.slinger = uncensored(makeOver("fieldGun", "Slinger", preset.hybrid))

upgrade(["fieldGun", "force", "heaver"], "slinger")
