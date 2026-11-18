const { makeBird } = require("../facilitators.js")

Class.electrocutor = {
    ...makeBird("barricade", "Electrocutor"),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false,
    DANGER: 8
}

upgrade(["taser", "barricade"], "electrocutor")
