const { combineStats, weaponArray, makeTurret } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.mastermindGun = makeTurret({
    GUNS: [
        {
            POSITION: { LENGTH: 20, WIDTH: 16 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 16, ASPECT: 1.1, X: 20 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.flankGuard]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ]
}, { canRepel: true, forceOverride: true, fov: 3 })

Class.mastermind = {
    PARENT: "genericTank",
    LABEL: "Mastermind",
    DANGER: 8,
    BODY: { FOV: base.FOV * 1.15, SPEED: base.SPEED * 14 / 15 },
    GUNS: [
        {
            POSITION: { LENGTH: 18, WIDTH: 18 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 18, ASPECT: 1.2, X: 18 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.construct]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ],
    TURRETS: [
        ...weaponArray({
            TYPE: "mastermindGun",
            POSITION: { X: 8, ANGLE: 0, SIZE: 10, ARC: 190, LAYER: 0 }
        }, 3)
    ]
}

upgrade(["construct", "architect"], "mastermind")
