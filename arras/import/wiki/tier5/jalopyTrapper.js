const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")
const { statnames } = require("../constants.js")

Class.jalopyTrapper = {
    PARENT: "genericTank",
    LABEL: "Jalopy Trapper",
    DANGER: 8,
    STAT_NAMES: statnames.mixed,
    GUNS: [
        {
            POSITION: { LENGTH: 18, WIDTH: 12, ASPECT: 1.8, X: 6 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.diesel, g.jalopy]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: { LENGTH: 14, WIDTH: 8, ANGLE: 180 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 8, ASPECT: 1.7, X: 14, ANGLE: 180 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}

upgrade(["jalopy"], "jalopyTrapper")
