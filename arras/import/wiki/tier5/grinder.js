const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.grinder = {
    PARENT: "genericTank",
    LABEL: "Grinder",
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
        { POSITION: { LENGTH: 4.5, WIDTH: 10, X: 10.5 } },
        {
            POSITION: { LENGTH: 1, WIDTH: 12, X: 15 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.minion, g.spawner]),
                TYPE: ["minion", { INVISIBLE: [0.06, 0.03] }],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 4
            }
        },
        { POSITION: { LENGTH: 11.5, WIDTH: 12 } }
    ]
}

upgrade(["hangar", "laborer"], "grinder")
