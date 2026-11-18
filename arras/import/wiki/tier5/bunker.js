const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.bunker = {
    PARENT: "genericTank",
    LABEL: "Bunker",
    DANGER: 8,
    BODY: { FOV: base.FOV * 1.2 },
    GUNS: [
        ...weaponArray({
            POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5, ANGLE: 60 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.swarm]), TYPE: "swarm", STAT_CALCULATOR: "swarm" }
        }, 3, { delayIncrement: 1 / 3 }),
        ...weaponArray([
            {
                POSITION: { LENGTH: 15, WIDTH: 8 }
            },
            {
                POSITION: { LENGTH: 12, WIDTH: 11 }
            },
            {
                POSITION: { LENGTH: 3, WIDTH: 7, ASPECT: 1.7, X: 15 },
                PROPERTIES: { SHOOT_SETTINGS: combineStats([g.trap]), TYPE: "autoTrap", STAT_CALCULATOR: "trap" }
            }
        ], 3)
    ]
}

upgrade(["fortress", "triMech"], "bunker")
