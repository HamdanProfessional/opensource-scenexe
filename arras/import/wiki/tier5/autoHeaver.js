const { makeAuto } = require("../facilitators.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.autoHeaver = uncensored(makeAuto("heaver", "Auto-Heaver"))

upgrade(["heaver", "autoLauncher"], "autoHeaver")
