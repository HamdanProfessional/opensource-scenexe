const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.charmer = {
    PARENT: "genericTank",
    LABEL: "Charmer",
    DANGER: 8,
    NECRO: [4],
    SIZE: 11.5,
    TOOLTIP: Class.maleficitor.TOOLTIP,
    STAT_NAMES: Class.necromancer.STAT_NAMES,
    SHAPE: 4,
    MAX_CHILDREN: 28,
    BODY: Class.maleficitor.BODY,
    GUNS: [
        ...weaponArray({
            POSITION: { LENGTH: 6, WIDTH: 12, ASPECT: 1.2, X: 7.4 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, g.maleficitor]),
                TYPE: ["sunchip", { INVISIBLE: [0.06, 0.03] }],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "necro",
                WAIT_TO_CYCLE: true,
                DELAY_SPAWN: false
            }
        }, 2, { delayIncrement: 0.5 })
    ]
}

upgrade(["necromancer", "maleficitor"], "charmer")
