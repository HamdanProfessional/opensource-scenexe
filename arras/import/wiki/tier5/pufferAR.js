const { makeGunner } = require("../facilitators.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.pufferAR = uncensored(makeGunner("hybrid", "Puffer", { renderBehind: true }))

upgrade(["hybrid", "blower"], "pufferAR")
