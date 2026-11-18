const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const annihilatorShot = combineStats([g.basic, g.pounder, g.destroyer, g.annihilator])

Class.bigMac = {
    PARENT: "genericTank",
    LABEL: "Big Mac",
    DANGER: 8,
    GUNS: [
        {
            POSITION: { LENGTH: 20.5, WIDTH: 30 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([annihilatorShot, { reload: 2, damage: 2, recoil: 2, size: 1.3, health: 1.3 }]),
                TYPE: "bullet"
            }
        }
    ]
}

upgrade(["annihilator"], "bigMac")
