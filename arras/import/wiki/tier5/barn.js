const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.barn = {
    PARENT: "genericTank",
    LABEL: "Barn",
    DANGER: 8,
    STAT_NAMES: Class.hangar.STAT_NAMES,
    BODY: Class.hangar.BODY,
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 12, WIDTH: 9.5, ASPECT: 0.75, X: 3, Y: 5.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.honcho]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm"
            }
        }, { delayIncrement: 0.5 }),
        { POSITION: { LENGTH: 15, WIDTH: 15 } },
        {
            POSITION: { LENGTH: 1, WIDTH: 17, X: 15 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.minion, g.spawner, g.honcho]),
                TYPE: "minion",
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

upgrade(["hangar", "baltimore", "foundry"], "barn")
