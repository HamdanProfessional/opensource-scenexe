const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.lorry = {
    PARENT: "genericTank",
    LABEL: "Lorry",
    DANGER: 8,
    GUNS: [
        {
            POSITION: { LENGTH: 18, WIDTH: 14, ASPECT: 1.8, X: 6 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.diesel, g.jalopy, { reload: 0.6, damage: 0.8, spray: 1.5, range: 0.7, speed: 0.8 }]),
                TYPE: "bullet"
            }
        }
    ]
}

upgrade(["jalopy"], "lorry")
