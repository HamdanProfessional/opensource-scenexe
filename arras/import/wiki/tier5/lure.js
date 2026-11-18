const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base, statnames } = require("../constants.js")

const pellet = combineStats([g.basic, g.pelleter, g.power, g.twin, { recoil: 4 }, { recoil: 1.8 }])
const trapShot = combineStats([g.trap, { speed: 1.2 }, { recoil: 0.5 }])

Class.lure = {
    PARENT: "genericTank",
    LABEL: "Lure",
    DANGER: 8,
    STAT_NAMES: statnames.mixed,
    BODY: {
        FOV: base.FOV * 1.25
    },
    GUNS: [
        {
            POSITION: { LENGTH: 13, WIDTH: 11, ANGLE: 180 }
        },
        {
            POSITION: { LENGTH: 4, WIDTH: 11, ASPECT: 1.7, X: 13, ANGLE: 180 },
            PROPERTIES: { SHOOT_SETTINGS: trapShot, TYPE: "trap", STAT_CALCULATOR: "trap" }
        },
        ...weaponMirror([
            {
                POSITION: { LENGTH: 19, WIDTH: 2, Y: -2.5 },
                PROPERTIES: { SHOOT_SETTINGS: pellet, TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 12, WIDTH: 6, Y: 6.5, DELAY: 0.5 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2, size: 2 / 3 }]),
                    TYPE: "bullet"
                }
            }
        ], { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 12, WIDTH: 11 }
        }
    ]
}

upgrade(["gunnerTrapper", "rimfire"], "lure")
