const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")
const { statnames } = require("../constants.js")

const megaTrapShot = combineStats([g.trap, g.megaTrap])

Class.ultraTrapper = {
    PARENT: "genericTank",
    LABEL: "Ultra Trapper",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    GUNS: [
        { POSITION: { LENGTH: 14, WIDTH: 20 } },
        {
            POSITION: { LENGTH: 5, WIDTH: 20, ASPECT: 1.7, X: 13 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([megaTrapShot, { size: 1.3, health: 1.4, damage: 1.4, reload: 1.6 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}

upgrade(["annihilator", "megaTrapper"], "ultraTrapper")
