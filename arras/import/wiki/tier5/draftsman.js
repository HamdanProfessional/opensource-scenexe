const { combineStats, weaponArray, makeTurret } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.draftsmanGun = makeTurret({
    GUNS: [
        {
            POSITION: { LENGTH: 20, WIDTH: 16 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 16, ASPECT: 1.1, X: 20 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.flankGuard]),
                TYPE: "draftsmanTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ]
}, { canRepel: true, forceOverride: true, fov: 3 })

Class.draftsmanTrap = {
    PARENT: "setTrap",
    LABEL: "Charged Trap",
    DIE_AT_RANGE: true,
    GUNS: [
        ...weaponArray({
            POSITION: { LENGTH: 1, WIDTH: 6 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { size: 0.45, damage: 0.8, range: 0.6 }]),
                TYPE: "trap",
                SHOOT_ON_DEATH: true,
                STAT_CALCULATOR: "trap"
            }
        }, 4)
    ]
}

Class.draftsman = {
    PARENT: "genericTank",
    LABEL: "Draftsman",
    DANGER: 8,
    FACING_TYPE: [
        "spin",
        { speed: 0.02 }
    ],
    GUNS: [],
    TURRETS: [
        ...weaponArray({
            TYPE: "draftsmanGun",
            POSITION: { X: 8, ANGLE: 0, SIZE: 12, ARC: 190, LAYER: 0 }
        }, 3)
    ]
}

upgrade(["architect", "charger"], "draftsman")
