const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.megaCaptain = {
    PARENT: "genericTank",
    LABEL: "Mega Captain",
    DANGER: 8,
    STAT_NAMES: Class.captain.STAT_NAMES,
    BODY: Class.captain.BODY,
    GUNS: [
        ...weaponMirror([
            { POSITION: { LENGTH: 4.5, WIDTH: 12, X: 10.5, ANGLE: 90 } },
            {
                POSITION: { LENGTH: 1, WIDTH: 14, X: 15, ANGLE: 90 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.minion, g.spawner, { size: 0.8 }]),
                    TYPE: "megaMinion",
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                    MAX_CHILDREN: 3
                }
            },
            { POSITION: { LENGTH: 11.5, WIDTH: 14, ANGLE: 90 } }
        ])
    ]
}

upgrade(["megaSpawner", "captain"], "megaCaptain")
