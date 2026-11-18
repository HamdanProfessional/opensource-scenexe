const { combineStats, weaponMirror } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

const front = combineStats([g.basic, g.flankGuard, g.flankGuard, g.twin])
const trap = combineStats([g.trap, g.twin])

Class.quadwark = {
    PARENT: "genericTank",
    LABEL: "Quadwark",
    STAT_NAMES: statnames.mixed,
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 20, WIDTH: 7, Y: 6.5 },
                PROPERTIES: { SHOOT_SETTINGS: front, TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 14, WIDTH: 7, Y: 6.5, ANGLE: 185 }
            },
            {
                POSITION: { LENGTH: 3, WIDTH: 7, ASPECT: 1.7, X: 13, Y: 6.5, ANGLE: 185 },
                PROPERTIES: { SHOOT_SETTINGS: trap, TYPE: "trap", STAT_CALCULATOR: "trap" }
            },
            {
                POSITION: { LENGTH: 14, WIDTH: 7, ANGLE: 90 }
            },
            {
                POSITION: { LENGTH: 3, WIDTH: 7, ASPECT: 1.7, X: 13, ANGLE: 90, DELAY: 0.5 },
                PROPERTIES: { SHOOT_SETTINGS: trap, TYPE: "trap", STAT_CALCULATOR: "trap" }
            }
        ], { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 22, WIDTH: 7, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: front, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 14, WIDTH: 7, ANGLE: 180 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 7, ASPECT: 1.7, X: 13, ANGLE: 180, DELAY: 0.75 },
            PROPERTIES: { SHOOT_SETTINGS: trap, TYPE: "trap", STAT_CALCULATOR: "trap" }
        }
    ]
}

upgrade(["bulwark", "triTrapGuard"], "quadwark")
