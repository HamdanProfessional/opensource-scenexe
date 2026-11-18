const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")
const { statnames } = require("../constants.js")

const trapShot = combineStats([g.trap, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }])

Class.propagator = {
    PARENT: "genericTank",
    LABEL: "Propagator",
    DANGER: 8,
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: { LENGTH: 27, WIDTH: 3, ASPECT: 1.4 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 4.5, ASPECT: 1.3, X: 27, DELAY: 0.75 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([trapShot, { size: 0.8 }]), TYPE: "trap", STAT_CALCULATOR: "trap" }
        },
        {
            POSITION: { LENGTH: 22, WIDTH: 5, ASPECT: 1.4 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 7, ASPECT: 1.3, X: 22, DELAY: 0.5 },
            PROPERTIES: { SHOOT_SETTINGS: trapShot, TYPE: "trap", STAT_CALCULATOR: "trap" }
        },
        {
            POSITION: { LENGTH: 18, WIDTH: 8, ASPECT: 1.4 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 10, ASPECT: 1.3, X: 18, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: trapShot, TYPE: "trap", STAT_CALCULATOR: "trap" }
        },
        {
            POSITION: { LENGTH: 14, WIDTH: 11, ASPECT: 1.4 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 13, ASPECT: 1.3, X: 14 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.trap, g.machineGun]), TYPE: "trap", STAT_CALCULATOR: "trap" }
        }
    ]
}

upgrade(["redistributor", "frother"], "propagator")
