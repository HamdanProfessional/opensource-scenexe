const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")
const { statnames } = require("../constants.js")

Class.nebulizer = {
    PARENT: "genericTank",
    LABEL: "Nebulizer",
    DANGER: 8,
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: { LENGTH: 18, WIDTH: 8, ASPECT: 1.4 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 10, ASPECT: 1.3, X: 18 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }, g.atomizer, { reload: 1.2 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        },
        {
            POSITION: { LENGTH: 12, WIDTH: 10, ASPECT: 1.4, X: 8 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 13, ASPECT: 1.3, X: 12 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.machineGun]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}

upgrade(["atomizer", "frother"], "nebulizer")
