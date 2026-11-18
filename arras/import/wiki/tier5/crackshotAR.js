const { dereference, combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.crackshotAR = {
    PARENT: "genericTank",
    LABEL: "Crackshot",
    DANGER: 8,
    GUNS: [
        ...dereference(Class.pentaShot).GUNS,
        ...weaponMirror([
            {
                POSITION: { LENGTH: 18, WIDTH: 3.5, Y: 1, ANGLE: 7.5, DELAY: 0.25 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, { size: 4 / 3 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: { LENGTH: 17, WIDTH: 3.5, Y: 2.5, ANGLE: 22.5, DELAY: 0.75 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, { size: 4 / 3 }]),
                    TYPE: "bullet"
                }
            }
        ])
    ]
}

upgrade(["pentaShot", "splitShot"], "crackshotAR")
