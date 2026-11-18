const { combineStats } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

Class.scientistAR = {
    PARENT: "genericHealer",
    LABEL: "Scientist",
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: { LENGTH: 15, WIDTH: 7 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 7, ASPECT: 1.7, X: 15 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "medkit",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}

upgrade(["healerAR"], "scientistAR")
