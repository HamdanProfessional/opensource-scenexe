const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.industry = {
    PARENT: "genericTank",
    LABEL: "Industry",
    DANGER: 8,
    STAT_NAMES: Class.factory.STAT_NAMES,
    BODY: Class.factory.BODY,
    GUNS: [
        { POSITION: { LENGTH: 15.5, WIDTH: 11 } },
        {
            POSITION: { LENGTH: 1, WIDTH: 14, X: 15 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.minion]),
                TYPE: "minion",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 8
            }
        },
        { POSITION: { LENGTH: 12, WIDTH: 14 } }
    ]
}

upgrade(["factory"], "industry")
