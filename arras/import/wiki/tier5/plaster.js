const { makeOver } = require("../facilitators.js")
const preset = require("../presets.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.plaster = uncensored(makeOver("mortar", "Plaster", preset.hybrid))

upgrade(["mortar", "force"], "plaster")
