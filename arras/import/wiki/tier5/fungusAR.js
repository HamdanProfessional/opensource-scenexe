const { combineStats, weaponMirror } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

const trap = combineStats([g.trap, g.twin, g.spreadshot, { size: 0.8 }])

Class.fungusAR = {
    PARENT: "genericTank",
    LABEL: "Fungus",
    STAT_NAMES: statnames.trap,
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 11, WIDTH: 5, Y: 1, ANGLE: 65 }
            },
            {
                POSITION: { LENGTH: 2.5, WIDTH: 5, ASPECT: 1.7, X: 10, Y: 1, ANGLE: 65, DELAY: 5 / 6 },
                PROPERTIES: { SHOOT_SETTINGS: trap, TYPE: "trap", STAT_CALCULATOR: "trap" }
            },
            {
                POSITION: { LENGTH: 13, WIDTH: 5, Y: 1.2, ANGLE: 45 }
            },
            {
                POSITION: { LENGTH: 2.5, WIDTH: 5, ASPECT: 1.7, X: 12, Y: 1.2, ANGLE: 45, DELAY: 0.5 },
                PROPERTIES: { SHOOT_SETTINGS: trap, TYPE: "trap", STAT_CALCULATOR: "trap" }
            },
            {
                POSITION: { LENGTH: 15, WIDTH: 5, Y: 1.4, ANGLE: 25 }
            },
            {
                POSITION: { LENGTH: 2.5, WIDTH: 5, ASPECT: 1.7, X: 14, Y: 1.4, ANGLE: 25, DELAY: 1 / 6 },
                PROPERTIES: { SHOOT_SETTINGS: trap, TYPE: "trap", STAT_CALCULATOR: "trap" }
            }
        ]),
        {
            POSITION: { LENGTH: 18, WIDTH: 8 }
        },
        {
            POSITION: { LENGTH: 3.25, WIDTH: 8, ASPECT: 1.7, X: 17 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.spreadshot]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}

upgrade(["spreadshot", "waarrk"], "fungusAR")
