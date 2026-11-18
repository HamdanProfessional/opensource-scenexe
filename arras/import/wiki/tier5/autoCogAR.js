const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.autoCogAR = {
    PARENT: "genericTank",
    LABEL: "Auto-Cog",
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
        ], { delayIncrement: 0.5 })
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

upgrade(["cog", "autoMech", "autoWark"], "autoCogAR")
