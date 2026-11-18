const { statnames } = require("../constants.js")
const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const front = combineStats([g.basic, g.pen, g.flankGuard, g.triAngle, g.triAngleFront, { recoil: 4 }])
const thruster = combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster])

Class.galah = {
    PARENT: "genericTank",
    LABEL: "Galah",
    DANGER: 8,
    STAT_NAMES: statnames.mixed,
    BODY: Class.booster.BODY,
    GUNS: [
        {
            POSITION: { LENGTH: 20, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: front, TYPE: "bullet", LABEL: "Front" }
        },
        {
            POSITION: { LENGTH: 4, WIDTH: 8, ASPECT: 1.7, X: 13 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.trap]), TYPE: "trap", STAT_CALCULATOR: "trap" }
        },
        ...weaponMirror([
            {
                POSITION: { LENGTH: 14, WIDTH: 8, ANGLE: 136, DELAY: 0.6 },
                PROPERTIES: { SHOOT_SETTINGS: thruster, TYPE: "bullet", LABEL: "Thruster" }
            },
            {
                POSITION: { LENGTH: 16, WIDTH: 8, ANGLE: 150, DELAY: 0.1 },
                PROPERTIES: { SHOOT_SETTINGS: thruster, TYPE: "bullet", LABEL: "Thruster" }
            }
        ]),
        {
            POSITION: { LENGTH: 18, WIDTH: 8, ANGLE: 180, DELAY: 0.3 },
            PROPERTIES: { SHOOT_SETTINGS: thruster, TYPE: "bullet", LABEL: "Thruster" }
        }
    ]
}
upgrade(["booster", "cockatiel"], "galah")
