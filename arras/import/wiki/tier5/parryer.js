const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.parryerBoomerang = {
    PARENT: "boomerang",
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "pillboxTurret"
        }
    ]
}

Class.parryer = {
    PARENT: "genericTank",
    LABEL: "Parryer",
    DANGER: 8,
    FACING_TYPE: "locksFacing",
    BODY: { FOV: base.FOV * 1.15, SPEED: base.SPEED * 14 / 15 },
    GUNS: [
        {
            POSITION: { LENGTH: 18, WIDTH: 10 }
        },
        {
            POSITION: { LENGTH: 13, WIDTH: 10, ASPECT: -1.9 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 10, ASPECT: 1.3, X: 18 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.boomerang]),
                TYPE: "parryerBoomerang",
                STAT_CALCULATOR: "block"
            }
        }
    ]
}

upgrade(["engineer", "boomer"], "parryer")
