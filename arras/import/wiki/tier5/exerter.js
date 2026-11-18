const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.exerter = {
    PARENT: "genericTank",
    LABEL: "Exerter",
    DANGER: 8,
    GUNS: [
        {
            POSITION: { LENGTH: 21, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pen]), TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 15, WIDTH: 9, ASPECT: 1.4 }
        },
        {
            POSITION: { LENGTH: 12, WIDTH: 11 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 11, ASPECT: 1.3, X: 15 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trapSpray, g.machineGun, { size: 2 / 3, spray: 5 }]),
                TYPE: "autoTrap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}

upgrade(["encircler", "operator", "machineMech"], "exerter")
