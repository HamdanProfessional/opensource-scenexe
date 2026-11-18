const { combineStats, weaponMirror, weaponStack } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.taser = {
    PARENT: "genericTank",
    LABEL: "Taser",
    DANGER: 7,
    BODY: {
        HEALTH: 0.8 * base.HEALTH,
        SHIELD: 0.8 * base.SHIELD,
        DENSITY: 0.6 * base.DENSITY,
        FOV: base.FOV * 1.1
    },
    GUNS: [
        ...weaponStack({
            POSITION: { LENGTH: 19, WIDTH: 7 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.minigun, { recoil: 4 }]),
                TYPE: "bullet",
                LABEL: "Front"
            }
        }, 3, { lengthOffset: 2, delayIncrement: 1 / 3 }),
        ...weaponMirror({
            POSITION: { LENGTH: 16, WIDTH: 8, ANGLE: 150, DELAY: 0.1 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "Thruster"
            }
        }),
        {
            POSITION: { LENGTH: 18, WIDTH: 8, ANGLE: 180, DELAY: 0.35 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "Thruster"
            }
        }
    ]
}

upgrade(["minigun", "triAngle"], "taser")
