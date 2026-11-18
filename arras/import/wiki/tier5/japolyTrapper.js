const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.japolyTrapper = {
    PARENT: "genericTank",
    LABEL: "Japoly Trapper",
    DANGER: 8,
    GUNS: [
        {
            POSITION: { LENGTH: 15, WIDTH: 9, ASPECT: 1.4 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 13, ASPECT: 1.3, X: 15 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trapSpray, g.machineGun, { reload: 0.5, size: 2 / 3, spray: 9 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}

upgrade(["dieselTrapper"], "japolyTrapper")
