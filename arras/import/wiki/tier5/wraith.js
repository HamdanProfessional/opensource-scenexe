const { combineStats, makeRadialAuto, makeTurret, weaponArray } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

Class.wraithGunnerGun = makeTurret("gunner", { canRepel: true, limitFov: true })

Class.wraith = makeRadialAuto("wraithGunnerGun", {
    isTurret: true,
    danger: 8,
    size: 11,
    x: 9,
    arc: 100,
    count: 4,
    label: "Wraith",
    body: { FOV: Class.banshee.BODY.FOV }
})
Class.wraith.STAT_NAMES = statnames.swarm
Class.wraith.GUNS = weaponArray({
    POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5, ANGLE: 45 },
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm]),
        TYPE: "swarm",
        STAT_CALCULATOR: "swarm"
    }
}, 4, { delayIncrement: 0.25 })
upgrade(["auto4", "banshee", "battleship"], "wraith")
