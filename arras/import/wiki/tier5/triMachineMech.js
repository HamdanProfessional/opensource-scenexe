const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.triMachineMech = {
    PARENT: "genericTank",
    LABEL: "Tri-Machine Mech",
    DANGER: 8,
    GUNS: [
        ...weaponArray([
            {
                POSITION: { LENGTH: 15, WIDTH: 9, ASPECT: 1.4 }
            },
            {
                POSITION: { LENGTH: 12, WIDTH: 11 }
            },
            {
                POSITION: { LENGTH: 3, WIDTH: 11, ASPECT: 1.3, X: 15 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trapSpray, g.machineGun, { size: 2 / 3, spray: 5 }]),
                    TYPE: "autoTrap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ], 3)
    ]
}

upgrade(["triMech", "triMachine", "machineMech"], "triMachineMech")
