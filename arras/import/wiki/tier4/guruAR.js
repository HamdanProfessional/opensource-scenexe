const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.guruAR = {
    PARENT: "genericHealer",
    LABEL: "Guru",
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 10, WIDTH: 4, ASPECT: -0.4, X: 9.5, Y: -5, ANGLE: -7 }
            },
            {
                POSITION: { LENGTH: 17, WIDTH: 5, Y: -5, ANGLE: -7, DELAY: 0.25 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.healer, { size: 0.5 }]),
                    TYPE: "healerBullet",
                    LABEL: "Secondary"
                }
            }
        ], { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 11, WIDTH: 12, ASPECT: -0.4, X: 9.5 }
        },
        {
            POSITION: { LENGTH: 19, WIDTH: 12 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.healer]),
                TYPE: "healerBullet",
                LABEL: "Heavy"
            }
        }
    ]
}

upgrade(["analyzerAR", "psychiatristAR"], "guruAR")
