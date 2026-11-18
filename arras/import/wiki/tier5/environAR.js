const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.environAR = {
    PARENT: "genericTank",
    LABEL: "Environ",
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 13, WIDTH: 6, ANGLE: 30 }
            },
            {
                POSITION: { LENGTH: 3, WIDTH: 6, ASPECT: 1.7, X: 13, ANGLE: 30 },
                PROPERTIES: { SHOOT_SETTINGS: combineStats([g.trap]), TYPE: "trap", STAT_CALCULATOR: "trap" }
            }
        ], { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 20, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pen]), TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 4, WIDTH: 8, ASPECT: 1.7, X: 13 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.trap]), TYPE: "trap", STAT_CALCULATOR: "trap" }
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

upgrade(["encircler", "interner", "deviation"], "environAR")
