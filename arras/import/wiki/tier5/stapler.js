const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

const nail = combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, { size: 2 / 3 }])

Class.stapler = {
    PARENT: "genericTank",
    LABEL: "Stapler",
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.15,
        SPEED: base.SPEED * 14 / 15
    },
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 15, WIDTH: 3, Y: -6, DELAY: 0.5 },
                PROPERTIES: { SHOOT_SETTINGS: nail, TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 19, WIDTH: 3, Y: -3, DELAY: 0.25 },
                PROPERTIES: { SHOOT_SETTINGS: nail, TYPE: "bullet" }
            }
        ], { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 22, WIDTH: 3 },
            PROPERTIES: { SHOOT_SETTINGS: nail, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 5.5, WIDTH: 8, ASPECT: -1.8, X: 6.5 }
        }
    ]
}

upgrade(["streamliner", "nailgun", "battery"], "stapler")
