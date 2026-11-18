const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.delfector = {
    PARENT: "genericTank",
    LABEL: "Delfector",
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
                TYPE: "boomerang",
                STAT_CALCULATOR: "block"
            }
        },
        {
            POSITION: { LENGTH: 6, WIDTH: 11, ASPECT: 1.2, X: 8, ANGLE: 180 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
                TYPE: "drone",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 3
            }
        }
    ]
}

upgrade(["boomer"], "delfector")
