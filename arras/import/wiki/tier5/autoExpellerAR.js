const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.autoExpellerAR = {
    PARENT: "genericTank",
    LABEL: "Auto-Expeller",
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 15, WIDTH: 8, ASPECT: 1.4, Y: 5.5, ANGLE: 5 }
            },
            {
                POSITION: { LENGTH: 3.25, WIDTH: 11, ASPECT: 1.3, X: 14, Y: 5.5, ANGLE: 5 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trapSpray, g.machineGun, { size: 2 / 3, spray: 5 }]),
                    TYPE: "trap",
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

upgrade(["expeller", "autoMachineTrapper", "autoWark"], "autoExpellerAR")
