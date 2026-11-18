const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.megaCourser = {
    PARENT: "genericTank",
    LABEL: "Mega Courser",
    DANGER: 8,
    BODY: Class.courser.BODY,
    CONTROLLERS: Class.courser.CONTROLLERS,
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        {
            POSITION: { LENGTH: 27, WIDTH: 12 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.pounder, g.hunter, g.hunterSecondary]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: { LENGTH: 24, WIDTH: 15, DELAY: 0.25 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.pounder, g.hunter]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: { LENGTH: 13, WIDTH: 15, ASPECT: -1.7 }
        }
    ]
}
upgrade(["courser", "megaHunter"], "megaCourser")
