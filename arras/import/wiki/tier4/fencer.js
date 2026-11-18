const { combineStats, weaponMirror } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

const front = combineStats([g.basic, g.flankGuard, g.flankGuard, g.twin])
const rear = combineStats([g.basic, g.flankGuard, g.flankGuard, g.twin, g.pen])

Class.fencer = {
    PARENT: "genericTank",
    LABEL: "Fencer",
    STAT_NAMES: statnames.mixed,
    DANGER: 8,
    GUNS: weaponMirror([
        {
            POSITION: { LENGTH: 20, WIDTH: 6, Y: 8.5 },
            PROPERTIES: { SHOOT_SETTINGS: front, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 20, WIDTH: 6, Y: 2.75, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: front, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 15, WIDTH: 6, Y: 8.5, ANGLE: 185 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 6, ASPECT: 1.7, X: 14, Y: 8.5, ANGLE: 185 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        },
        {
            POSITION: { LENGTH: 18, WIDTH: 6, Y: 2.75, ANGLE: 175, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: rear, TYPE: "bullet" }
        }
    ], { delayIncrement: 0.5 })
}

upgrade(["bulwark", "incarcerator", "hutch"], "fencer")
