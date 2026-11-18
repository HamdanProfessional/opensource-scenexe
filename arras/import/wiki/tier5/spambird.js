const { makeOver } = require("../facilitators.js")

Class.spambird = {
    ...makeOver("bentGunner", "Spambird", { count: 1, independent: true, maxDrones: 3 }),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["bentGunner"], "spambird")
