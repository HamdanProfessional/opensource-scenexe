const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const shot = combineStats([g.basic, g.twin, g.tripleShot, { reload: 1.15 }])

Class.heptaShotAR = {
    PARENT: "genericTank",
    LABEL: "Hepta Shot",
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 13, WIDTH: 8, Y: 4, ANGLE: 45, DELAY: 0.5 },
                PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 16, WIDTH: 8, Y: 3, ANGLE: 30, DELAY: 2 / 3 },
                PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 19, WIDTH: 8, Y: 2, ANGLE: 15, DELAY: 1 / 3 },
                PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
            }
        ]),
        {
            POSITION: { LENGTH: 22, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        }
    ]
}

upgrade(["pentaShot"], "heptaShotAR")
