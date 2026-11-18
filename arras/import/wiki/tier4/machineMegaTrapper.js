const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.machineMegaTrapper = {
    PARENT: "genericTank",
    LABEL: "Machine Mega Trapper",
    DANGER: 7,
    GUNS: [
        {
            POSITION: { LENGTH: 14, WIDTH: 14, ASPECT: 1.4 }
        },
        {
            POSITION: { LENGTH: 5, WIDTH: 17, ASPECT: 1.3, X: 13 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trapSpray, g.machineGun, g.megaTrap, { spray: 5 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}

upgrade(["machineTrapper", "megaTrapper"], "machineMegaTrapper")
