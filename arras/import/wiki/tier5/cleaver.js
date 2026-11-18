const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base, statnames } = require("../constants.js")

const pellet = combineStats([g.basic, g.pelleter, g.power, g.twin, { recoil: 4 }, { recoil: 1.8 }])
const trapShot = combineStats([g.trap, { speed: 1.2 }, { recoil: 0.5 }])

Class.cleaver = {
    PARENT: "genericTank",
    LABEL: "Cleaver",
    DANGER: 8,
    STAT_NAMES: statnames.trap,
    BODY: {
        FOV: base.FOV * 1.15
    },
    GUNS: [
        {
            POSITION: { LENGTH: 13, WIDTH: 12, ANGLE: 180 }
        },
        {
            POSITION: { LENGTH: 4, WIDTH: 12, ASPECT: 1.7, X: 13, ANGLE: 180 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { speed: 1.2, size: 1.2, reload: 1.2 }, { recoil: 0.5 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        },
        ...weaponMirror([
            {
                POSITION: { LENGTH: 12, WIDTH: 3.5, Y: 7.25 }
            },
            {
                POSITION: { LENGTH: 2, WIDTH: 3.5, ASPECT: 1.77, X: 12, Y: 7.25, DELAY: 0.5 },
                PROPERTIES: { SHOOT_SETTINGS: combineStats([trapShot, g.twin, g.gunner]), TYPE: "trap", STAT_CALCULATOR: "trap" }
            },
            {
                POSITION: { LENGTH: 16, WIDTH: 3.5, Y: 3.75 }
            },
            {
                POSITION: { LENGTH: 2, WIDTH: 3.5, ASPECT: 1.77, X: 16, Y: 3.75 },
                PROPERTIES: { SHOOT_SETTINGS: combineStats([trapShot, g.twin, g.gunner]), TYPE: "trap", STAT_CALCULATOR: "trap" }
            }
        ], { delayIncrement: 0.25 })
    ]
}

upgrade(["gunnerTrapper", "equalizer"], "cleaver")
