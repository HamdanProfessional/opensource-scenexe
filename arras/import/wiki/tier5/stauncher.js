const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const cannon = combineStats([g.basic, g.twin, g.gunner, g.machineGunner, { damage: 0.8, health: 0.8 }])

Class.stauncher = {
    PARENT: "genericTank",
    LABEL: "Stauncher",
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 14, WIDTH: 3, ASPECT: 4, X: -3, Y: 5, DELAY: 0.6 },
                PROPERTIES: { SHOOT_SETTINGS: cannon, TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 14, WIDTH: 3, ASPECT: 4, Y: -2.5, DELAY: 0.2 },
                PROPERTIES: { SHOOT_SETTINGS: cannon, TYPE: "bullet" }
            }
        ], { delayIncrement: 0.2 }),
        {
            POSITION: { LENGTH: 14, WIDTH: 3, ASPECT: 4, X: 3 },
            PROPERTIES: { SHOOT_SETTINGS: cannon, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 22, WIDTH: 11, ASPECT: 1.5, X: 4 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.diesel, { damage: 1.15, speed: 1.1 }]),
                TYPE: "bullet"
            }
        }
    ]
}

upgrade(["foamer"], "stauncher")
