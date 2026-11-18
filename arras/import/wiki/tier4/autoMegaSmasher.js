const { makeAuto } = require("../facilitators.js")

Class.autoMegaSmasher = makeAuto("megaSmasher", "Auto-Mega Smasher", { type: "autoSmasherTurret", size: 12 })
Class.autoMegaSmasher.SKILL_CAP = Class.autoSmasher.SKILL_CAP
Class.autoMegaSmasher.DMCA_CENSOR_NAME = false
Class.autoMegaSmasher.DMCA_CENSOR_DESIGN = false

upgrade(["megaSmasher"], "autoMegaSmasher")
