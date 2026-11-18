const { makeCap } = require("../facilitators.js")

Class.spiritz = {
    ...makeCap("sprayer", "Spiritz", { count: 1 }),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false,
    DANGER: 8
}

upgrade(["shower"], "spiritz")
