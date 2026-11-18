const { statnames } = require("../constants.js")
const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.nuker = {
    PARENT: "genericTank",
    LABEL: "Nuker",
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
            POSITION: { LENGTH: 20, WIDTH: 8, ANGLE: 180 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pen, g.flankGuard, g.triAngle]),
                TYPE: "bullet",
                LABEL: "Rear"
            }
        },
        {
            POSITION: { LENGTH: 4, WIDTH: 8, ASPECT: 1.7, X: 13, ANGLE: 180 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.trap]), TYPE: "trap", STAT_CALCULATOR: "trap" }
        }
    ]
}
upgrade(["bomber", "incarcerator"], "nuker")
