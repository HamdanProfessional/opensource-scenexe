const { dereference, combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const small = combineStats([g.basic, g.twin, g.tripleShot, { size: 4 / 3 }])

Class.slitShot = {
    PARENT: "genericTank",
    LABEL: "Slit Shot",
    DANGER: 7,
    GUNS: [
        ...dereference(Class.tripleShot).GUNS,
        ...weaponMirror([
            {
                POSITION: { LENGTH: 20, WIDTH: 3.5, Y: 0.5, ANGLE: 8, DELAY: 0.25 },
                PROPERTIES: { SHOOT_SETTINGS: small, TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 17, WIDTH: 3.5, Y: 1.5, ANGLE: 28, DELAY: 0.75 },
                PROPERTIES: { SHOOT_SETTINGS: small, TYPE: "bullet" }
            }
        ])
    ]
}

upgrade(["splitShot"], "slitShot")
