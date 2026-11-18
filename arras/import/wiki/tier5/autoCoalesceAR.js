const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.autoCoalesceAR = {
    PARENT: "genericTank",
    LABEL: "Auto-Coalesce",
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 15, WIDTH: 8, Y: 5.5, ANGLE: 5 }
            },
            {
                POSITION: { LENGTH: 3.25, WIDTH: 8, ASPECT: 1.7, X: 14, Y: 5.5, ANGLE: 5 },
                PROPERTIES: { SHOOT_SETTINGS: combineStats([g.trap, g.twin]), TYPE: "trap", STAT_CALCULATOR: "trap" }
            }
        ], { delayIncrement: 0.5 }),
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
    ],
    TURRETS: [
        {
            POSITION: { X: 0, Y: 0, ANGLE: 180, SIZE: 10, ARC: 360, LAYER: 1 },
            TYPE: [
                "autoTurret",
                {
                    CONTROLLERS: ["nearestDifferentMaster"],
                    INDEPENDENT: true,
                    COLOR: "grey"
                }
            ]
        }
    ]
}

upgrade(["coalesce", "autoWark"], "autoCoalesceAR")
