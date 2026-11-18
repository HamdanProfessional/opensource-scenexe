const { makeFlank } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.triHealerAR = makeFlank(Class.healerAR, 3, "Tri-Healer", { extraStats: [g.flankGuard] })

upgrade(["healerAR"], "triHealerAR")
