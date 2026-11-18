const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.tripleTrapper = {
    PARENT: "genericTank",
    LABEL: "Triple-Trapper",
    DANGER: 6,
    GUNS: [
        ...weaponArray([
            {
                POSITION: { LENGTH: 15, WIDTH: 7 }
            },
            {
                POSITION: { LENGTH: 3, WIDTH: 7, ASPECT: 1.7, X: 15 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.flankGuard]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ], 3, { delayIncrement: 1 / 3 })
    ]
}

upgrade(["trapper"], "tripleTrapper")
