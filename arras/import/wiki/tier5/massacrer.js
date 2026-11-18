const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const destroyerShot = combineStats([g.basic, g.pounder, g.destroyer])
const blockShot = combineStats([g.trap, g.setTrap])
const blockLauncher = (width, shot = blockShot, type = "setTrap", angle = 0) => [
    { POSITION: { LENGTH: 18, WIDTH: width, ANGLE: angle } },
    {
        POSITION: { LENGTH: 2, WIDTH: width, ASPECT: 1.1, X: 18, ANGLE: angle },
        PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: type, STAT_CALCULATOR: "block" }
    }
]
const ghost = {
    INVISIBLE: [0.08, 0.03],
    TOOLTIP: "Stay still to turn invisible.",
    DMCA_CENSOR_NAME: undefined,
    DMCA_CENSOR_DESIGN: undefined
}

Class.massacrer = {
    PARENT: "genericTank",
    LABEL: "Massacrer",
    DANGER: 8,
    BODY: Class.conqueror.BODY,
    ...ghost,
    GUNS: [
        {
            POSITION: { LENGTH: 20.5, WIDTH: 14, ASPECT: -1.2, ANGLE: 180 },
            PROPERTIES: { SHOOT_SETTINGS: destroyerShot, TYPE: "bullet" }
        },
        ...blockLauncher(12)
    ]
}

upgrade(["slinker"], "massacrer")
