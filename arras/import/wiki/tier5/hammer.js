const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

const nail = combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, { size: 2 / 3, reload: 0.7, spray: 2.5 }])

Class.hammer = {
    PARENT: "genericTank",
    LABEL: "Hammer",
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.1,
        SPEED: base.SPEED * 14 / 15
    },
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 19, WIDTH: 3, Y: -2, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: nail, TYPE: "bullet" }
        }, { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 20, WIDTH: 2 },
            PROPERTIES: { SHOOT_SETTINGS: nail, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 5.5, WIDTH: 7, ASPECT: -1.8, X: 6.5 }
        }
    ]
}

upgrade(["nailgun", "widget"], "hammer")
