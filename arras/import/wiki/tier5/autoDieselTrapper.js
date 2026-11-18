const { makeAuto } = require("../facilitators.js")

Class.autoDieselTrapper = {
    ...makeAuto("dieselTrapper", "Auto-Diesel Trapper"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["autoDiesel", "dieselTrapper", "autoMachineTrapper"], "autoDieselTrapper")
