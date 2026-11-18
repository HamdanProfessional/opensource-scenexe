const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const sharp = { spray: 0.7 }

Class.fragmenter = {
    PARENT: "genericTank",
    LABEL: "Fragmenter",
    DANGER: 8,
    GUNS: [
        {
            POSITION: { LENGTH: 25, WIDTH: 5.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15, reload: 0.7 }, sharp]),
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

upgrade(["focal", "atomizer"], "fragmenter")
