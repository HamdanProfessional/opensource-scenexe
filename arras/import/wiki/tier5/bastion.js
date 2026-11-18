const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.bastion = {
    PARENT: "genericTank",
    LABEL: "Bastion",
    DANGER: 8,
    FACING_TYPE: "locksFacing",
    STAT_NAMES: Class.fortress.STAT_NAMES,
    BODY: Class.fortress.BODY,
    GUNS: [
        ...weaponArray({
            POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5, ANGLE: 180 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm"
            }
        }, 3, { delayIncrement: 1 / 3 }),
        ...weaponArray({
            POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5, ANGLE: 60 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: ["swarm", { AI: { FARMER: true }, INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
                LABEL: "Autonomous"
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

upgrade(["battleship", "fortress"], "bastion")
