const { combineStats, weaponMirror } = require("../facilitators.js")
const { base, statnames } = require("../constants.js")
const g = require("../gunvals.js")

const front = combineStats([g.basic, g.flankGuard, g.flankGuard, g.twin])
const trap = combineStats([g.trap, g.twin])

Class.striker = {
    PARENT: "genericTank",
    LABEL: "Striker",
    STAT_NAMES: statnames.mixed,
    DANGER: 8,
    BODY: {
        DENSITY: base.DENSITY * 0.6
    },
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
                POSITION: { LENGTH: 16, WIDTH: 7, ANGLE: 150, DELAY: 0.1 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                    TYPE: "bullet",
                    LABEL: "Thruster"
                }
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

upgrade(["bulwark", "bomber"], "striker")
