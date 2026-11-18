const { makeGunner } = require("../facilitators.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.wiperAR = uncensored(makeGunner("annihilator", "Wiper"))

upgrade(["annihilator", "blower"], "wiperAR")
