const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.raptor = {
    PARENT: "genericTank",
    LABEL: "Raptor",
    DANGER: 8,
    BODY: Class.booster.BODY,
    GUNS: [
        ...Class.eagle.GUNS,
        ...weaponMirror({
            POSITION: { LENGTH: 14, WIDTH: 8, ANGLE: 130, DELAY: 0.6 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "Thruster"
            }
        })
    ]
}
upgrade(["booster", "eagle"], "raptor")
