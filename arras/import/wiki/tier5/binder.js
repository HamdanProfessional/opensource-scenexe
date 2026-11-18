const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base, statnames } = require("../constants.js")

const trapShot = combineStats([g.trap, g.twin, g.nailgun, { speed: 1.2 }])

Class.binder = {
    PARENT: "genericTank",
    LABEL: "Binder",
    DANGER: 8,
    STAT_NAMES: statnames.trap,
    BODY: {
        FOV: base.FOV * 1.1,
        SPEED: base.SPEED * 14 / 15
    },
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 17, WIDTH: 3.5, Y: -3.25 }
            },
            {
                POSITION: { LENGTH: 2, WIDTH: 3.5, ASPECT: 1.77, X: 17, Y: -3.25, DELAY: 0.25 },
                PROPERTIES: { SHOOT_SETTINGS: trapShot, TYPE: "trap", STAT_CALCULATOR: "trap" }
            }
        ], { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 20, WIDTH: 3 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 3, ASPECT: 1.77, X: 20 },
            PROPERTIES: { SHOOT_SETTINGS: trapShot, TYPE: "trap", STAT_CALCULATOR: "trap" }
        },
        {
            POSITION: { LENGTH: 5.5, WIDTH: 7, ASPECT: -1.8, X: 6.5 }
        }
    ]
}

upgrade(["nailgun", "equalizer"], "binder")
