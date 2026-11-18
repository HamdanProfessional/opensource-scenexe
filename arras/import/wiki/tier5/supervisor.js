const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.supervisor = {
    PARENT: "genericTank",
    LABEL: "Supervisor",
    DANGER: 8,
    STAT_NAMES: Class.overlord.STAT_NAMES,
    BODY: Class.captain.BODY,
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
        }, 4),
        ...weaponArray([
            { POSITION: { LENGTH: 4.5, WIDTH: 10, X: 10.5 } },
            {
                POSITION: { LENGTH: 1, WIDTH: 12, X: 15 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.minion, g.spawner]),
                    TYPE: "minion",
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                    MAX_CHILDREN: 2
                }
            },
            { POSITION: { LENGTH: 11.5, WIDTH: 12 } }
        ], 4, { startAngle: 45 })
    ]
}

upgrade(["overlord", "captain"], "supervisor")
