const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.ultraHunter = {
    PARENT: "genericTank",
    LABEL: "Ultra Hunter",
    DANGER: 8,
    BODY: Class.megaHunter.BODY,
    CONTROLLERS: Class.megaHunter.CONTROLLERS,
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        {
            POSITION: { LENGTH: 24, WIDTH: 16 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.pounder, g.hunter, g.hunterSecondary, { reload: 1.2, damage: 1.1 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: { LENGTH: 21, WIDTH: 20, DELAY: 0.25 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.pounder, g.hunter, { reload: 1.2, damage: 1.1 }]),
                TYPE: "bullet"
            }
        }
    ]
}
upgrade(["megaHunter"], "ultraHunter")
