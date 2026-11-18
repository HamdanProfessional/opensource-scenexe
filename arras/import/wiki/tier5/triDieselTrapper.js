const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.triDieselTrapper = {
    PARENT: "genericTank",
    LABEL: "Tri-Diesel Trapper",
    DANGER: 8,
    GUNS: [
        ...weaponArray([
            {
                POSITION: { LENGTH: 15, WIDTH: 9, ASPECT: 1.4 }
            },
            {
                POSITION: { LENGTH: 3, WIDTH: 13, ASPECT: 1.3, X: 15 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trapSpray, g.machineGun, { reload: 0.75, size: 2 / 3, spray: 5 }]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ], 3)
    ]
}

upgrade(["triMachine", "dieselTrapper"], "triDieselTrapper")
