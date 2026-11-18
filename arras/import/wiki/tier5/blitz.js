const { statnames } = require("../constants.js")
const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.blitz = {
    PARENT: "genericTank",
    LABEL: "Blitz",
    DANGER: 8,
    STAT_NAMES: statnames.mixed,
    BODY: Class.fighter.BODY,
    GUNS: [
        ...Class.fighter.GUNS,
        {
            POSITION: { LENGTH: 13, WIDTH: 8, ANGLE: 180 }
        },
        {
            POSITION: { LENGTH: 4, WIDTH: 8, ASPECT: 1.7, X: 13, ANGLE: 180 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.trap]), TYPE: "trap", STAT_CALCULATOR: "trap" }
        }
    ]
}
upgrade(["fighter", "bomber"], "blitz")
