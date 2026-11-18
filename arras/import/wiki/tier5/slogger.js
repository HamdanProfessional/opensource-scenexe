const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.slogger = {
    PARENT: "genericTank",
    LABEL: "Slogger",
    DANGER: 8,
    STAT_NAMES: Class.laborer.STAT_NAMES,
    BODY: Class.laborer.BODY,
    GUNS: [
        { POSITION: { LENGTH: 4.5, WIDTH: 10, ASPECT: 1.2, X: 10.5 } },
        {
            POSITION: { LENGTH: 1, WIDTH: 12, X: 15 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.minion, g.spawner, g.doper]),
                TYPE: ["minion", { INVISIBLE: [0.06, 0.03] }],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 4
            }
        },
        { POSITION: { LENGTH: 5.5, WIDTH: 11, ASPECT: -1.3, X: 6 } },
        { POSITION: { LENGTH: 6, WIDTH: 1, ASPECT: -5, X: 8 } }
    ]
}

upgrade(["laborer", "issuer"], "slogger")
