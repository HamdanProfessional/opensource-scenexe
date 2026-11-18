const { combineStats, weaponArray, makeTurret } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.healerAutoTankGunAR = makeTurret({
    GUNS: [
        {
            POSITION: { LENGTH: 11, WIDTH: 9, ASPECT: -0.4, X: 9.5 }
        },
        {
            POSITION: { LENGTH: 18, WIDTH: 10 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.healer]),
                TYPE: "healerBullet"
            }
        }
    ],
    TURRETS: [
        {
            TYPE: "healerHat",
            POSITION: { SIZE: 13, LAYER: 1 }
        }
    ]
}, { canRepel: true, limitFov: true, fov: 3 })

Class.healer3AR = {
    PARENT: "genericHealer",
    LABEL: "Healer-3",
    FACING_TYPE: ["spin", { speed: 0.02 }],
    TURRETS: [
        ...weaponArray({
            TYPE: "healerAutoTankGunAR",
            POSITION: { SIZE: 11, X: 8, ARC: 190 }
        }, 3),
        {
            TYPE: "healerHat",
            POSITION: { SIZE: 13, LAYER: 1 }
        }
    ]
}

upgrade(["triHealerAR"], "healer3AR")
