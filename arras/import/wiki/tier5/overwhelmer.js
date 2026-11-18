const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const destroyerShot = combineStats([g.basic, g.pounder, g.destroyer])
const blockShot = combineStats([g.trap, g.setTrap])
const constructShot = combineStats([g.trap, g.setTrap, g.construct])
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

Class.overwhelmer = {
    PARENT: "genericTank",
    LABEL: "Overwhelmer",
    DANGER: 8,
    BODY: Class.conqueror.BODY,
    GUNS: [
        backCannon(destroyerShot, 14),
        ...blockLauncher(17, constructShot)
    ]
}

upgrade(["conqueror", "construct"], "overwhelmer")
