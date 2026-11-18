const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const destroyerShot = combineStats([g.basic, g.pounder, g.destroyer])
const pelletShot = combineStats([g.basic, g.pelleter, g.artillery])
const gunnerShot = combineStats([g.basic, g.pelleter, g.power, g.twin, { recoil: 4 }, { recoil: 1.8 }])
const blockShot = combineStats([g.trap, g.setTrap])
const sidePellets = (y, angle, length = 17, width = 5, shot = pelletShot) => weaponMirror({
    POSITION: { LENGTH: length, WIDTH: width, Y: y, ANGLE: angle, DELAY: 0.25 },
    PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
}, { delayIncrement: 0.5 })
const rearGunners = weaponMirror({
    POSITION: { LENGTH: 16, WIDTH: 3, Y: -8.5, ANGLE: 180 },
    PROPERTIES: { SHOOT_SETTINGS: gunnerShot, TYPE: "bullet" }
}, { delayIncrement: 0.5 })
const backCannon = (shot, width, length = 20.5) => ({
    POSITION: { LENGTH: length, WIDTH: width, ANGLE: 180 },
    PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
})
const blockLauncher = (width, shot = blockShot, type = "setTrap", angle = 0) => [
    { POSITION: { LENGTH: 18, WIDTH: width, ANGLE: angle } },
    {
        POSITION: { LENGTH: 2, WIDTH: width, ASPECT: 1.1, X: 18, ANGLE: angle },
        PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: type, STAT_CALCULATOR: "block" }
    }
]

Class.blustererAR = {
    PARENT: "genericTank",
    LABEL: "Blusterer",
    DANGER: 8,
    BODY: Class.conqueror.BODY,
    GUNS: [
        ...rearGunners,
        backCannon(destroyerShot, 12),
        ...sidePellets(-6, -7),
        ...blockLauncher(12)
    ]
}

upgrade(["conqueror", "blower"], "blustererAR")
