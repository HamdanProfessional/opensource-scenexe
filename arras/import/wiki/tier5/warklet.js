const { combineStats, weaponMirror } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

const trap = combineStats([g.trap, g.twin, g.triplet])

Class.warklet = {
    PARENT: "genericTank",
    LABEL: "Warklet",
    STAT_NAMES: statnames.trap,
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 15, WIDTH: 8, Y: 5.5 }
            },
            {
                POSITION: { LENGTH: 3.25, WIDTH: 8, ASPECT: 1.7, X: 14, Y: 5.5, DELAY: 0.5 },
                PROPERTIES: { SHOOT_SETTINGS: trap, TYPE: "trap", STAT_CALCULATOR: "trap" }
            }
        ]),
        {
            POSITION: { LENGTH: 18, WIDTH: 8 }
        },
        {
            POSITION: { LENGTH: 3.25, WIDTH: 8, ASPECT: 1.7, X: 17 },
            PROPERTIES: { SHOOT_SETTINGS: trap, TYPE: "trap", STAT_CALCULATOR: "trap" }
        }
    ]
}

upgrade(["triplet", "waarrk"], "warklet")
