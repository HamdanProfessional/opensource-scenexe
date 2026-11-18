const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")
const { statnames } = require("../constants.js")

const stackedBlockShot = combineStats([g.trap, g.setTrap, { reload: 1.4, size: 0.8, damage: 0.8 }])
const stackedBlock = (length, delay) => [
    { POSITION: { LENGTH: length, WIDTH: 10 } },
    {
        POSITION: { LENGTH: 2, WIDTH: 10, ASPECT: 1.1, X: length, DELAY: delay },
        PROPERTIES: { SHOOT_SETTINGS: stackedBlockShot, TYPE: "setTrap", STAT_CALCULATOR: "block" }
    }
]

Class.blockade = {
    PARENT: "genericTank",
    LABEL: "Blockade",
    DANGER: 7,
    BODY: Class.subverter.BODY,
    STAT_NAMES: statnames.trap,
    GUNS: [
        ...stackedBlock(22, 0),
        ...stackedBlock(20, 0.33),
        ...stackedBlock(18, 0.66)
    ]
}

upgrade(["subverter", "builder", "barricade"], "blockade")
