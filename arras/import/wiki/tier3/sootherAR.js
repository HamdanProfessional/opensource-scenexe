const { combineStats } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

Class.sootherAR = {
    PARENT: "genericHealer",
    LABEL: "Soother",
    STAT_NAMES: statnames.drone,
    GUNS: [
        {
            POSITION: { LENGTH: 5, WIDTH: 10, ASPECT: 1.3, X: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.healer, { speed: 2, maxSpeed: 2 }]),
                TYPE: ["drone", { HEALER: true }],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 6,
                WAIT_TO_CYCLE: true
            }
        }
    ]
}

upgrade(["healerAR"], "sootherAR")
