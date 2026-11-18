const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.accountantAR = {
    PARENT: "genericHealer",
    LABEL: "Accountant",
    GUNS: [
        {
            POSITION: { LENGTH: 11, WIDTH: 14, ASPECT: -0.4, X: 9.5 }
        },
        {
            POSITION: { LENGTH: 18, WIDTH: 15 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.healer]),
                TYPE: "healerBullet"
            }
        }
    ]
}

upgrade(["analyzerAR"], "accountantAR")
