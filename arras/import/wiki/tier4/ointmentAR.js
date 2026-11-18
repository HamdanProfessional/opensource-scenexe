const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.ointmentAR = {
    PARENT: "genericHealer",
    LABEL: "Ointment",
    BODY: Class.rifle.BODY,
    GUNS: [
        {
            POSITION: { LENGTH: 20, WIDTH: 13 }
        },
        {
            POSITION: { LENGTH: 11, WIDTH: 7, ASPECT: -0.4, X: 14 }
        },
        {
            POSITION: { LENGTH: 22, WIDTH: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer, g.sniper, g.rifle]),
                TYPE: "healerBullet"
            }
        }
    ]
}

upgrade(["medicAR"], "ointmentAR")
