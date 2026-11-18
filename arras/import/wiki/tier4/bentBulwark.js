const { combineStats, weaponMirror } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

const front = combineStats([g.basic, g.flankGuard, g.flankGuard, g.twin, g.tripleShot])
const trap = combineStats([g.trap, g.twin, g.tripleShot])

Class.bentBulwark = {
    PARENT: "genericTank",
    LABEL: "Bent Bulwark",
    STAT_NAMES: statnames.mixed,
    DANGER: 8,
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 19, WIDTH: 8, Y: 2, ANGLE: 18, DELAY: 0.5 },
            PROPERTIES: { SHOOT_SETTINGS: front, TYPE: "bullet" }
        }),
        {
            POSITION: { LENGTH: 22, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: front, TYPE: "bullet" }
        },
        ...weaponMirror([
            {
                POSITION: { LENGTH: 15, WIDTH: 8, Y: 5.5, ANGLE: 185 }
            },
            {
                POSITION: { LENGTH: 3.25, WIDTH: 8, ASPECT: 1.7, X: 14, Y: 5.5, ANGLE: 185 },
                PROPERTIES: { SHOOT_SETTINGS: trap, TYPE: "trap", STAT_CALCULATOR: "trap" }
            }
        ], { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 17, WIDTH: 8, ANGLE: 180 }
        },
        {
            POSITION: { LENGTH: 3.25, WIDTH: 8, ASPECT: 1.7, X: 16, ANGLE: 180, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: trap, TYPE: "trap", STAT_CALCULATOR: "trap" }
        }
    ]
}

upgrade(["waarrk", "tripleShot", "bulwark"], "bentBulwark")
