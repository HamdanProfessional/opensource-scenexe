const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const annihilatorShot = combineStats([g.basic, g.pounder, g.destroyer, g.annihilator])
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

Class.obliterator = {
    PARENT: "genericTank",
    LABEL: "Obliterator",
    DANGER: 8,
    BODY: Class.conqueror.BODY,
    GUNS: [
        backCannon(annihilatorShot, 19.5),
        ...blockLauncher(14)
    ]
}

upgrade(["conqueror", "annihilator"], "obliterator")
