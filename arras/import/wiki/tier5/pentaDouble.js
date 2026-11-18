const { makeFlank } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.pentaDouble = {
    ...makeFlank("pentaShot", 2, "Penta Double", { extraStats: [g.doubleTwin], danger: 8 }),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["bentDouble","pentaShot"], "pentaDouble")
