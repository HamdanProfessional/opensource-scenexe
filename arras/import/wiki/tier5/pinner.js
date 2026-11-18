const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

const nail = combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, { size: 2 / 3 }])

Class.pinner = {
    PARENT: "genericTank",
    LABEL: "Pinner",
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.15,
        SPEED: base.SPEED * 14 / 15
    },
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 12, WIDTH: 7, Y: 7.5, DELAY: 0.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2, size: 2 / 3 }]),
                TYPE: "bullet"
            }
        }, { delayIncrement: 0.5 }),
        ...weaponMirror({
            POSITION: { LENGTH: 19, WIDTH: 3, Y: -2, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: nail, TYPE: "bullet" }
        }, { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 22, WIDTH: 2 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, { speed: 1.4, maxSpeed: 1.4 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: { LENGTH: 5.5, WIDTH: 7, ASPECT: -1.8, X: 6.5 }
        }
    ]
}

upgrade(["nailgun", "rimfire"], "pinner")
