const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.megaAutoMachineTrapperAR = {
    PARENT: "genericTank",
    LABEL: "Mega Auto-Machine Trapper",
    DANGER: 8,
    GUNS: [
        {
            POSITION: { LENGTH: 14, WIDTH: 13, ASPECT: 1.4 }
        },
        {
            POSITION: { LENGTH: 5, WIDTH: 17, ASPECT: 1.3, X: 13 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trapSpray, g.machineGun, g.megaTrap, { spray: 5 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ],
    TURRETS: [
        {
            POSITION: { X: 0, Y: 0, ANGLE: 180, SIZE: 12, ARC: 360, LAYER: 1 },
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

upgrade(["autoMachineTrapper"], "megaAutoMachineTrapperAR")
