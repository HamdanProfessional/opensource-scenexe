const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const destroyerShot = combineStats([g.basic, g.pounder, g.destroyer])
const pelletShot = combineStats([g.basic, g.pelleter, g.artillery])
const blockShot = combineStats([g.trap, g.setTrap])
const sidePellets = (y, angle, length = 17, width = 5, shot = pelletShot) => weaponMirror({
    POSITION: { LENGTH: length, WIDTH: width, Y: y, ANGLE: angle, DELAY: 0.25 },
    PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
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

Class.annexer = {
    PARENT: "genericTank",
    LABEL: "Annexer",
    DANGER: 8,
    BODY: Class.conqueror.BODY,
    GUNS: [
        ...sidePellets(-6, 173),
        backCannon(destroyerShot, 12),
        ...sidePellets(-6, -7),
        ...blockLauncher(12)
    ]
}

upgrade(["conqueror", "queller", "forger"], "annexer")
