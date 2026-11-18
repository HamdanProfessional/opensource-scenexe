const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.toiler = {
    PARENT: "genericTank",
    LABEL: "Toiler",
    DANGER: 8,
    STAT_NAMES: Class.captain.STAT_NAMES,
    BODY: Class.captain.BODY,
    GUNS: [
        ...weaponMirror([
            { POSITION: { LENGTH: 4.5, WIDTH: 10, X: 10.5, ANGLE: 90 } },
            {
                POSITION: { LENGTH: 1, WIDTH: 12, X: 15, ANGLE: 90 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.minion, g.spawner]),
                    TYPE: ["minion", { INVISIBLE: [0.06, 0.03] }],
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                    MAX_CHILDREN: 3
                }
            },
            { POSITION: { LENGTH: 11.5, WIDTH: 12, ANGLE: 90 } }
        ])
    ]
}

upgrade(["captain", "laborer"], "toiler")
