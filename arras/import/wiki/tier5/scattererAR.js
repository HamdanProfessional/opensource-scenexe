const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.scattererAR = {
    PARENT: "genericTank",
    LABEL: "Scatterer",
    DANGER: 8,
    GUNS: [
        {
            POSITION: { LENGTH: 9, WIDTH: 11, ASPECT: 1.6, X: 16 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }, g.atomizer, { reload: 0.7, spray: 1.5 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: { LENGTH: 12, WIDTH: 10, ASPECT: 1.4, X: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                TYPE: "bullet"
            }
        }
    ]
}

upgrade(["atomizer"], "scattererAR")
