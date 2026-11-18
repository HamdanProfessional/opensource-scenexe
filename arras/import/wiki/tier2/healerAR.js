const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.healerAR = {
    PARENT: "genericHealer",
    LABEL: "Healer",
    GUNS: [
        {
            POSITION: { LENGTH: 11, WIDTH: 9, ASPECT: -0.4, X: 9.5 }
        },
        {
            POSITION: { LENGTH: 18, WIDTH: 10 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
                TYPE: "healerBullet"
            }
        }
    ]
}

upgrade(["basic"], "healerAR")
