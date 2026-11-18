const { dereference, combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.mangle = {
    ...dereference("defect"),
    LABEL: "Mangle",
    DANGER: 8,
    GUNS: [
        ...dereference("defect").GUNS,
        ...weaponMirror({
            POSITION: { LENGTH: 16, WIDTH: 8, Y: -1, ANGLE: 90 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront]),
                TYPE: "bullet",
                LABEL: "Side"
            }
        })
    ],
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["defect", "fighter"], "mangle")
