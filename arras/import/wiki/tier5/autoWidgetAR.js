const { makeAuto } = require("../facilitators.js")

Class.autoWidgetAR = {
    ...makeAuto("widget", "Auto-Widget"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["autoMinigun", "widget"], "autoWidgetAR")
