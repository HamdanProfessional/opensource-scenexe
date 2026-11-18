const { dereference, combineStats, weaponMirror } = require("../facilitators.js")
const { base } = require("../constants.js")
const g = require("../gunvals.js")

Class.loon = {
    ...dereference("defect"),
    LABEL: "Loon",
    DANGER: 8,
    BODY: {
        HEALTH: base.HEALTH * 0.4,
        SHIELD: base.SHIELD * 0.4,
        DENSITY: base.DENSITY * 0.3
    },
    GUNS: [
        ...dereference("defect").GUNS,
        ...weaponMirror({
            POSITION: { LENGTH: 14, WIDTH: 8, ANGLE: 136, DELAY: 0.6 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "Thruster"
            }
        }),
        ...weaponMirror({
            POSITION: { LENGTH: 17, WIDTH: 8, Y: 2, ANGLE: 12, DELAY: 0.3 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront]),
                TYPE: "bullet",
                LABEL: "Front"
            }
        })
    ],
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false
}

upgrade(["defect", "booster"], "loon")
