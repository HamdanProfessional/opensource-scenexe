const { combineStats, weaponMirror } = require("../facilitators.js")
const { base, statnames } = require("../constants.js")
const g = require("../gunvals.js")

const front = combineStats([g.basic, g.flankGuard, g.flankGuard, g.twin, g.sniper, { range: 1.2 }])
const trap = combineStats([g.trap, g.twin])

Class.thrasher = {
    PARENT: "genericTank",
    LABEL: "Thrasher",
    STAT_NAMES: statnames.mixed,
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.15
    },
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 22, WIDTH: 6.5, Y: 6.5 },
                PROPERTIES: { SHOOT_SETTINGS: front, TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 14, WIDTH: 6.5, Y: 6.5, ANGLE: 185 }
            },
            {
                POSITION: { LENGTH: 3, WIDTH: 6.5, ASPECT: 1.7, X: 13, Y: 6.5, ANGLE: 185 },
                PROPERTIES: { SHOOT_SETTINGS: trap, TYPE: "trap", STAT_CALCULATOR: "trap" }
            }
        ], { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 25, WIDTH: 6.5, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: front, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 14, WIDTH: 6.5, ANGLE: 180 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 6.5, ASPECT: 1.7, X: 13, ANGLE: 180, DELAY: 0.75 },
            PROPERTIES: { SHOOT_SETTINGS: trap, TYPE: "trap", STAT_CALCULATOR: "trap" }
        }
    ]
}

upgrade(["bulwark", "bushwhacker"], "thrasher")
