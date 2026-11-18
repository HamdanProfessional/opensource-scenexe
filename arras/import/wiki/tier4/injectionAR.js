const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.injectionAR = {
    PARENT: "genericHealer",
    LABEL: "Injection",
    BODY: Class.hunter.BODY,
    GUNS: [
        {
            POSITION: { LENGTH: 15, WIDTH: 6, ASPECT: -0.4, X: 14 }
        },
        {
            POSITION: { LENGTH: 13, WIDTH: 7, ASPECT: -0.4, X: 14 }
        },
        {
            POSITION: { LENGTH: 24, WIDTH: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer, g.sniper, g.hunter, g.hunterSecondary]),
                TYPE: "healerBullet"
            }
        },
        {
            POSITION: { LENGTH: 21, WIDTH: 11, DELAY: 0.25 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer, g.sniper, g.hunter]),
                TYPE: "healerBullet"
            }
        }
    ]
}

upgrade(["medicAR"], "injectionAR")
