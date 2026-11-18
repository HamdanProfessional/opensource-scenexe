const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.finger = {
    PARENT: "genericTank",
    LABEL: "Finger",
    DANGER: 7,
    BODY: Class.railgun.BODY,
    GUNS: [
        {
            POSITION: { LENGTH: 26, WIDTH: 7.95 }
        },
        {
            POSITION: { LENGTH: 32, WIDTH: 5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.railgun, { speed: 1.25, maxSpeed: 1.25, damage: 1.15 }]),
                TYPE: "bullet"
            }
        },
        Class.railgun.GUNS[2]
    ]
}
upgrade(["assassin", "railgun"], "finger")
