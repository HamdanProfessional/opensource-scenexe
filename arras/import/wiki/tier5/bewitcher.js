const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.bewitcher = {
    PARENT: "genericTank",
    LABEL: "Bewitcher",
    DANGER: 8,
    NECRO: [4],
    SIZE: 11.5,
    TOOLTIP: Class.maleficitor.TOOLTIP,
    STAT_NAMES: Class.maleficitor.STAT_NAMES,
    SHAPE: 4,
    MAX_CHILDREN: 20,
    BODY: Class.maleficitor.BODY,
    GUNS: [
        {
            POSITION: { LENGTH: 6, WIDTH: 12, ASPECT: 1.2, X: 7.4 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, g.maleficitor]),
                TYPE: ["sunchip", { INVISIBLE: [0.004, 0.03] }],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "necro",
                WAIT_TO_CYCLE: true,
                DELAY_SPAWN: false
            }
        }
    ]
}

upgrade(["maleficitor"], "bewitcher")
