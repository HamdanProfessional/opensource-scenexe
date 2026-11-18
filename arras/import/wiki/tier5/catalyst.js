const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")
const { statnames } = require("../constants.js")

Class.catalyst = {
    PARENT: "genericTank",
    LABEL: "Catalyst",
    DANGER: 8,
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: { LENGTH: 22, WIDTH: 5.5 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 7, ASPECT: 1.3, X: 22 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15, spray: 0.7 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        },
        {
            POSITION: { LENGTH: 12, WIDTH: 9.5, ASPECT: 1.25, X: 8 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 12, ASPECT: 1.3, X: 18 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.machineGun, g.gatlingGun, { spray: 0.7 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}

upgrade(["focal", "frother"], "catalyst")
