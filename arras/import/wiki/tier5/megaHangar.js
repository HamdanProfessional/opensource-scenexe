const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.megaHangar = {
    PARENT: "genericTank",
    LABEL: "Mega Hangar",
    DANGER: 8,
    STAT_NAMES: Class.hangar.STAT_NAMES,
    BODY: Class.hangar.BODY,
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 8.5, WIDTH: 8.2, ASPECT: 0.6, X: 3, Y: 5.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm"
            }
        }, { delayIncrement: 0.5 }),
        { POSITION: { LENGTH: 15, WIDTH: 13 } },
        {
            POSITION: { LENGTH: 1, WIDTH: 15, X: 15 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.minion, g.spawner, { size: 0.8 }]),
                TYPE: "megaMinion",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 4
            }
        },
        { POSITION: { LENGTH: 11.5, WIDTH: 15 } }
    ]
}

upgrade(["hangar", "megaSpawner"], "megaHangar")
