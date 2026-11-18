const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.barrage = {
    PARENT: "genericTank",
    LABEL: "Barrage",
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.1
    },
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 12, WIDTH: 8, Y: 5, DELAY: 0.25 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.twin, g.gunner, { speed: 1.2, size: 0.8 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: { LENGTH: 18, WIDTH: 2, X: 2, Y: -2.5 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
                    TYPE: "bullet"
                }
            }
        ], { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 12, WIDTH: 10, X: 2 }
        }
    ]
}

upgrade(["rimfire", "volley"], "barrage")
