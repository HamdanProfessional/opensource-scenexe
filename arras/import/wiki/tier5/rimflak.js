const { combineStats, weaponMirror, weaponStack } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.rimflak = {
    PARENT: "genericTank",
    LABEL: "Rimflak",
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.1
    },
    GUNS: [
        ...weaponMirror(weaponStack({
            POSITION: { LENGTH: 16, WIDTH: 5, Y: 5.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.minigun, { speed: 1.2, size: 0.8 }]),
                TYPE: "bullet"
            }
        }, 3, { lengthOffset: 2, delayIncrement: 1 / 3 }), { delayIncrement: 0.5 }),
        ...weaponMirror({
            POSITION: { LENGTH: 18, WIDTH: 2, X: 2, Y: -2.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
                TYPE: "bullet"
            }
        }, { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 12, WIDTH: 10, X: 2 }
        }
    ]
}

upgrade(["rimfire"], "rimflak")
