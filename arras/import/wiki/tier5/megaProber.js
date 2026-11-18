const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.megaProber = {
    PARENT: "genericTank",
    LABEL: "Mega Prober",
    DANGER: 8,
    BODY: Class.megaHunter.BODY,
    CONTROLLERS: Class.megaHunter.CONTROLLERS,
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        {
            POSITION: { LENGTH: 20, WIDTH: 16 }
        },
        {
            POSITION: { LENGTH: 26, WIDTH: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.pounder, g.hunter, g.hunterSecondary]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: { LENGTH: 24, WIDTH: 11, DELAY: 0.25 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.pounder, g.hunter]),
                TYPE: "bullet"
            }
        }
    ]
}
upgrade(["megaHunter", "prober"], "megaProber")
