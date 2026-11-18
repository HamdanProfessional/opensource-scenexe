const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.vindicator = {
    PARENT: "genericTank",
    LABEL: "Vindicator",
    DANGER: 8,
    BODY: {
        ...Class.ranger.BODY,
        FOV: Class.ranger.BODY.FOV * 1.1
    },
    GUNS: [
        {
            POSITION: { LENGTH: 38, WIDTH: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, { range: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: { LENGTH: 13, WIDTH: 8, ASPECT: -2.2 }
        }
    ]
}
upgrade(["ranger"], "vindicator")
