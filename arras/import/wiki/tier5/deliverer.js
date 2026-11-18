const { dereference } = require("../facilitators.js")

const ghost = {
    INVISIBLE: [0.08, 0.03],
    TOOLTIP: "Stay still to turn invisible.",
    DMCA_CENSOR_NAME: undefined,
    DMCA_CENSOR_DESIGN: undefined
}

Class.deliverer = {
    ...dereference("hurler"),
    LABEL: "Deliverer",
    DANGER: 8,
    ...ghost
}

upgrade(["hurler", "slinker"], "deliverer")
