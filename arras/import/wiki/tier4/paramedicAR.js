const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.paramedicAR = {
    PARENT: "genericHealer",
    LABEL: "Paramedic",
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 11, WIDTH: 6, ASPECT: -0.4, X: 8, Y: 2, ANGLE: 18 }
            },
            {
                POSITION: { LENGTH: 17, WIDTH: 8, Y: 2, ANGLE: 18, DELAY: 0.5 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.healer]),
                    TYPE: "healerBullet"
                }
            }
        ]),
        {
            POSITION: { LENGTH: 11, WIDTH: 9, ASPECT: -0.4, X: 11 }
        },
        {
            POSITION: { LENGTH: 20, WIDTH: 10 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.healer]),
                TYPE: "healerBullet"
            }
        }
    ]
}

upgrade(["nurseAR"], "paramedicAR")
