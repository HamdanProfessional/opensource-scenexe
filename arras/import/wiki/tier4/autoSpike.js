const { makeAuto, makeTurret } = require("../facilitators.js")

Class.autoSpikeTurret = makeTurret("twin", { label: "Turret", fov: 0.8 })

Class.autoSpike = makeAuto("spike", "Auto-Spike", { type: "autoSpikeTurret", size: 11 })
Class.autoSpike.SKILL_CAP = Class.autoSmasher.SKILL_CAP
Class.autoSpike.DMCA_CENSOR_NAME = false
Class.autoSpike.DMCA_CENSOR_DESIGN = false

upgrade(["spike"], "autoSpike")
