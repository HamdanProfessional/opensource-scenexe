const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.utilizerAR = {
    PARENT: "genericTank",
    LABEL: "Utilizer",
    DANGER: 8,
    GUNS: [
        {
            POSITION: { LENGTH: 21, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pen]), TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 15, WIDTH: 8 }
        },
        {
            POSITION: { LENGTH: 12, WIDTH: 11 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 7, ASPECT: 1.7, X: 15 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.trap]), TYPE: "autoTrap", STAT_CALCULATOR: "trap" }
        },
        {
            POSITION: { LENGTH: 6, WIDTH: 11, ASPECT: 1.2, X: 8, ANGLE: 180 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
                TYPE: [
                    "drone",
                    { INDEPENDENT: true }
                ],
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 3
            }
        }
    ]
}

upgrade(["operator", "interner", "cobbler"], "utilizerAR")
