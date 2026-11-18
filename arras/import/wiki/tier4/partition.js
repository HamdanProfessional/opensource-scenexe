const { combineStats, weaponMirror } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

const front = combineStats([g.basic, g.flankGuard, g.flankGuard, g.twin])
const trap = combineStats([g.trapSpray, g.machineGun, { size: 2 / 3, spray: 5 }])

Class.partition = {
    PARENT: "genericTank",
    LABEL: "Partition",
    STAT_NAMES: statnames.mixed,
    DANGER: 8,
    GUNS: weaponMirror([
        {
            POSITION: { LENGTH: 20, WIDTH: 5, Y: 3.25 },
            PROPERTIES: { SHOOT_SETTINGS: front, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 20, WIDTH: 5, Y: 8.75, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: front, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 14, WIDTH: 5, Y: 3.25, ANGLE: 185 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 6.5, ASPECT: 1.3, X: 13, Y: 3.25, ANGLE: 185, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: trap, TYPE: "trap", STAT_CALCULATOR: "trap" }
        },
        {
            POSITION: { LENGTH: 14, WIDTH: 5, Y: 8.75, ANGLE: 185 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 6.5, ASPECT: 1.3, X: 13, Y: 8.75, ANGLE: 185, DELAY: 0.75 },
            PROPERTIES: { SHOOT_SETTINGS: trap, TYPE: "trap", STAT_CALCULATOR: "trap" }
        }
    ], { delayIncrement: 0.5 })
}

upgrade(["bulwark", "machineGuard", "expeller"], "partition")
