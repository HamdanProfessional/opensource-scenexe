const { makeAuto } = require("../facilitators.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.autoShotgun = uncensored(makeAuto("shotgun", "Auto-Shotgun"))

upgrade(["shotgun"], "autoShotgun")
