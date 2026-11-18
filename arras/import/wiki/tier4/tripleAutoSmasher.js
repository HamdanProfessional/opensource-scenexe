const { makeAuto } = require("../facilitators.js")

Class.tripleAutoSmasher = makeAuto("smasher", "Triple Auto-Smasher", { type: "autoSmasherTurret", size: 9, total: 3, x: 9 })
Class.tripleAutoSmasher.SKILL_CAP = Class.autoSmasher.SKILL_CAP
Class.tripleAutoSmasher.DMCA_CENSOR_NAME = false
Class.tripleAutoSmasher.DMCA_CENSOR_DESIGN = false

upgrade(["autoSmasher"], "tripleAutoSmasher")
