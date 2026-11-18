const { statnames } = require("../constants.js")
const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const thruster = combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster])

Class.assaulter = {
    PARENT: "genericTank",
    LABEL: "Assaulter",
    DANGER: 8,
    STAT_NAMES: statnames.mixed,
    BODY: Class.booster.BODY,
    GUNS: [
        ...Class.booster.GUNS,
        ...weaponMirror({
            POSITION: { LENGTH: 12, WIDTH: 8, ANGLE: 122, DELAY: 0.3 },
            PROPERTIES: { SHOOT_SETTINGS: thruster, TYPE: "bullet", LABEL: "Thruster" }
        }),
        {
            POSITION: { LENGTH: 13, WIDTH: 8, ANGLE: 180 }
        },
        {
            POSITION: { LENGTH: 4, WIDTH: 8, ASPECT: 1.7, X: 13, ANGLE: 180 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.trap]), TYPE: "trap", STAT_CALCULATOR: "trap" }
        }
    ]
}
upgrade(["booster", "bomber"], "assaulter")
