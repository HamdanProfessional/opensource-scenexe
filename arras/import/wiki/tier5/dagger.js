const { combineStats, weaponMirror } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

const trap = combineStats([g.trap, g.twin, g.gunner, { speed: 1.2 }])

Class.dagger = {
    PARENT: "genericTank",
    LABEL: "Dagger",
    STAT_NAMES: statnames.trap,
    DANGER: 8,
    GUNS: weaponMirror([
        {
            POSITION: { LENGTH: 8, WIDTH: 3.5, Y: 8.25, ANGLE: 18 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 3.5, ASPECT: 1.77, X: 8, Y: 8.25, ANGLE: 18, DELAY: 2 / 3 },
            PROPERTIES: { SHOOT_SETTINGS: trap, TYPE: "trap", STAT_CALCULATOR: "trap" }
        },
        {
            POSITION: { LENGTH: 12, WIDTH: 3.5, Y: 4.75, ANGLE: 18 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 3.5, ASPECT: 1.77, X: 12, Y: 4.75, ANGLE: 18, DELAY: 1 / 3 },
            PROPERTIES: { SHOOT_SETTINGS: trap, TYPE: "trap", STAT_CALCULATOR: "trap" }
        },
        {
            POSITION: { LENGTH: 14, WIDTH: 3.5, Y: 3.75 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 3.5, ASPECT: 1.77, X: 14, Y: 3.75 },
            PROPERTIES: { SHOOT_SETTINGS: trap, TYPE: "trap", STAT_CALCULATOR: "trap" }
        }
    ], { delayIncrement: 1 / 6 })
}

upgrade(["bentGunner", "waarrk", "equalizer"], "dagger")
