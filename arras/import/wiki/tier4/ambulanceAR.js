const { combineStats, weaponMirror } = require("../facilitators.js")
const { base } = require("../constants.js")
const g = require("../gunvals.js")

Class.ambulanceAR = {
    PARENT: "genericHealer",
    LABEL: "Ambulance",
    BODY: {
        HEALTH: base.HEALTH * 0.8,
        SHIELD: base.SHIELD * 0.8,
        DENSITY: base.DENSITY * 0.6
    },
    GUNS: [
        {
            POSITION: { LENGTH: 11, WIDTH: 9, ASPECT: -0.4, X: 9.5 }
        },
        {
            POSITION: { LENGTH: 18, WIDTH: 10 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront, { recoil: 4 }, g.healer]),
                TYPE: "healerBullet",
                LABEL: "Front"
            }
        },
        ...weaponMirror({
            POSITION: { LENGTH: 16, WIDTH: 8, ANGLE: 150, DELAY: 0.1 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "Thruster"
            }
        })
    ]
}

upgrade(["triHealerAR"], "ambulanceAR")
