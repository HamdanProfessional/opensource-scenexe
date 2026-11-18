const { makeOver } = require("../facilitators.js")
const preset = require("../presets.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.apiculturist = uncensored(makeOver("beekeeper", "Apiculturist", preset.hybrid))

upgrade(["beekeeper", "force"], "apiculturist")
