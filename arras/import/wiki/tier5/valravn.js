const { makeBird } = require("../facilitators.js")

Class.valravn = {
    ...makeBird("sprayer", "Valravn", { bomber: true }),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false,
    DANGER: 8
}

upgrade(["phoenix"], "valravn")
