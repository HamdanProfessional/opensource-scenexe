const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.carnivoreAR = {
    PARENT: "genericTank",
    LABEL: "Carnivore",
    DANGER: 8,
    BODY: Class.predator.BODY,
    CONTROLLERS: [["zoom", { distance: 480 }]],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        ...Class.predator.GUNS,
        {
            POSITION: { LENGTH: 15, WIDTH: 17, DELAY: 0.45 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.predator]),
                TYPE: "bullet"
            }
        }
    ]
}
upgrade(["predator"], "carnivoreAR")
