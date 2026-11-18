const { statnames } = require("../constants.js")
const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.shiver = {
    PARENT: "genericTank",
    LABEL: "Shiver",
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
            POSITION: { LENGTH: 15, WIDTH: 9, ASPECT: 1.4, ANGLE: 180 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 11, ASPECT: 1.3, X: 15, ANGLE: 180 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trapSpray, g.machineGun, { size: 0.55, spray: 5 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}
upgrade(["bomber", "machineGuard"], "shiver")
