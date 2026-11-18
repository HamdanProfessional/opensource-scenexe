const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.internAR = {
    PARENT: "genericHealer",
    LABEL: "Intern",
    BODY: Class.assassin.BODY,
    GUNS: [
        {
            POSITION: { LENGTH: 14, WIDTH: 9, ASPECT: -0.4, X: 14 }
        },
        {
            POSITION: { LENGTH: 25, WIDTH: 10 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer, g.sniper, g.assassin]),
                TYPE: "healerBullet"
            }
        }
    ]
}

upgrade(["medicAR"], "internAR")
