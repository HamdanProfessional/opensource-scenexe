const { combineStats, weaponMirror } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

const big = combineStats([g.trap, g.twin, g.tripleShot])
const small = combineStats([g.trap, g.twin, g.tripleShot, { size: 0.6 }])

Class.splinterShot = {
    PARENT: "genericTank",
    LABEL: "Splinter Shot",
    STAT_NAMES: statnames.trap,
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 16, WIDTH: 8, Y: 2, ANGLE: 18 }
            },
            {
                POSITION: { LENGTH: 3.25, WIDTH: 8, ASPECT: 1.7, X: 15, Y: 2, ANGLE: 18, DELAY: 0.5 },
                PROPERTIES: { SHOOT_SETTINGS: big, TYPE: "trap", STAT_CALCULATOR: "trap" }
            },
            {
                POSITION: { LENGTH: 16, WIDTH: 4, Y: 0.5, ANGLE: 8 }
            },
            {
                POSITION: { LENGTH: 2, WIDTH: 4, ASPECT: 1.7, X: 15, Y: 0.5, ANGLE: 8, DELAY: 0.25 },
                PROPERTIES: { SHOOT_SETTINGS: small, TYPE: "trap", STAT_CALCULATOR: "trap" }
            }
        ]),
        {
            POSITION: { LENGTH: 18, WIDTH: 8 }
        },
        {
            POSITION: { LENGTH: 3.25, WIDTH: 8, ASPECT: 1.7, X: 17 },
            PROPERTIES: { SHOOT_SETTINGS: big, TYPE: "trap", STAT_CALCULATOR: "trap" }
        }
    ]
}

upgrade(["splitShot", "waarrk"], "splinterShot")
