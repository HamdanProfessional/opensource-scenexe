const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const sharp = { reload: 0.8, damage: 0.85, spray: 0.7 }

Class.condenser = {
    PARENT: "genericTank",
    LABEL: "Condenser",
    DANGER: 8,
    GUNS: [
        {
            POSITION: { LENGTH: 25, WIDTH: 5.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }, sharp]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: { LENGTH: 14, WIDTH: 8, ASPECT: 1.25, X: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.gatlingGun, sharp]),
                TYPE: "bullet"
            }
        }
    ]
}

upgrade(["focal", "foamer"], "condenser")
