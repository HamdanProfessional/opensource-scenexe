const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.topBanana = {
    PARENT: "genericTank",
    LABEL: "Top Banana",
    DANGER: 8,
    STAT_NAMES: Class.foundry.STAT_NAMES,
    BODY: Class.foundry.BODY,
    GUNS: [
        { POSITION: { LENGTH: 15, WIDTH: 19 } },
        {
            POSITION: { LENGTH: 1, WIDTH: 22, X: 15 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.minion, g.spawner, g.honcho, g.bigCheese, { size: 1.4, health: 2.5, damage: 1.8 }]),
                TYPE: "minion",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 1
            }
        },
        { POSITION: { LENGTH: 11.5, WIDTH: 22 } }
    ]
}

upgrade(["foundry", "bigCheese"], "topBanana")
