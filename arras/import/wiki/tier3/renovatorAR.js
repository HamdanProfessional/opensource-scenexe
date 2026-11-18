const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.renovatorAR = {
    PARENT: "genericHealer",
    LABEL: "Renovator",
    GUNS: [
        {
            POSITION: { LENGTH: 11, WIDTH: 9, ASPECT: -0.4, X: 9.5 }
        },
        {
            POSITION: { LENGTH: 18, WIDTH: 10 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer, g.single]),
                TYPE: "healerBullet"
            }
        },
        {
            POSITION: { LENGTH: 12, WIDTH: 10, ASPECT: -1.8 }
        }
    ]
}

upgrade(["healerAR"], "renovatorAR")
