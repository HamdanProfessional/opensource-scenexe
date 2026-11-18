const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const blockShot = combineStats([g.trap, g.setTrap])
const megaTrapShot = combineStats([g.trap, g.megaTrap])
const blockLauncher = (width, shot = blockShot, type = "setTrap", angle = 0) => [
    { POSITION: { LENGTH: 18, WIDTH: width, ANGLE: angle } },
    {
        POSITION: { LENGTH: 2, WIDTH: width, ASPECT: 1.1, X: 18, ANGLE: angle },
        PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: type, STAT_CALCULATOR: "block" }
    }
]

Class.pulverizer = {
    PARENT: "genericTank",
    LABEL: "Pulverizer",
    DANGER: 7,
    BODY: Class.conqueror.BODY,
    GUNS: [
        { POSITION: { LENGTH: 14, WIDTH: 12, ANGLE: 180 } },
        {
            POSITION: { LENGTH: 5, WIDTH: 12, ASPECT: 1.7, X: 13, ANGLE: 180 },
            PROPERTIES: { SHOOT_SETTINGS: megaTrapShot, TYPE: "trap", STAT_CALCULATOR: "trap" }
        },
        ...blockLauncher(12)
    ]
}

upgrade(["conqueror", "megaTrapper"], "pulverizer")
