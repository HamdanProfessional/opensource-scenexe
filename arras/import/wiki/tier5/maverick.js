const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.maverick = {
    PARENT: "genericTank",
    LABEL: "Maverick",
    DANGER: 8,
    BODY: Class.ranger.BODY,
    GUNS: [
        {
            POSITION: { LENGTH: 26, WIDTH: 12 }
        },
        {
            POSITION: { LENGTH: 32, WIDTH: 7 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.rifle]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: { LENGTH: 13, WIDTH: 7, ASPECT: -2.2 }
        }
    ]
}
upgrade(["ranger", "enforcer"], "maverick")
