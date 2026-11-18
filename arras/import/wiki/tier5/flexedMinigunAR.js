const { dereference, combineStats, weaponMirror, weaponStack } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.flexedMinigunAR = {
    PARENT: "genericTank",
    LABEL: "Flexed Minigun",
    DANGER: 8,
    BODY: Class.minigun.BODY,
    GUNS: [
        ...dereference(Class.bentMinigun).GUNS,
        ...weaponMirror(weaponStack({
            POSITION: { LENGTH: 17, WIDTH: 8, X: -2, Y: 3, ANGLE: 32, DELAY: 0.75 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.tripleShot]),
                TYPE: "bullet"
            }
        }, 2, { lengthOffset: 2, delayIncrement: 0.5 }))
    ]
}

upgrade(["pentaShot", "bentMinigun"], "flexedMinigunAR")
