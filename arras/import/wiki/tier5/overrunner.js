const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

const destroyerShot = combineStats([g.basic, g.pounder, g.destroyer])
const blockShot = combineStats([g.trap, g.setTrap])
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

Class.overrunnerBlock = {
    PARENT: "setTrap",
    GUNS: weaponArray({
        POSITION: { LENGTH: 1, WIDTH: 6 },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, { size: 0.5, range: 0.5 }]),
            TYPE: "trap",
            SHOOT_ON_DEATH: true
        }
    }, 6)
}

Class.overrunner = {
    PARENT: "genericTank",
    LABEL: "Overrunner",
    DANGER: 8,
    BODY: Class.conqueror.BODY,
    GUNS: [
        backCannon(destroyerShot, 14),
        ...blockLauncher(14, blockShot, "overrunnerBlock")
    ]
}

upgrade(["conqueror", "charger"], "overrunner")
