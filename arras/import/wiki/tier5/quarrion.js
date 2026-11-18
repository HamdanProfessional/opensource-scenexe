const { statnames } = require("../constants.js")
const { combineStats, makeBird } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.quarrion = makeBird({
    PARENT: "genericTank",
    LABEL: "Quarrion",
    DANGER: 7,
    STAT_NAMES: statnames.mixed,
    GUNS: [
        {
            POSITION: { LENGTH: 21, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pen, g.machineGun]), TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 15, WIDTH: 9, ASPECT: 1.4 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 13, ASPECT: 1.3, X: 15 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trapSpray, g.machineGun, { size: 2 / 3, spray: 5 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}, "Quarrion")
upgrade(["cockatiel", "encircler"], "quarrion")
