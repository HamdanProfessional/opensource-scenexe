const { makeAuto } = require("../facilitators.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.autoRocketeer = uncensored(makeAuto("rocketeer", "Auto-Rocketeer"))

upgrade(["rocketeer", "autoLauncher"], "autoRocketeer")
