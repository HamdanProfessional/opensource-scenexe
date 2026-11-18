const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.employer = {
    PARENT: "genericTank",
    LABEL: "Employer",
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 20.25, WIDTH: 8, Y: 5.5, ANGLE: 5 },
                PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pen]), TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 3.25, WIDTH: 8, ASPECT: 1.7, X: 14, Y: 5.5, ANGLE: 5 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
                    TYPE: "autoTrap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ], { delayIncrement: 0.5 })
    ]
}

upgrade(["operator", "hutch", "cog"], "employer")
