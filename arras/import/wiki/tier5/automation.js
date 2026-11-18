const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.automation = {
    PARENT: "genericTank",
    LABEL: "Automation",
    DANGER: 8,
    GUNS: [
        {
            POSITION: { LENGTH: 15, WIDTH: 8 }
        },
        {
            POSITION: { LENGTH: 12, WIDTH: 11 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 7, ASPECT: 1.7, X: 15 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.trap]), TYPE: "autoTrap", STAT_CALCULATOR: "trap" }
        },
        {
            POSITION: { LENGTH: 6, WIDTH: 12, ASPECT: 1.2, X: 8, ANGLE: 180 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.minion]),
                TYPE: "minion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 3
            }
        }
    ]
}

upgrade(["cobbler"], "automation")
