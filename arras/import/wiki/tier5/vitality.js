const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { statnames } = require("../constants.js")

const artilleryShot = combineStats([g.basic, g.pounder, g.destroyer, g.artillery])
const miniTrapShot = combineStats([g.trap, g.twin, g.gunner, { speed: 1.2 }])
const droneShot = combineStats([g.drone, g.overseer])
const rearDrone = {
    POSITION: { LENGTH: 6, WIDTH: 12, ASPECT: 1.2, X: 8, ANGLE: 180 },
    PROPERTIES: {
        SHOOT_SETTINGS: droneShot,
        TYPE: ["drone", { INDEPENDENT: true }],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "drone",
        WAIT_TO_CYCLE: false,
        MAX_CHILDREN: 3
    }
}
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

Class.vitality = {
    PARENT: "genericTank",
    LABEL: "Vitality",
    DANGER: 8,
    STAT_NAMES: statnames.trap,
    GUNS: [
        ...dischargerLaunchers(7),
        heavyCannon(12),
        rearDrone
    ]
}

upgrade(["force", "discharger"], "vitality")
