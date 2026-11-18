const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.molder = {
    PARENT: "genericTank",
    LABEL: "Molder",
    DANGER: 7,
    BODY: Class.bushwhacker.BODY,
    GUNS: [
        Class.bushwhacker.GUNS[0],
        {
            POSITION: { LENGTH: 13, WIDTH: 10, ANGLE: 180 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 12, ASPECT: 1.1, X: 13, ANGLE: 180 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ]
}
upgrade(["bushwhacker"], "molder")
