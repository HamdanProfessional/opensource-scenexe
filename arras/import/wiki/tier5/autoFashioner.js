const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.autoFashioner = {
    PARENT: "genericTank",
    LABEL: "Auto-Fashioner",
    DANGER: 8,
    BODY: { FOV: base.FOV * 1.15, SPEED: base.SPEED * 14 / 15 },
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 15, WIDTH: 7, Y: 6, ANGLE: 14 }
            },
            {
                POSITION: { LENGTH: 2, WIDTH: 7, ASPECT: 1.1, X: 15, Y: 6, ANGLE: 14 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                    TYPE: "setTrap",
                    STAT_CALCULATOR: "block"
                }
            }
        ], { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 18, WIDTH: 12 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 12, ASPECT: 1.1, X: 18 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block"
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

upgrade(["autoBuilder", "fashioner"], "autoFashioner")
