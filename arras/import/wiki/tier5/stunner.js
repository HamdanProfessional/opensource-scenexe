const { makeBird, combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const bird = makeBird("streamliner", "Stunner")

Class.stunner = {
    ...bird,
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false,
    DANGER: 8,
    GUNS: [
        ...bird.GUNS,
        ...weaponMirror({
            POSITION: { LENGTH: 18, WIDTH: 7, Y: 7, ANGLE: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront, g.minigun]),
                TYPE: "bullet",
                LABEL: "Side"
            }
        })
    ]
}

upgrade(["streamliner", "taser"], "stunner")
