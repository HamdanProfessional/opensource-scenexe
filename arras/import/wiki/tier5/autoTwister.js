const { makeAuto } = require("../facilitators.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.autoTwister = uncensored(makeAuto("twister", "Auto-Twister"))

upgrade(["twister", "autoLauncher"], "autoTwister")
