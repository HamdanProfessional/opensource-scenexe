const { dereference, combineStats } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

Class.hatcherAR = {
    PARENT: "genericTank",
    LABEL: "Hatcher",
    STAT_NAMES: statnames.drone,
    DANGER: 8,
    GUNS: [
        ...dereference(Class.tripleShot).GUNS,
        {
            POSITION: { LENGTH: 10, WIDTH: 9, ANGLE: 180 }
        },
        {
            POSITION: { LENGTH: 1.5, WIDTH: 11, X: 10, ANGLE: 180 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.minion, { size: 0.8 }]),
                TYPE: "minion",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 3
            }
        },
        {
            POSITION: { LENGTH: 6, WIDTH: 11, ANGLE: 180 }
        }
    ]
}

upgrade(["bentHybrid"], "hatcherAR")
