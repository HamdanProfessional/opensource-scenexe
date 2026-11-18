const { dereference } = require("../facilitators.js")

const ghost = {
    INVISIBLE: [0.08, 0.03],
    TOOLTIP: "Stay still to turn invisible.",
    DMCA_CENSOR_NAME: undefined,
    DMCA_CENSOR_DESIGN: undefined
}

Class.petrifier = {
    ...dereference("shotgun"),
    LABEL: "Petrifier",
    DANGER: 7,
    ...ghost
}

upgrade(["shotgun"], "petrifier")
