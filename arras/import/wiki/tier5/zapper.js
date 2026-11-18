const { makeBird } = require("../facilitators.js")

Class.zapper = {
    ...makeBird("minigun", "Zapper", { super: true }),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false,
    DANGER: 8
}

upgrade(["taser", "booster"], "zapper")
