const { makeAuto } = require("../facilitators.js")

Class.autoVolleyAR = {
    ...makeAuto("volley", "Auto-Volley"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["autoGunner", "volley"], "autoVolleyAR")
