const { combineStats, weaponArray, makeTurret } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.originatorGun = makeTurret({
    GUNS: [
        {
            POSITION: { LENGTH: 20, WIDTH: 16 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 16, ASPECT: 1.1, X: 20 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.flankGuard]),
                TYPE: "pillbox",
                STAT_CALCULATOR: "block",
                NO_LIMITATIONS: true,
                DESTROY_OLDEST_CHILD: true,
                MAX_CHILDREN: 3
            }
        }
    ]
}, { canRepel: true, forceOverride: true, fov: 3 })

Class.originator = {
    PARENT: "genericTank",
    LABEL: "Originator",
    DANGER: 8,
    FACING_TYPE: [
        "spin",
        { speed: 0.02 }
    ],
    GUNS: [],
    TURRETS: [
        ...weaponArray({
            TYPE: "originatorGun",
            POSITION: { X: 8, ANGLE: 0, SIZE: 12, ARC: 190, LAYER: 0 }
        }, 3)
    ]
}

upgrade(["engineer", "architect", "triMech"], "originator")
