const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

const pellet = combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }])

Class.walloper = {
    PARENT: "genericTank",
    LABEL: "Walloper",
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.1
    },
    GUNS: [
        {
            POSITION: { LENGTH: 21, WIDTH: 14 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]),
                TYPE: "bullet"
            }
        },
        ...weaponMirror([
            {
                POSITION: { LENGTH: 12, WIDTH: 7, Y: 8, DELAY: 0.25 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2, size: 2 / 3 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: { LENGTH: 18, WIDTH: 2, X: 2, Y: -2.5 },
                PROPERTIES: { SHOOT_SETTINGS: pellet, TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 16, WIDTH: 2, X: 2, Y: -5.5, DELAY: 0.5 },
                PROPERTIES: { SHOOT_SETTINGS: pellet, TYPE: "bullet" }
            }
        ], { delayIncrement: 0.5 })
    ]
}

upgrade(["rimfire", "blower"], "walloper")
