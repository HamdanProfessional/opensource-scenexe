const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.outpost = {
    PARENT: "genericTank",
    LABEL: "Outpost",
    DANGER: 8,
    STAT_NAMES: Class.fortress.STAT_NAMES,
    BODY: Class.fortress.BODY,
    GUNS: [
        ...weaponArray({
            POSITION: { LENGTH: 12, WIDTH: 8.7, ASPECT: 0.75, X: 3, ANGLE: 180 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.honcho]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
                SYNCS_SKILLS: true
            }
        }, 3, { delayIncrement: 1 / 3 }),
        ...weaponArray([
            { POSITION: { LENGTH: 14, WIDTH: 9 } },
            {
                POSITION: { LENGTH: 4, WIDTH: 9, ASPECT: 1.5, X: 14 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, { range: 0.5, speed: 0.7, maxSpeed: 0.7 }]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ], 3)
    ]
}

upgrade(["baltimore", "fortress"], "outpost")
