const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.shronghold = {
    PARENT: "genericTank",
    LABEL: "Shronghold",
    DANGER: 8,
    FACING_TYPE: "locksFacing",
    STAT_NAMES: Class.fortress.STAT_NAMES,
    BODY: Class.carrier.BODY,
    GUNS: [
        ...weaponArray({
            POSITION: { LENGTH: 6, WIDTH: 12, ASPECT: 1.2, X: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 2
            }
        }, 4, { startAngle: 45 }),
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
        ], 4)
    ]
}

upgrade(["carrier"], "shronghold")
