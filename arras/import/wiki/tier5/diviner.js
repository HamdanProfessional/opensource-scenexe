const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.diviner = {
    PARENT: "genericTank",
    LABEL: "Diviner",
    DANGER: 8,
    NECRO: [4],
    SIZE: 11.5,
    STAT_NAMES: Class.necromancer.STAT_NAMES,
    SHAPE: 6,
    MAX_CHILDREN: 20,
    BODY: Class.necromancer.BODY,
    GUNS: [
        ...weaponArray({
            POSITION: { LENGTH: 6, WIDTH: 12, ASPECT: 1.2, X: 7.4, DELAY: 0.25 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
                TYPE: "sunchip",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "necro",
                WAIT_TO_CYCLE: true,
                DELAY_SPAWN: false
            }
        }, 6, { delayIncrement: 0.5 })
    ]
}

upgrade(["necromancer"], "diviner")
