const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const strongThruster = combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster, { recoil: 1.3 }])

Class.rocketAR = {
    PARENT: "genericTank",
    LABEL: "Rocket",
    DANGER: 8,
    BODY: Class.booster.BODY,
    GUNS: [
        Class.booster.GUNS[0],
        ...weaponMirror([
            {
                POSITION: { LENGTH: 12, WIDTH: 8, ANGLE: 122, DELAY: 0.3 },
                PROPERTIES: { SHOOT_SETTINGS: strongThruster, TYPE: "bullet", LABEL: "Thruster" }
            },
            {
                POSITION: { LENGTH: 14, WIDTH: 8, ANGLE: 136, DELAY: 0.6 },
                PROPERTIES: { SHOOT_SETTINGS: strongThruster, TYPE: "bullet", LABEL: "Thruster" }
            },
            {
                POSITION: { LENGTH: 16, WIDTH: 8, ANGLE: 150, DELAY: 0.1 },
                PROPERTIES: { SHOOT_SETTINGS: strongThruster, TYPE: "bullet", LABEL: "Thruster" }
            }
        ])
    ]
}
upgrade(["booster"], "rocketAR")
