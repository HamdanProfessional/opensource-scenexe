const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.sifterAR = {
    PARENT: "genericTank",
    LABEL: "Sifter",
    DANGER: 8,
    BODY: Class.courser.BODY,
    CONTROLLERS: Class.courser.CONTROLLERS,
    GUNS: [
        ...Class.courser.GUNS,
        ...weaponMirror({
            POSITION: { LENGTH: 17, WIDTH: 4, Y: 3, ANGLE: 180, DELAY: 0.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        }, { delayIncrement: 0.5 })
    ]
}
upgrade(["buttbuttin", "courser"], "sifterAR")
