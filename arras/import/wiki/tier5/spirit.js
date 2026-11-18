const { combineStats, makeRadialAuto, makeTurret, weaponArray } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

Class.spiritGun = makeTurret({
    GUNS: [
        {
            POSITION: [26, 14, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, { reload: 1.2 }]),
                TYPE: "bullet"
            }
        }
    ]
}, { limitFov: true, independent: true })

Class.spirit = makeRadialAuto("spiritGun", {
    isTurret: true,
    danger: 8,
    size: 13,
    x: 9,
    arc: 80,
    label: "Spirit",
    body: { FOV: Class.banshee.BODY.FOV, SPEED: Class.mega3.BODY.SPEED }
})
Class.spirit.STAT_NAMES = statnames.drone
Class.spirit.GUNS = weaponArray({
    POSITION: { LENGTH: 7, WIDTH: 15, ASPECT: 1.3, X: 8, ANGLE: 180 },
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.overseer, { size: 1.8, health: 1.6, damage: 1.4, reload: 1.5 }]),
        TYPE: "drone",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "drone",
        WAIT_TO_CYCLE: true,
        MAX_CHILDREN: 1
    }
}, 3)
upgrade(["mega3", "banshee", "foreman"], "spirit")
