const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.stoner = {
    PARENT: "genericTank",
    LABEL: "Stoner",
    DANGER: 8,
    STAT_NAMES: Class.bigCheese.STAT_NAMES,
    BODY: Class.bigCheese.BODY,
    GUNS: [
        {
            POSITION: { LENGTH: 14, WIDTH: 17, ASPECT: 1.3, X: 2 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.honcho, g.bigCheese, g.doper]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 2
            }
        },
        { POSITION: { LENGTH: 6, WIDTH: 1, ASPECT: -5, X: 8 } }
    ]
}

upgrade(["bigCheese", "junkie"], "stoner")
