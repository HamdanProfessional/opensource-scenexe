const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.septaMachine = {
    PARENT: "genericTank",
    LABEL: "Septa-Machine",
    DANGER: 8,
    HAS_NO_RECOIL: true,
    GUNS: [
        ...weaponArray([
            {
                POSITION: { LENGTH: 15, WIDTH: 9, ASPECT: 1.4 }
            },
            {
                POSITION: { LENGTH: 3, WIDTH: 13, ASPECT: 1.3, X: 15 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trapSpray, g.machineGun, { size: 2 / 3, spray: 5 }]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ], 7, { delayIncrement: 1 / 7 })
    ]
}

upgrade(["septaTrapper", "triMachine"], "septaMachine")
