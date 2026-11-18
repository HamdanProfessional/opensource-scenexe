const { dereference } = require("../facilitators.js")

const ghost = {
    INVISIBLE: [0.08, 0.03],
    TOOLTIP: "Stay still to turn invisible.",
    DMCA_CENSOR_NAME: undefined,
    DMCA_CENSOR_DESIGN: undefined
}

Class.eradicator = {
    ...dereference("annihilator"),
    LABEL: "Eradicator",
    DANGER: 8,
    ...ghost
}

upgrade(["annihilator", "slinker"], "eradicator")
