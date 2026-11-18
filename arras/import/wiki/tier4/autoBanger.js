const { makeAuto, makeTurret } = require("../facilitators.js")

Class.autoBangerTurret = makeTurret("twin", { label: "Turret", fov: 0.8 })

Class.autoBanger = makeAuto("banger", "Auto-Banger", { type: "autoBangerTurret", size: 11 })
Class.autoBanger.SKILL_CAP = Class.autoSmasher.SKILL_CAP
Class.autoBanger.DMCA_CENSOR_NAME = false
Class.autoBanger.DMCA_CENSOR_DESIGN = false

upgrade(["banger"], "autoBanger")
