const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.armamentAR = {
    PARENT: "genericTank",
    LABEL: "Armament",
    DANGER: 8,
    BODY: Class.enforcer.BODY,
    GUNS: [
        ...Class.enforcer.GUNS,
        ...weaponMirror({
            POSITION: { LENGTH: 17, WIDTH: 4, Y: 3, ANGLE: 180, DELAY: 0.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        }, { delayIncrement: 0.5 })
    ]
}
upgrade(["buttbuttin", "enforcer"], "armamentAR")
