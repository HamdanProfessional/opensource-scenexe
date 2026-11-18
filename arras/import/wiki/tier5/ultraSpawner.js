const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.ultraMinion = {
    PARENT: "megaMinion",
    LABEL: "Ultra Minion",
    GUNS: [
        {
            POSITION: { LENGTH: 17, WIDTH: 17 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minionGun, g.pounder, { damage: 1.6, size: 1.2 }]),
                WAIT_TO_CYCLE: true,
                TYPE: "bullet"
            }
        }
    ]
}

Class.ultraSpawner = {
    PARENT: "genericTank",
    LABEL: "Ultra Spawner",
    DANGER: 8,
    STAT_NAMES: Class.megaSpawner.STAT_NAMES,
    BODY: Class.megaSpawner.BODY,
    GUNS: [
        { POSITION: { LENGTH: 15, WIDTH: 15 } },
        {
            POSITION: { LENGTH: 1, WIDTH: 17, X: 15 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.minion, g.spawner, { size: 0.8 }]),
                TYPE: "ultraMinion",
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

upgrade(["megaSpawner"], "ultraSpawner")
