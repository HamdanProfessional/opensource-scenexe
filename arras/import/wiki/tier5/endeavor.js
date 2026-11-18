const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.endeavor = {
    PARENT: "genericTank",
    LABEL: "Endeavor",
    DANGER: 8,
    STAT_NAMES: Class.foundry.STAT_NAMES,
    BODY: Class.foundry.BODY,
    GUNS: [
        { POSITION: { LENGTH: 15, WIDTH: 15 } },
        {
            POSITION: { LENGTH: 1, WIDTH: 17, X: 15 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.minion, g.spawner, g.honcho]),
                TYPE: ["minion", { INVISIBLE: [0.06, 0.03] }],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 4
            }
        },
        { POSITION: { LENGTH: 11.5, WIDTH: 17 } }
    ]
}

upgrade(["laborer", "foundry"], "endeavor")
