const { dereference, combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.flexedGunnerAR = {
    PARENT: "genericTank",
    LABEL: "Flexed Gunner",
    DANGER: 8,
    GUNS: [
        ...dereference(Class.bentGunner).GUNS,
        ...weaponMirror({
            POSITION: { LENGTH: 9, WIDTH: 3.5, Y: 9.5, ANGLE: 36, DELAY: 0.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        })
    ]
}

upgrade(["pentaShot", "bentGunner"], "flexedGunnerAR")
