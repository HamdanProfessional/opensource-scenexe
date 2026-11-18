const { makeAuto } = require("../facilitators.js")

Class.autoPolluter = {
    ...makeAuto("polluter", "Auto-Polluter"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["polluter", "autoDiesel"], "autoPolluter")
