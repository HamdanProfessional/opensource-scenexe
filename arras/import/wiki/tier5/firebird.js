const { makeBird } = require("../facilitators.js")

Class.firebird = {
    ...makeBird("redistributor", "Firebird"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false,
    DANGER: 8
}

upgrade(["redistributor", "phoenix"], "firebird")
