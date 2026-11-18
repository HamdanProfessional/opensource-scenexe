const { makeAuto, makeTurret } = require("../facilitators.js")

Class.autoBonkerTurret = makeTurret("twin", { label: "Turret", fov: 0.8 })

Class.autoBonker = makeAuto("bonker", "Auto-Bonker", { type: "autoBonkerTurret", size: 11 })
Class.autoBonker.SKILL_CAP = Class.autoSmasher.SKILL_CAP
Class.autoBonker.DMCA_CENSOR_NAME = false
Class.autoBonker.DMCA_CENSOR_DESIGN = false

upgrade(["bonker"], "autoBonker")
