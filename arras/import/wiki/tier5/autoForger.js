const { makeAuto } = require("../facilitators.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.autoForger = uncensored(makeAuto("forger", "Auto-Forger"))

upgrade(["autoArtillery", "autoBuilder", "forger"], "autoForger")
