const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.adjurer = {
    PARENT: "genericTank",
    LABEL: "Adjurer",
    DANGER: 8,
    STAT_NAMES: Class.commander.STAT_NAMES,
    BODY: Class.commander.BODY,
    GUNS: [
        ...weaponArray([
            {
                POSITION: { LENGTH: 6, WIDTH: 12, ASPECT: 1.2, X: 8 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.doper]),
                    TYPE: "drone",
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                    MAX_CHILDREN: 2
                }
            },
            { POSITION: { LENGTH: 6, WIDTH: 1, ASPECT: -5, X: 9 } }
        ], 3),
        ...weaponArray([
            {
                POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5, ANGLE: 180 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.commander, g.doper]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm"
                }
            },
            { POSITION: { LENGTH: 7, WIDTH: 1, ASPECT: -2.5, X: 8, ANGLE: 180 } }
        ], 3, { delayIncrement: 1 / 3 })
    ]
}

upgrade(["commander", "dopeseer", "mosey"], "adjurer")
