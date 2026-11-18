const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.recoiler = {
    PARENT: "genericTank",
    LABEL: "Recoiler",
    DANGER: 8,
    FACING_TYPE: "locksFacing",
    BODY: { FOV: base.FOV * 1.15, SPEED: base.SPEED * 14 / 15 },
    GUNS: [
        {
            POSITION: { LENGTH: 18, WIDTH: 16 }
        },
        {
            POSITION: { LENGTH: 13, WIDTH: 16, ASPECT: -1.9 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 16, ASPECT: 1.2, X: 18 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.construct, g.boomerang]),
                TYPE: "boomerang",
                STAT_CALCULATOR: "block"
            }
        }
    ]
}

upgrade(["construct", "boomer"], "recoiler")
