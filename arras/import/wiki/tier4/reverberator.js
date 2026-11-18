const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.reverberator = {
    PARENT: "genericTank",
    LABEL: "Reverberator",
    DANGER: 7,
    BODY: Class.railgun.BODY,
    CONTROLLERS: ["zoom"],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        {
            POSITION: { LENGTH: 20, WIDTH: 10 }
        },
        {
            POSITION: { LENGTH: 26, WIDTH: 5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.railgun, g.hunterSecondary]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: { LENGTH: 24, WIDTH: 7, DELAY: 0.25 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.railgun]),
                TYPE: "bullet"
            }
        }
    ]
}
upgrade(["hunter", "railgun"], "reverberator")
