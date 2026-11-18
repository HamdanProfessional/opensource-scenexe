const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.megaFoundry = {
    PARENT: "genericTank",
    LABEL: "Mega Foundry",
    DANGER: 8,
    STAT_NAMES: Class.foundry.STAT_NAMES,
    BODY: Class.foundry.BODY,
    GUNS: [
        { POSITION: { LENGTH: 15, WIDTH: 15 } },
        {
            POSITION: { LENGTH: 1, WIDTH: 17, X: 15 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.minion, g.spawner, g.honcho, { size: 0.8 }]),
                TYPE: "megaMinion",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 3
            }
        },
        { POSITION: { LENGTH: 11.5, WIDTH: 17 } }
    ]
}

upgrade(["megaSpawner", "foundry"], "megaFoundry")
