const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.governor = {
    PARENT: "genericTank",
    LABEL: "Governor",
    DANGER: 8,
    STAT_NAMES: Class.captain.STAT_NAMES,
    BODY: Class.captain.BODY,
    GUNS: [
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
        ], 3),
        ...weaponArray({
            POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm"
            }
        }, 3, { startAngle: 60, delayIncrement: 1 / 3 })
    ]
}

upgrade(["captain"], "governor")
