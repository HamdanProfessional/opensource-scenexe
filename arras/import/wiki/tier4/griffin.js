const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.griffin = {
    PARENT: "genericTank",
    LABEL: "Griffin",
    DANGER: 8,
    BODY: Class.fighter.BODY,
    GUNS: [
        ...Class.eagle.GUNS,
        ...weaponMirror({
            POSITION: { LENGTH: 16, WIDTH: 8, Y: -1, ANGLE: 90 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront]),
                TYPE: "bullet",
                LABEL: "Side"
            }
        })
    ]
}
upgrade(["fighter", "eagle"], "griffin")
