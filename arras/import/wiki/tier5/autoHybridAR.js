const { makeAuto } = require("../facilitators.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.autoHybridAR = uncensored(makeAuto("hybrid", "Auto-Hybrid"))

upgrade(["hybrid", "autoDestroyer"], "autoHybridAR")
