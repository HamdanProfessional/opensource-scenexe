const { makeFlank } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.chemistAR = makeFlank(Class.scientistAR, 3, "Chemist", { extraStats: [g.flankGuard] })

upgrade(["scientistAR", "triHealerAR"], "chemistAR")
