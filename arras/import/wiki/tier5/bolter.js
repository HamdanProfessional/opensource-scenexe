const { statnames } = require("../constants.js")
const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.bolter = {
    PARENT: "genericTank",
    LABEL: "Bolter",
    DANGER: 8,
    STAT_NAMES: statnames.mixed,
    BODY: Class.bomber.BODY,
    GUNS: [
        ...Class.bomber.GUNS.slice(0, 3),
        ...weaponMirror({
            POSITION: { LENGTH: 16, WIDTH: 8, ANGLE: 155, DELAY: 0.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "Thruster"
            }
        }),
        {
            POSITION: { LENGTH: 15, WIDTH: 8, ANGLE: 180 }
        },
        {
            POSITION: { LENGTH: 12, WIDTH: 11, ANGLE: 180 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 7, ASPECT: 1.7, X: 15, ANGLE: 180 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.trap]), TYPE: "autoTrap", STAT_CALCULATOR: "trap" }
        }
    ]
}
upgrade(["bomber", "mechGuard"], "bolter")
