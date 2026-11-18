const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.contriverAR = {
    PARENT: "genericTank",
    LABEL: "Contriver",
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 15, WIDTH: 8, Y: 4.45, ANGLE: 10 }
            },
            {
                POSITION: { LENGTH: 12, WIDTH: 11, Y: 4.45, ANGLE: 10 }
            },
            {
                POSITION: { LENGTH: 3, WIDTH: 7, ASPECT: 1.7, X: 15, Y: 4.45, ANGLE: 10 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
                    TYPE: "autoTrap",
                    STAT_CALCULATOR: "trap"
                }
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
    ]
}

upgrade(["cog", "cobbler", "coalesce"], "contriverAR")
