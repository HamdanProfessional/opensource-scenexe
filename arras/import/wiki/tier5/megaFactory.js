const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.megaFactory = {
    PARENT: "genericTank",
    LABEL: "Mega Factory",
    DANGER: 8,
    STAT_NAMES: Class.factory.STAT_NAMES,
    BODY: Class.factory.BODY,
    GUNS: [
        { POSITION: { LENGTH: 15.5, WIDTH: 13 } },
        {
            POSITION: { LENGTH: 1, WIDTH: 15, X: 15 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.minion, { size: 0.8 }]),
                TYPE: "megaMinion",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 4
            }
        },
        { POSITION: { LENGTH: 12, WIDTH: 15 } }
    ]
}

upgrade(["factory", "megaSpawner"], "megaFactory")
