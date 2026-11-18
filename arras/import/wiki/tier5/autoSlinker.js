const { makeAuto } = require("../facilitators.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.autoSlinker = uncensored(makeAuto("slinker", "Auto-Slinker"))

upgrade(["autoDestroyer", "slinker"], "autoSlinker")
