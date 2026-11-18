const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const blockShot = combineStats([g.trap, g.setTrap])
const blockLauncher = (width, shot = blockShot, type = "setTrap", angle = 0) => [
    { POSITION: { LENGTH: 18, WIDTH: width, ANGLE: angle } },
    {
        POSITION: { LENGTH: 2, WIDTH: width, ASPECT: 1.1, X: 18, ANGLE: angle },
        PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: type, STAT_CALCULATOR: "block" }
    }
]

Class.bounder = {
    PARENT: "genericTank",
    LABEL: "Bounder",
    DANGER: 8,
    GUNS: [
        Class.beekeeper.GUNS[0],
        Class.beekeeper.GUNS[1],
        ...blockLauncher(12)
    ]
}

upgrade(["beekeeper", "forger"], "bounder")
