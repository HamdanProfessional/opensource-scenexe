const { makeAuto, makeTurret } = require("../facilitators.js")

Class.autoDrifterTurret = makeTurret("twin", { label: "Turret", fov: 0.8 })

Class.autoDrifter = makeAuto("drifter", "Auto-Drifter", { type: "autoDrifterTurret", size: 11 })
Class.autoDrifter.SKILL_CAP = Class.autoSmasher.SKILL_CAP
Class.autoDrifter.DMCA_CENSOR_NAME = false
Class.autoDrifter.DMCA_CENSOR_DESIGN = false

upgrade(["drifter"], "autoDrifter")
