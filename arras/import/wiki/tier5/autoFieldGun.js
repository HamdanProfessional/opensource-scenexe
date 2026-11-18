const { makeAuto } = require("../facilitators.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.autoFieldGun = uncensored(makeAuto("fieldGun", "Auto-Field Gun"))

upgrade(["fieldGun", "autoArtillery", "autoLauncher"], "autoFieldGun")
