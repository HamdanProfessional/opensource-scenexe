const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { statnames } = require("../constants.js")

const miniTrapShot = combineStats([g.trap, g.twin, g.gunner, { speed: 1.2 }])
const dischargerLaunchers = (angle = 7, shot = miniTrapShot, type = "trap") => weaponMirror([
    { POSITION: { LENGTH: 15, WIDTH: 3.5, Y: -5.5, ANGLE: -angle } },
    {
        POSITION: { LENGTH: 2, WIDTH: 3.5, ASPECT: 1.77, X: 15, Y: -5.5, ANGLE: -angle },
        PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: type, STAT_CALCULATOR: "trap" }
    }
], { delayIncrement: 0.5 })

Class.flurry = {
    PARENT: "genericTank",
    LABEL: "Flurry",
    DANGER: 8,
    BODY: Class.fieldGun.BODY,
    STAT_NAMES: statnames.trap,
    GUNS: [
        ...dischargerLaunchers(7),
        ...Class.fieldGun.GUNS.slice(2)
    ]
}

upgrade(["fieldGun", "discharger"], "flurry")
