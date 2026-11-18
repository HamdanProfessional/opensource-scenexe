const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.analyzerAR = {
    PARENT: "genericHealer",
    LABEL: "Analyzer",
    GUNS: [
        {
            POSITION: { LENGTH: 11, WIDTH: 12, ASPECT: -0.4, X: 9.5 }
        },
        {
            POSITION: { LENGTH: 18, WIDTH: 13 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.healer]),
                TYPE: "healerBullet"
            }
        }
    ]
}

upgrade(["healerAR"], "analyzerAR")
