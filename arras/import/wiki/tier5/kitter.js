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

Class.kitterTrap = {
    PARENT: "trap",
    TURRETS: [{
        POSITION: { SIZE: 8, X: 0, Y: 0, ANGLE: 0, ARC: 360, LAYER: 1 },
        TYPE: ["autoTurret", { CONTROLLERS: ["nearestDifferentMaster"], INDEPENDENT: true, COLOR: "grey" }]
    }]
}

Class.kitter = {
    PARENT: "genericTank",
    LABEL: "Kitter",
    DANGER: 8,
    STAT_NAMES: statnames.trap,
    GUNS: [
        ...dischargerLaunchers(7, miniTrapShot, "kitterTrap"),
        heavyCannon(12)
    ]
}

upgrade(["discharger"], "kitter")
