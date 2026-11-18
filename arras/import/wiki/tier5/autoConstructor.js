const { makeAuto } = require("../facilitators.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.autoConstructor = uncensored(makeAuto("construct", "Auto-Constructor"))

upgrade(["autoDestroyer", "construct", "autoBuilder"], "autoConstructor")
