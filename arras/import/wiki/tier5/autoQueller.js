const { makeAuto } = require("../facilitators.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.autoQueller = uncensored(makeAuto("queller", "Auto-Queller"))

upgrade(["queller", "autoDestroyer", "autoArtillery"], "autoQueller")
