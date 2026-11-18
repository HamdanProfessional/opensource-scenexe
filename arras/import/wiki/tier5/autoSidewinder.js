const { makeAuto } = require("../facilitators.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.autoSidewinder = uncensored(makeAuto("sidewinder", "Auto-Sidewinder"))

upgrade(["sidewinder", "autoLauncher"], "autoSidewinder")
