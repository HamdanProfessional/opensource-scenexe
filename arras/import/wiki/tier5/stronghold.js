const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.stronghold = {
    PARENT: "genericTank",
    LABEL: "Stronghold",
    DANGER: 8,
    BODY: { FOV: base.FOV * 1.2 },
    GUNS: [
        ...weaponArray({
            POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5, ANGLE: 180 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.swarm]), TYPE: "swarm", STAT_CALCULATOR: "swarm" }
        }, 4, { delayIncrement: 1 / 4 }),
        ...weaponArray([
            {
                POSITION: { LENGTH: 14, WIDTH: 9 }
            },
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

upgrade(["fortress"], "stronghold")
