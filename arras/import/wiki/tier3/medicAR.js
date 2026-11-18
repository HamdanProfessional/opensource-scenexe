const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.medicAR = {
    PARENT: "genericHealer",
    LABEL: "Medic",
    BODY: Class.sniper.BODY,
    GUNS: [
        {
            POSITION: { LENGTH: 11, WIDTH: 9, ASPECT: -0.4, X: 14 }
        },
        {
            POSITION: { LENGTH: 22, WIDTH: 10 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer, g.sniper]),
                TYPE: "healerBullet"
            }
        }
    ]
}

upgrade(["healerAR"], "medicAR")
