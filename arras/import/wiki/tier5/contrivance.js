const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { statnames } = require("../constants.js")

const trapShot = combineStats([g.trap, g.twin, g.gunner, { speed: 1.2, reload: 0.8 }])

Class.contrivance = {
    PARENT: "genericTank",
    LABEL: "Contrivance",
    DANGER: 8,
    STAT_NAMES: statnames.trap,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 11, WIDTH: 3.5, ASPECT: 2, X: -3, Y: 6.5 }
            },
            {
                POSITION: { LENGTH: 2, WIDTH: 3.5, ASPECT: 1.77, X: 8, Y: 6.5, DELAY: 0.6 },
                PROPERTIES: { SHOOT_SETTINGS: trapShot, TYPE: "trap", STAT_CALCULATOR: "trap" }
            },
            {
                POSITION: { LENGTH: 14, WIDTH: 3.5, ASPECT: 2, Y: 3.25 }
            },
            {
                POSITION: { LENGTH: 2, WIDTH: 3.5, ASPECT: 1.77, X: 14, Y: 3.25, DELAY: 0.2 },
                PROPERTIES: { SHOOT_SETTINGS: trapShot, TYPE: "trap", STAT_CALCULATOR: "trap" }
            }
        ], { delayIncrement: 0.2 }),
        {
            POSITION: { LENGTH: 17, WIDTH: 3.5, ASPECT: 2, X: 3 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 3.5, ASPECT: 1.77, X: 20 },
            PROPERTIES: { SHOOT_SETTINGS: trapShot, TYPE: "trap", STAT_CALCULATOR: "trap" }
        }
    ]
}

upgrade(["machineGunner", "equalizer", "expeller"], "contrivance")
