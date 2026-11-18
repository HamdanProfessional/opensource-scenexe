const { makeGunner } = require("../facilitators.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.stormAR = uncensored(makeGunner("queller", "Storm"))

upgrade(["blower", "queller"], "stormAR")
