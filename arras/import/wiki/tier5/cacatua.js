const { statnames } = require("../constants.js")
const { combineStats, makeBird } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.cacatua = makeBird({
    PARENT: "genericTank",
    LABEL: "Cacatua",
    DANGER: 7,
    STAT_NAMES: statnames.mixed,
    GUNS: [
        {
            POSITION: { LENGTH: 20, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pen]), TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 4, WIDTH: 8, ASPECT: 1.7, X: 13 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.trap]), TYPE: "autoTrap", STAT_CALCULATOR: "trap" }
        }
    ]
}, "Cacatua")
upgrade(["cockatiel", "operator"], "cacatua")
