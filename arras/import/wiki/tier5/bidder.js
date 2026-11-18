const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.bidder = {
    PARENT: "genericTank",
    LABEL: "Bidder",
    DANGER: 8,
    STAT_NAMES: Class.commander.STAT_NAMES,
    BODY: Class.commander.BODY,
    GUNS: [
        ...weaponArray({
            POSITION: { LENGTH: 11, WIDTH: 14, ASPECT: 1.3, X: 2 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.honcho, { size: 0.95 }]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 2
            }
        }, 3),
        ...weaponArray({
            POSITION: { LENGTH: 12, WIDTH: 8.7, ASPECT: 0.75, X: 3, ANGLE: 180 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.honcho]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
                SYNCS_SKILLS: true
            }
        }, 3, { delayIncrement: 1 / 3 })
    ]
}

upgrade(["commander", "foreman", "baltimore"], "bidder")
