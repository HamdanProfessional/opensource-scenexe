const { combineStats, weaponMirror } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

const front = combineStats([g.basic, g.flankGuard, g.flankGuard, g.twin])
const trap = combineStats([g.trap, g.twin])

Class.stockade = {
    PARENT: "genericTank",
    LABEL: "Stockade",
    STAT_NAMES: statnames.mixed,
    DANGER: 8,
    GUNS: weaponMirror([
        {
            POSITION: { LENGTH: 20, WIDTH: 6, Y: 8.5 },
            PROPERTIES: { SHOOT_SETTINGS: front, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 7.5, WIDTH: 7.5, ASPECT: 0.6, X: 7, Y: 3.25, DELAY: 0.25 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm"
            }
        },
        {
            POSITION: { LENGTH: 14, WIDTH: 6, Y: 5.5, ANGLE: 185 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 6, ASPECT: 1.7, X: 13, Y: 5.5, ANGLE: 185 },
            PROPERTIES: { SHOOT_SETTINGS: trap, TYPE: "trap", STAT_CALCULATOR: "trap" }
        }
    ], { delayIncrement: 0.5 })
}

upgrade(["bulwark", "peashooter"], "stockade")
