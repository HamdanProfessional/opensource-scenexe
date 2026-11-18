const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.broadsider = {
    PARENT: "genericTank",
    LABEL: "Broadsider",
    DANGER: 8,
    BODY: Class.ordnance.BODY,
    CONTROLLERS: Class.ordnance.CONTROLLERS,
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 15, WIDTH: 3.5, Y: 5.5, ANGLE: 7 }
            },
            {
                POSITION: { LENGTH: 2, WIDTH: 3.5, ASPECT: 1.77, X: 15, Y: 5.5, ANGLE: 7 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ], { delayIncrement: 0.5 }),
        ...Class.ordnance.GUNS.slice(2)
    ]
}
upgrade(["ordnance", "discharger"], "broadsider")
