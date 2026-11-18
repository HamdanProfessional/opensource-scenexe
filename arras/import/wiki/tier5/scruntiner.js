const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.scruntiner = {
    PARENT: "genericTank",
    LABEL: "Scruntiner",
    DANGER: 8,
    BODY: Class.stalker.BODY,
    INVISIBLE: Class.stalker.INVISIBLE,
    CONTROLLERS: ["zoom"],
    TOOLTIP: "Hold right click to zoom. Stay still to turn invisible.",
    GUNS: [
        {
            POSITION: { LENGTH: 27, WIDTH: 8, ASPECT: -1.77 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.hunter, g.hunterSecondary]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: { LENGTH: 23, WIDTH: 11, ASPECT: -1.4, DELAY: 0.25 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.hunter]),
                TYPE: "bullet"
            }
        }
    ]
}
upgrade(["stalker"], "scruntiner")
