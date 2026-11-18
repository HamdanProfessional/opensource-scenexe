const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.worker = {
    PARENT: "genericTank",
    LABEL: "Worker",
    DANGER: 8,
    STAT_NAMES: Class.factory.STAT_NAMES,
    BODY: Class.factory.BODY,
    GUNS: [
        { POSITION: { LENGTH: 15.5, WIDTH: 11 } },
        {
            POSITION: { LENGTH: 1, WIDTH: 14, X: 15 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.minion, { size: 1.25, health: 1.5 }]),
                TYPE: ["minion", { INVISIBLE: [0.06, 0.03] }],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 4
            }
        },
        { POSITION: { LENGTH: 12, WIDTH: 14 } }
    ]
}

upgrade(["factory", "laborer"], "worker")
