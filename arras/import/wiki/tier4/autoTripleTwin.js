const { makeAuto } = require("../facilitators.js")

Class.autoTripleTwin = {
    ...makeAuto("tripleTwin", "Auto-Triple Twin"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["tripleTwin", "autoDouble"], "autoTripleTwin")
