const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

const nail = combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, { size: 2 / 3 }])

Class.licker = {
    PARENT: "genericTank",
    LABEL: "Licker",
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.15,
        SPEED: base.SPEED * 14 / 15
    },
    GUNS: [
        {
            POSITION: { LENGTH: 21, WIDTH: 14 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]),
                TYPE: "bullet"
            }
        },
        ...weaponMirror({
            POSITION: { LENGTH: 19, WIDTH: 3, Y: -2, ANGLE: 180, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: nail, TYPE: "bullet" }
        }, { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 20, WIDTH: 2, ANGLE: 180 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun]), TYPE: "bullet" }
        }
    ]
}

upgrade(["nailgun", "blower"], "licker")
