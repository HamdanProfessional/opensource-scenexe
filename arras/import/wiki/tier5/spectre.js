const { combineStats, makeRadialAuto, weaponArray } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

Class.spectre = makeRadialAuto("bansheegun", {
    isTurret: true,
    danger: 8,
    size: 9,
    x: 9,
    arc: 80,
    count: 5,
    label: "Spectre",
    body: { FOV: Class.banshee.BODY.FOV }
})
Class.spectre.STAT_NAMES = statnames.drone
Class.spectre.GUNS = weaponArray({
    POSITION: { LENGTH: 6, WIDTH: 11, ASPECT: 1.2, X: 8, ANGLE: 180 },
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
        TYPE: "drone",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "drone",
        WAIT_TO_CYCLE: true,
        MAX_CHILDREN: 2
    }
}, 5)
upgrade(["auto5", "banshee", "overlord"], "spectre")
