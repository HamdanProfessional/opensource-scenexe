const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const shot = combineStats([g.basic, g.twin, g.gunner, g.machineGunner, { reload: 0.75, spray: 1.3 }])

Class.motorGunner = {
    PARENT: "genericTank",
    LABEL: "Motor Gunner",
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 14, WIDTH: 3, ASPECT: 4, X: -6, Y: 7.75, DELAY: 0.8 },
                PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 14, WIDTH: 3, ASPECT: 4, X: -3, Y: 5, DELAY: 0.6 },
                PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 14, WIDTH: 3, ASPECT: 4, Y: -2.5, DELAY: 0.2 },
                PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
            }
        ], { delayIncrement: 0.2 }),
        {
            POSITION: { LENGTH: 14, WIDTH: 3, ASPECT: 4, X: 3 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        }
    ]
}

upgrade(["machineGunner", "battery"], "motorGunner")
