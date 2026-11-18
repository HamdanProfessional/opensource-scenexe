const { makeAuto, makeTurret } = require("../facilitators.js")

Class.autoLandmineTurret = makeTurret("twin", { label: "Turret", fov: 0.8 })

Class.autoLandmine = makeAuto("landmine", "Auto-Landmine", { type: "autoLandmineTurret", size: 11 })
Class.autoLandmine.SKILL_CAP = Class.autoSmasher.SKILL_CAP
Class.autoLandmine.DMCA_CENSOR_NAME = false
Class.autoLandmine.DMCA_CENSOR_DESIGN = false

upgrade(["landmine"], "autoLandmine")
