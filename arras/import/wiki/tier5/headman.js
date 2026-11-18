const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.headman = {
    PARENT: "genericTank",
    LABEL: "Headman",
    DANGER: 8,
    STAT_NAMES: Class.foreman.STAT_NAMES,
    BODY: Class.foreman.BODY,
    MAX_CHILDREN: 5,
    GUNS: [
        ...weaponArray({
            POSITION: { LENGTH: 12, WIDTH: 15, ASPECT: 1.3, X: 2 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.honcho, { size: 0.95 }]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true
            }
        }, 4)
    ]
}

upgrade(["overlord", "foreman"], "headman")
