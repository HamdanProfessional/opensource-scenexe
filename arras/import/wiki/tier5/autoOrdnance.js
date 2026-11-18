const { makeAuto } = require("../facilitators.js")

Class.autoOrdnanceAR = makeAuto("ordnance", "Auto-Ordnance")
Class.autoOrdnanceAR.DMCA_CENSOR_NAME = false
Class.autoOrdnanceAR.DMCA_CENSOR_DESIGN = false
upgrade(["ordnance", "autoHunter", "autoArtillery"], "autoOrdnanceAR")
