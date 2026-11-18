const { makeAuto, makeTurret } = require("../facilitators.js")

Class.gunnerAutoSmasherTurret = makeTurret("gunner", { label: "Turret", fov: 0.8 })

Class.gunnerAutoSmasher = makeAuto("smasher", "Gunner Auto-Smasher", { type: "gunnerAutoSmasherTurret", size: 12 })
Class.gunnerAutoSmasher.SKILL_CAP = Class.autoSmasher.SKILL_CAP
Class.gunnerAutoSmasher.DMCA_CENSOR_NAME = false
Class.gunnerAutoSmasher.DMCA_CENSOR_DESIGN = false

upgrade(["autoSmasher"], "gunnerAutoSmasher")
