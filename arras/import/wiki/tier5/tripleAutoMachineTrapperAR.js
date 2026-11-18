const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.tripleAutoMachineTrapperAR = {
    PARENT: "genericTank",
    LABEL: "Triple Auto-Machine Trapper",
    DANGER: 8,
    GUNS: [
        ...weaponArray([
            {
                POSITION: { LENGTH: 15, WIDTH: 9, ASPECT: 1.4 }
            },
            {
                POSITION: { LENGTH: 3, WIDTH: 13, ASPECT: 1.3, X: 15 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trapSpray, g.machineGun, { size: 2 / 3, spray: 5 }]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ], 3)
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

upgrade(["autoMachineTrapper"], "tripleAutoMachineTrapperAR")
