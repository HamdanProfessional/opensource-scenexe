const { makeAuto } = require("../facilitators.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.autoAnnihilatorAR = uncensored(makeAuto("annihilator", "Auto-Annihilator"))

upgrade(["annihilator", "autoDestroyer"], "autoAnnihilatorAR")
