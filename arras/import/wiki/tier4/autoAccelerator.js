const { makeAuto } = require("../facilitators.js")

Class.autoAccelerator = makeAuto("accelerator", "Auto-Accelerator", { type: "autoSmasherTurret", size: 11 })
Class.autoAccelerator.SKILL_CAP = Class.autoSmasher.SKILL_CAP
Class.autoAccelerator.DMCA_CENSOR_NAME = false
Class.autoAccelerator.DMCA_CENSOR_DESIGN = false

upgrade(["accelerator"], "autoAccelerator")
