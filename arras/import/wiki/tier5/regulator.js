const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.regulator = {
    PARENT: "genericTank",
    LABEL: "Regulator",
    DANGER: 8,
    STAT_NAMES: Class.commander.STAT_NAMES,
    BODY: Class.commander.BODY,
    GUNS: [
        ...weaponArray({
            POSITION: { LENGTH: 6, WIDTH: 12, ASPECT: 1.2, X: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 2
            }
        }, 3),
        ...weaponArray({
            POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5, ANGLE: 180 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.commander]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm"
            }
        }, 3, { delayIncrement: 1 / 3 }),
        ...weaponArray({
            POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm"
            }
        }, 3, { startAngle: 90, delayIncrement: 1 / 3 })
    ]
}

upgrade(["commander", "battleship"], "regulator")
