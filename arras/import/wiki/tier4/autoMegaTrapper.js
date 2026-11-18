const { makeAuto } = require("../facilitators.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.autoMegaTrapper = uncensored(makeAuto("megaTrapper", "Auto-Mega Trapper"))

upgrade(["autoDestroyer", "megaTrapper"], "autoMegaTrapper")
