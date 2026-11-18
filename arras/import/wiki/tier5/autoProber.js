const { makeAuto } = require("../facilitators.js")

Class.autoProberAR = makeAuto("prober", "Auto-Prober")
Class.autoProberAR.DMCA_CENSOR_NAME = false
Class.autoProberAR.DMCA_CENSOR_DESIGN = false
upgrade(["autoHunter", "prober", "autoRifle"], "autoProberAR")
