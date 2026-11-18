const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.thunderclap = {
    PARENT: "genericTank",
    LABEL: "Thunderclap",
    DANGER: 7,
    BODY: Class.railgun.BODY,
    GUNS: [
        {
            POSITION: { LENGTH: 22, WIDTH: 12 }
        },
        {
            POSITION: { LENGTH: 26, WIDTH: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.railgun, { damage: 1.25, health: 1.1 }]),
                TYPE: "bullet"
            }
        },
        Class.railgun.GUNS[2]
    ]
}
upgrade(["rifle", "railgun"], "thunderclap")
