const { makeAuto } = require("../facilitators.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.autoForce = uncensored(makeAuto("force", "Auto-Force"))

upgrade(["force", "autoArtillery"], "autoForce")
