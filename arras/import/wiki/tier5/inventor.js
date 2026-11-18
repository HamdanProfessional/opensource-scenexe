const { combineStats, weaponArray, makeTurret } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.inventorGun = makeTurret({
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

Class.inventor = {
    PARENT: "genericTank",
    LABEL: "Inventor",
    DANGER: 8,
    HAS_NO_RECOIL: true,
    GUNS: [
        ...weaponArray([
            {
                POSITION: { LENGTH: 15, WIDTH: 7 }
            },
            {
                POSITION: { LENGTH: 3, WIDTH: 7, ASPECT: 1.7, X: 15 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.hexaTrapper]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ], 7, { delayIncrement: 1 / 7 })
    ],
    TURRETS: [
        ...weaponArray({
            TYPE: "inventorGun",
            POSITION: { X: 8, ANGLE: 0, SIZE: 9, ARC: 190, LAYER: 0 }
        }, 3)
    ]
}

upgrade(["architect", "septaTrapper"], "inventor")
