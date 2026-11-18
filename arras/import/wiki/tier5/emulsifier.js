const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.emulsifier = {
    PARENT: "genericTank",
    LABEL: "Emulsifier",
    DANGER: 8,
    GUNS: [
        {
            POSITION: { LENGTH: 6, WIDTH: 7, ASPECT: 1.4, X: 18 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }, g.atomizer]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: { LENGTH: 12, WIDTH: 14, ASPECT: 1.4, X: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, { reload: 0.75 }]),
                TYPE: "bullet"
            }
        }
    ]
}

upgrade(["atomizer"], "emulsifier")
