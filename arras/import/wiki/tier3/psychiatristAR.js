const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.psychiatristAR = {
    PARENT: "genericHealer",
    LABEL: "Psychiatrist",
    GUNS: [
        {
            POSITION: { LENGTH: 11, WIDTH: 9, ASPECT: -0.4, X: 9.5 }
        },
        {
            POSITION: { LENGTH: 18, WIDTH: 10, ASPECT: 1.3 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.healer]),
                TYPE: "healerBullet"
            }
        }
    ]
}

upgrade(["healerAR"], "psychiatristAR")
