const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.mandarin = {
    PARENT: "genericTank",
    LABEL: "Mandarin",
    DANGER: 8,
    STAT_NAMES: Class.factory.STAT_NAMES,
    BODY: Class.factory.BODY,
    GUNS: [
        { POSITION: { LENGTH: 15.5, WIDTH: 11 } },
        {
            POSITION: { LENGTH: 1, WIDTH: 14, X: 15 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.minion]),
                TYPE: "minion",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 4
            }
        },
        { POSITION: { LENGTH: 12, WIDTH: 14 } },
        ...weaponMirror([
            { POSITION: { LENGTH: 4.5, WIDTH: 10, X: 10.5, ANGLE: 90 } },
            {
                POSITION: { LENGTH: 1, WIDTH: 12, X: 15, ANGLE: 90 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.minion, g.spawner]),
                    TYPE: "minion",
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

upgrade(["factory", "captain"], "mandarin")
