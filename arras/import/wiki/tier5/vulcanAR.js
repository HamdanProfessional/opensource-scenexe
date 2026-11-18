const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

const nail = combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, { size: 0.55, reload: 0.8 }])

Class.vulcanAR = {
    PARENT: "genericTank",
    LABEL: "Vulcan",
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.1,
        SPEED: base.SPEED * 14 / 15
    },
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 18, WIDTH: 2.5, Y: -6.5, DELAY: 0.8 },
                PROPERTIES: { SHOOT_SETTINGS: nail, TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 20, WIDTH: 2.5, Y: -3.25, DELAY: 0.6 },
                PROPERTIES: { SHOOT_SETTINGS: nail, TYPE: "bullet" }
            }
        ]),
        {
            POSITION: { LENGTH: 22, WIDTH: 2.5, DELAY: 0.4 },
            PROPERTIES: { SHOOT_SETTINGS: nail, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 5.5, WIDTH: 9, ASPECT: -1.8, X: 6.5 }
        }
    ]
}

upgrade(["nailgun"], "vulcanAR")
