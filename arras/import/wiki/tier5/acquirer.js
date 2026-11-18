const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.acquirer = {
    PARENT: "genericTank",
    LABEL: "Acquirer",
    DANGER: 8,
    BODY: Class.ranger.BODY,
    CONTROLLERS: ["zoom"],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        {
            POSITION: { LENGTH: 32, WIDTH: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.hunter, g.hunterSecondary]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: { LENGTH: 28, WIDTH: 11, DELAY: 0.25 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.hunter]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: { LENGTH: 13, WIDTH: 11, ASPECT: -1.7 }
        }
    ]
}
upgrade(["ranger", "courser"], "acquirer")
