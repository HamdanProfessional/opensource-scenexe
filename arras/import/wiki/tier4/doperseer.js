const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.doperseer = {
    PARENT: "genericTank",
    LABEL: "Doperseer",
    DANGER: 7,
    STAT_NAMES: Class.doper.STAT_NAMES,
    BODY: Class.doper.BODY,
    GUNS: [
        {
            POSITION: { LENGTH: 5, WIDTH: 11, ASPECT: 1.3, X: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.doper]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 3
            }
        },
        { POSITION: { LENGTH: 6, WIDTH: 1, ASPECT: -5, X: 8 } },
        ...weaponMirror([
            {
                POSITION: { LENGTH: 6, WIDTH: 12, ASPECT: 1.2, X: 8, ANGLE: 90 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.doper]),
                    TYPE: "drone",
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                    MAX_CHILDREN: 3
                }
            },
            { POSITION: { LENGTH: 6, WIDTH: 1, ASPECT: -5, X: 9, ANGLE: 90 } }
        ])
    ]
}

upgrade(["doper"], "doperseer")
