const { combineStats } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

Class.doctorAR = {
    PARENT: "genericHealer",
    LABEL: "Doctor",
    STAT_NAMES: statnames.drone,
    GUNS: [
        {
            POSITION: { LENGTH: 13, WIDTH: 14, ASPECT: 1.3, X: 2 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.healer, g.bigCheese, { speed: 2, maxSpeed: 2, reload: 2 }]),
                TYPE: ["drone", { HEALER: true }],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 1,
                WAIT_TO_CYCLE: true
            }
        }
    ]
}

upgrade(["sootherAR"], "doctorAR")
