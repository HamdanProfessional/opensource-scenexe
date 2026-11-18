const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const pelletShot = combineStats([g.basic, g.pelleter, g.artillery])
const blockShot = combineStats([g.trap, g.setTrap])
const constructShot = combineStats([g.trap, g.setTrap, g.construct])
const sidePellets = (y, angle, length = 17, width = 5, shot = pelletShot) => weaponMirror({
    POSITION: { LENGTH: length, WIDTH: width, Y: y, ANGLE: angle, DELAY: 0.25 },
    PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
}, { delayIncrement: 0.5 })
const blockLauncher = (width, shot = blockShot, type = "setTrap", angle = 0) => [
    { POSITION: { LENGTH: 18, WIDTH: width, ANGLE: angle } },
    {
        POSITION: { LENGTH: 2, WIDTH: width, ASPECT: 1.1, X: 18, ANGLE: angle },
        PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: type, STAT_CALCULATOR: "block" }
    }
]

Class.busterAR = {
    PARENT: "genericTank",
    LABEL: "Buster",
    DANGER: 8,
    GUNS: [
        ...sidePellets(-6, -7),
        ...blockLauncher(16, constructShot, "setTrap", 180)
    ]
}

upgrade(["blower"], "busterAR")
