const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.megaWark = {
    PARENT: "genericTank",
    LABEL: "Mega Wark",
    DANGER: 7,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 14, WIDTH: 9, Y: 6.5, ANGLE: 5 }
            },
            {
                POSITION: { LENGTH: 5, WIDTH: 11, ASPECT: 1.7, X: 13, Y: 6.5, ANGLE: 5 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.megaTrap, g.twin]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ], { delayIncrement: 0.5 })
    ]
}

upgrade(["wark", "megaTrapper"], "megaWark")
