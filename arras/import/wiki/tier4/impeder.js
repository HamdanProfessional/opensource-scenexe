const { combineStats, weaponMirror } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

const front = combineStats([g.basic, g.flankGuard, g.flankGuard, g.twin])
const trap = combineStats([g.trap, g.twin])

Class.impeder = {
    PARENT: "genericTank",
    LABEL: "Impeder",
    STAT_NAMES: statnames.mixed,
    DANGER: 8,
    GUNS: weaponMirror([
        {
            POSITION: { LENGTH: 20, WIDTH: 6, Y: 3 },
            PROPERTIES: { SHOOT_SETTINGS: front, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 20, WIDTH: 6, Y: 8.75, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: front, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 15, WIDTH: 6, Y: 3, ANGLE: 185 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 6, ASPECT: 1.7, X: 14, Y: 3, ANGLE: 185 },
            PROPERTIES: { SHOOT_SETTINGS: trap, TYPE: "autoTrap", STAT_CALCULATOR: "trap" }
        },
        {
            POSITION: { LENGTH: 15, WIDTH: 6, Y: 8.75, ANGLE: 185 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 6, ASPECT: 1.7, X: 14, Y: 8.75, ANGLE: 185, DELAY: 0.5 },
            PROPERTIES: { SHOOT_SETTINGS: trap, TYPE: "autoTrap", STAT_CALCULATOR: "trap" }
        }
    ], { delayIncrement: 0.5 })
}

upgrade(["bulwark", "mechGuard", "cog"], "impeder")
