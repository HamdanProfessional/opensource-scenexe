const { makeFlank } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.hexaHealerAR = makeFlank(Class.healerAR, 6, "Hexa-Healer", { extraStats: [g.flankGuard] })

upgrade(["triHealerAR"], "hexaHealerAR")
