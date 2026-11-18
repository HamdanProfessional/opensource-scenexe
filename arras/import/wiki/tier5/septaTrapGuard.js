const { statnames } = require("../constants.js")
const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const trapStats = combineStats([g.trap, g.hexaTrapper, g.flankGuard])

Class.septaTrapGuard = {
    PARENT: "genericTank",
    LABEL: "Septa-Trap Guard",
    DANGER: 8,
    STAT_NAMES: statnames.mixed,
    GUNS: [
        {
            POSITION: { LENGTH: 20, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]), TYPE: "bullet" }
        },
        ...[45, 90, 135, 180, 225, 270, 315].flatMap((angle, i) => [
            {
                POSITION: { LENGTH: 13, WIDTH: 8, ANGLE: angle }
            },
            {
                POSITION: { LENGTH: 4, WIDTH: 8, ASPECT: 1.7, X: 13, ANGLE: angle, DELAY: (i % 2) / 2 },
                PROPERTIES: { SHOOT_SETTINGS: trapStats, TYPE: "trap", STAT_CALCULATOR: "trap" }
            }
        ])
    ]
}
upgrade(["triTrapGuard", "septaTrapper"], "septaTrapGuard")
