const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.palisade = {
    PARENT: "genericTank",
    LABEL: "Palisade",
    DANGER: 8,
    STAT_NAMES: Class.fortress.STAT_NAMES,
    BODY: Class.fortress.BODY,
    GUNS: [
        ...weaponArray([
            { POSITION: { LENGTH: 14.5, WIDTH: 6 } },
            { POSITION: { LENGTH: 11, WIDTH: 8, ASPECT: -1.2 } },
            {
                POSITION: { LENGTH: 1, WIDTH: 8, X: 14.5 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.minion, g.productionist]),
                    TYPE: "tinyMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true
                }
            }
        ], 3, { delayIncrement: 1 / 3 }),
        ...weaponArray([
            { POSITION: { LENGTH: 14, WIDTH: 9, ANGLE: 60 } },
            {
                POSITION: { LENGTH: 4, WIDTH: 9, ASPECT: 1.5, X: 14, ANGLE: 60 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, { range: 0.5, speed: 0.7, maxSpeed: 0.7 }]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ], 3)
    ]
}

upgrade(["productionist", "fortress"], "palisade")
