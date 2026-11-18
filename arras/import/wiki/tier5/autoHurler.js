const { makeAuto } = require("../facilitators.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.autoHurler = uncensored(makeAuto("hurler", "Auto-Hurler"))

upgrade(["autoDestroyer", "hurler", "autoLauncher"], "autoHurler")
