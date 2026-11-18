const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { statnames } = require("../constants.js")

const trapShot = combineStats([g.trap, g.twin, g.gunner, { speed: 1.2 }])

Class.cutlass = {
    PARENT: "genericTank",
    LABEL: "Cutlass",
    DANGER: 8,
    STAT_NAMES: statnames.trap,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 12, WIDTH: 3.5, Y: 7.25 }
            },
            {
                POSITION: { LENGTH: 2, WIDTH: 3.5, ASPECT: 1.77, X: 12, Y: 7.25, DELAY: 0.6 },
                PROPERTIES: { SHOOT_SETTINGS: trapShot, TYPE: "trap", STAT_CALCULATOR: "trap" }
            },
            {
                POSITION: { LENGTH: 16, WIDTH: 3.5, Y: 3.75 }
            },
            {
                POSITION: { LENGTH: 2, WIDTH: 3.5, ASPECT: 1.77, X: 16, Y: 3.75, DELAY: 0.2 },
                PROPERTIES: { SHOOT_SETTINGS: trapShot, TYPE: "trap", STAT_CALCULATOR: "trap" }
            }
        ], { delayIncrement: 0.2 }),
        {
            POSITION: { LENGTH: 20, WIDTH: 3.5 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 3.5, ASPECT: 1.77, X: 20 },
            PROPERTIES: { SHOOT_SETTINGS: trapShot, TYPE: "trap", STAT_CALCULATOR: "trap" }
        }
    ]
}

upgrade(["battery", "equalizer"], "cutlass")
