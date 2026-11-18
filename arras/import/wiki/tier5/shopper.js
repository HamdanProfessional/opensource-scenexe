const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.shopper = {
    PARENT: "genericTank",
    LABEL: "Shopper",
    DANGER: 8,
    STAT_NAMES: Class.factory.STAT_NAMES,
    BODY: Class.factory.BODY,
    GUNS: [
        { POSITION: { LENGTH: 15.5, WIDTH: 13 } },
        {
            POSITION: { LENGTH: 1, WIDTH: 17, X: 15 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.minion, g.honcho]),
                TYPE: "minion",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 6
            }
        },
        { POSITION: { LENGTH: 12, WIDTH: 17 } }
    ]
}

upgrade(["factory", "foundry"], "shopper")
