const { makeAuto } = require("../facilitators.js")

const uncensored = tank => ({ ...tank, DMCA_CENSOR_NAME: undefined, DMCA_CENSOR_DESIGN: undefined })

Class.autoBeekeeper = uncensored(makeAuto("beekeeper", "Auto-Beekeeper"))

upgrade(["beekeeper", "autoArtillery"], "autoBeekeeper")
