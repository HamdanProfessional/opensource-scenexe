const { makeAuto } = require("../facilitators.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.autoSwarmer = uncensored(makeAuto("swarmer", "Auto-Swarmer"))

upgrade(["swarmer", "autoLauncher"], "autoSwarmer")
