const { makeAuto } = require("../facilitators.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.autoFoctillery = uncensored(makeAuto("foctillery", "Auto-Foctillery"))

upgrade(["autoArtillery", "foctillery"], "autoFoctillery")
