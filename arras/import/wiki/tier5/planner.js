const { combineStats, weaponArray, weaponMirror, makeTurret } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.plannerGun = makeTurret({
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

Class.planner = {
    PARENT: "genericTank",
    LABEL: "Planner",
    DANGER: 8,
    BODY: { FOV: base.FOV * 1.15, SPEED: base.SPEED * 14 / 15 },
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 17, WIDTH: 5, Y: -5, ANGLE: -7, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]), TYPE: "bullet" }
        }, { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 17, WIDTH: 12 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 12, ASPECT: 1.1, X: 17 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ],
    TURRETS: [
        ...weaponArray({
            TYPE: "plannerGun",
            POSITION: { X: 6, ANGLE: 0, SIZE: 8, ARC: 190, LAYER: 0 }
        }, 3)
    ]
}

upgrade(["forger"], "planner")
