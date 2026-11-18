const { statnames } = require("../constants.js")
const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.whizzer = {
    PARENT: "genericTank",
    LABEL: "Whizzer",
    DANGER: 8,
    STAT_NAMES: statnames.mixed,
    BODY: Class.bomber.BODY,
    GUNS: [
        ...Class.bomber.GUNS,
        {
            POSITION: { LENGTH: 7.5, WIDTH: 7.5, ASPECT: 0.6, X: 7, DELAY: 0.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm"
            }
        },
        ...weaponMirror({
            POSITION: { LENGTH: 16, WIDTH: 8, ANGLE: 155, DELAY: 0.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "Thruster"
            }
        })
    ]
}
upgrade(["bomber", "peashooter"], "whizzer")
