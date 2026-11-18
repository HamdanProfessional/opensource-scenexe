const { makeAuto } = require("../facilitators.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.autoSkimmer = uncensored(makeAuto("skimmer", "Auto-Skimmer"))

upgrade(["skimmer", "autoLauncher"], "autoSkimmer")
