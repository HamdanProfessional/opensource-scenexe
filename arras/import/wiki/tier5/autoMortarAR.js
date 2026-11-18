const { makeAuto } = require("../facilitators.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.autoMortarAR = uncensored(makeAuto("mortar", "Auto-Mortar"))

upgrade(["mortar", "autoArtillery"], "autoMortarAR")
