const { combineStats, makeAuto, makeGuard } = require("../facilitators.js")
const g = require("../gunvals.js")

const frontGun = {
    PARENT: "genericTank",
    DANGER: 4,
    GUNS: [
        {
            POSITION: { LENGTH: 20, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic]), TYPE: "bullet" }
        }
    ]
}

const rear = {
    GUNS: [
        {
            POSITION: { LENGTH: 15, WIDTH: 9, ASPECT: 1.4 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 13, ASPECT: 1.3, X: 15 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trapSpray, g.machineGun, { size: 2 / 3, spray: 5, reload: 0.8 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}

Class.restrainer = makeGuard(frontGun, "Restrainer", { type: rear, danger: 4 })
upgrade(["machineGuard","dieselTrapper"], "restrainer")
