const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.slingshot = {
    PARENT: "genericTank",
    LABEL: "Slingshot",
    DANGER: 8,
    BODY: Class.megaHunter.BODY,
    CONTROLLERS: Class.megaHunter.CONTROLLERS,
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        {
            POSITION: { LENGTH: 19.2, WIDTH: 14, ASPECT: 0.7 }
        },
        {
            POSITION: { LENGTH: 17, WIDTH: 14 },
            PROPERTIES: Class.hurler.GUNS[1].PROPERTIES
        },
        {
            POSITION: { LENGTH: 24, WIDTH: 6, DELAY: 0.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary]),
                TYPE: "bullet"
            }
        }
    ]
}
upgrade(["megaHunter", "hurler"], "slingshot")
