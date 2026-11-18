const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.machinistAR = {
    PARENT: "genericTank",
    LABEL: "Machinist",
    DANGER: 8,
    BODY: { FOV: base.FOV * 1.15, SPEED: base.SPEED * 14 / 15 },
    GUNS: [
        {
            POSITION: { LENGTH: 5, WIDTH: 11, X: 10.5 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 14, X: 15.5 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 14, ASPECT: 1.3, X: 18 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: "pillbox",
                STAT_CALCULATOR: "block",
                NO_LIMITATIONS: true,
                SYNCS_SKILLS: true,
                DESTROY_OLDEST_CHILD: true,
                MAX_CHILDREN: 6
            }
        },
        {
            POSITION: { LENGTH: 12, WIDTH: 14 }
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

upgrade(["engineer", "fashioner", "cobbler"], "machinistAR")
