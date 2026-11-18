const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.technician = {
    PARENT: "genericTank",
    LABEL: "Technician",
    DANGER: 7,
    GUNS: [
        {
            POSITION: { LENGTH: 14, WIDTH: 12 }
        },
        {
            POSITION: { LENGTH: 5, WIDTH: 12, ASPECT: 1.7, X: 13 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.megaTrap]),
                TYPE: "autoTrap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}

upgrade(["mech", "megaTrapper"], "technician")
