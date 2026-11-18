const { combineStats } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

Class.surgeonAR = {
    PARENT: "genericHealer",
    LABEL: "Surgeon",
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: { LENGTH: 5, WIDTH: 10, X: 9.5 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 13, X: 14.5 }
        },
        {
            POSITION: { LENGTH: 1.5, WIDTH: 13, ASPECT: 1.3, X: 17 },
            PROPERTIES: {
                MAX_CHILDREN: 2,
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, { speed: 0.9, maxSpeed: 0.9, size: 1.1 }]),
                TYPE: "medkit",
                NO_LIMITATIONS: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "block"
            }
        },
        {
            POSITION: { LENGTH: 11, WIDTH: 13 }
        }
    ]
}

upgrade(["scientistAR"], "surgeonAR")
