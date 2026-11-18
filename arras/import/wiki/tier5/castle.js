const { combineStats, weaponArray, makeTurret } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.castleGun = makeTurret({
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

Class.castle = {
    PARENT: "genericTank",
    LABEL: "Castle",
    DANGER: 8,
    BODY: { FOV: base.FOV * 1.2 },
    GUNS: [
        ...weaponArray({
            POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5, ANGLE: 180 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.swarm]), TYPE: "swarm", STAT_CALCULATOR: "swarm" }
        }, 3, { delayIncrement: 1 / 3 })
    ],
    TURRETS: [
        ...weaponArray({
            TYPE: "castleGun",
            POSITION: { X: 8, ANGLE: 0, SIZE: 10, ARC: 190, LAYER: 0 }
        }, 3)
    ]
}

upgrade(["architect", "fortress"], "castle")
