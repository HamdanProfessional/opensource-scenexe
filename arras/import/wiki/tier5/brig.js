const { combineStats, weaponMirror } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

const shot = combineStats([g.basic, g.pen, g.twin, g.tripleShot])
const trap = combineStats([g.trap, g.twin, g.tripleShot])

Class.brig = {
    PARENT: "genericTank",
    LABEL: "Brig",
    STAT_NAMES: statnames.trap,
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 19, WIDTH: 5, Y: 4.5, ANGLE: 18 },
                PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 15, WIDTH: 7, Y: 2, ANGLE: 18 }
            },
            {
                POSITION: { LENGTH: 3.25, WIDTH: 7, ASPECT: 1.7, X: 14, Y: 2, ANGLE: 18, DELAY: 0.5 },
                PROPERTIES: { SHOOT_SETTINGS: trap, TYPE: "trap", STAT_CALCULATOR: "trap" }
            }
        ]),
        ...weaponMirror({
            POSITION: { LENGTH: 21, WIDTH: 5, Y: 4.5, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        }),
        {
            POSITION: { LENGTH: 17, WIDTH: 7 }
        },
        {
            POSITION: { LENGTH: 3.25, WIDTH: 7, ASPECT: 1.7, X: 16 },
            PROPERTIES: { SHOOT_SETTINGS: trap, TYPE: "trap", STAT_CALCULATOR: "trap" }
        }
    ]
}

upgrade(["waarrk", "hutch"], "brig")
