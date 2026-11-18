const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { statnames } = require("../constants.js")

const artilleryShot = combineStats([g.basic, g.pounder, g.destroyer, g.artillery])
const miniTrapShot = combineStats([g.trap, g.twin, g.gunner, { speed: 1.2 }])
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

Class.pivoter = {
    PARENT: "genericTank",
    LABEL: "Pivoter",
    DANGER: 8,
    STAT_NAMES: statnames.trap,
    GUNS: [
        ...dischargerLaunchers(0),
        heavyCannon(12)
    ]
}

upgrade(["foctillery", "discharger"], "pivoter")
