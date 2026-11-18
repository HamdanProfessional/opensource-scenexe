const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base, statnames } = require("../constants.js")

const nail = combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, { size: 2 / 3 }])

Class.tacker = {
    PARENT: "genericTank",
    LABEL: "Tacker",
    DANGER: 8,
    STAT_NAMES: statnames.mixed,
    BODY: {
        FOV: base.FOV * 1.15,
        SPEED: base.SPEED * 14 / 15
    },
    GUNS: [
        {
            POSITION: { LENGTH: 13, WIDTH: 11, ANGLE: 180 }
        },
        {
            POSITION: { LENGTH: 4, WIDTH: 11, ASPECT: 1.7, X: 13, ANGLE: 180 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { speed: 1.2 }, { recoil: 0.5 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        },
        ...weaponMirror({
            POSITION: { LENGTH: 19, WIDTH: 3, Y: -2, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: nail, TYPE: "bullet" }
        }, { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 20, WIDTH: 2 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun]), TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 5.5, WIDTH: 7, ASPECT: -1.8, X: 6.5 }
        }
    ]
}

upgrade(["nailgun", "gunnerTrapper"], "tacker")
