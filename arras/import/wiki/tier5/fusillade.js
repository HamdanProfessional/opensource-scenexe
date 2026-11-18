const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { statnames } = require("../constants.js")

const artilleryShot = combineStats([g.basic, g.pounder, g.destroyer, g.artillery])
const miniTrapShot = combineStats([g.trap, g.twin, g.gunner, { speed: 1.2 }])
const miniTrapLauncher = (length, y, angle, delay = 0, shot = miniTrapShot) => [
    { POSITION: { LENGTH: length, WIDTH: 3.5, Y: y, ANGLE: angle } },
    {
        POSITION: { LENGTH: 2, WIDTH: 3.5, ASPECT: 1.77, X: length, Y: y, ANGLE: angle, DELAY: delay },
        PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "trap", STAT_CALCULATOR: "trap" }
    }
]
const dischargerLaunchers = (angle = 7, shot = miniTrapShot, type = "trap") => weaponMirror([
    { POSITION: { LENGTH: 15, WIDTH: 3.5, Y: -5.5, ANGLE: -angle } },
    {
        POSITION: { LENGTH: 2, WIDTH: 3.5, ASPECT: 1.77, X: 15, Y: -5.5, ANGLE: -angle },
        PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: type, STAT_CALCULATOR: "trap" }
    }
], { delayIncrement: 0.5 })
const heavyCannon = (width = 12, shot = artilleryShot) => ({
    POSITION: { LENGTH: 19, WIDTH: width },
    PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
})

Class.fusillade = {
    PARENT: "genericTank",
    LABEL: "Fusillade",
    DANGER: 8,
    STAT_NAMES: statnames.trap,
    GUNS: [
        ...weaponMirror(miniTrapLauncher(11, -9, -3.5, 0.3), { delayIncrement: 0.2 }),
        ...dischargerLaunchers(7),
        heavyCannon(12)
    ]
}

upgrade(["mortar", "discharger"], "fusillade")
