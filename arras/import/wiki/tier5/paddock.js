const { combineStats, weaponArray, makeTurret } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.paddockGun = makeTurret({
    GUNS: [
        {
            POSITION: { LENGTH: 24, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pen, g.flankGuard]), TYPE: "bullet" }
        },
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

Class.paddock = {
    PARENT: "genericTank",
    LABEL: "Paddock",
    DANGER: 8,
    FACING_TYPE: [
        "spin",
        { speed: 0.02 }
    ],
    GUNS: [],
    TURRETS: [
        ...weaponArray({
            TYPE: "paddockGun",
            POSITION: { X: 8, ANGLE: 0, SIZE: 12, ARC: 190, LAYER: 0 }
        }, 3)
    ]
}

upgrade(["architect", "stall", "triPen"], "paddock")
