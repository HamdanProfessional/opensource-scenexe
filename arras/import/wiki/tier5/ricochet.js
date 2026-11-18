const { combineStats, weaponArray, makeTurret } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.ricochetGun = makeTurret({
    GUNS: [
        {
            POSITION: { LENGTH: 18, WIDTH: 14 }
        },
        {
            POSITION: { LENGTH: 13, WIDTH: 14, ASPECT: -1.9 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 14, ASPECT: 1.3, X: 18 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.boomerang, g.flankGuard]),
                TYPE: "boomerang",
                STAT_CALCULATOR: "block"
            }
        }
    ]
}, { canRepel: true, forceOverride: true, fov: 3 })

Class.ricochet = {
    PARENT: "genericTank",
    LABEL: "Ricochet",
    DANGER: 8,
    FACING_TYPE: [
        "spin",
        { speed: 0.02 }
    ],
    GUNS: [],
    TURRETS: [
        ...weaponArray({
            TYPE: "ricochetGun",
            POSITION: { X: 8, ANGLE: 0, SIZE: 12, ARC: 190, LAYER: 0 }
        }, 3)
    ]
}

upgrade(["boomer", "architect"], "ricochet")
