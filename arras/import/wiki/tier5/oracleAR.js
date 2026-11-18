const { makeOver } = require("../facilitators.js")

Class.oracleAR = {
    ...makeOver("gunnerTrapper", "Oracle", { maxDrones: 3 }),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false,
    DANGER: 8
}

upgrade(["gunnerTrapper", "overgunner"], "oracleAR")
