const { makeGunner } = require("../facilitators.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.zephyrAR = uncensored(makeGunner("slinker", "Zephyr"))

upgrade(["blower", "slinker"], "zephyrAR")
