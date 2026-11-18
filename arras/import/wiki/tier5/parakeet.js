const { statnames } = require("../constants.js")
const { combineStats, makeBird } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.parakeet = makeBird({
    PARENT: "genericTank",
    LABEL: "Parakeet",
    DANGER: 7,
    STAT_NAMES: statnames.mixed,
    GUNS: [
        {
            POSITION: { LENGTH: 20, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pen]), TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 14, WIDTH: 10 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 10, ASPECT: 1.2, X: 15 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ]
}, "Parakeet")
upgrade(["cockatiel"], "parakeet")
