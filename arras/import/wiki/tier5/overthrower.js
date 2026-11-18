const { combineStats, makeAuto, makeGuard } = require("../facilitators.js")
const g = require("../gunvals.js")

const frontGun = {
    PARENT: "genericTank",
    DANGER: 4,
    GUNS: [
        {
            POSITION: { LENGTH: 20.5, WIDTH: 14 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]), TYPE: "bullet" }
        }
    ]
}

const rear = {
    GUNS: [
        {
            POSITION: { LENGTH: 20, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pen]), TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 18, WIDTH: 12 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 12, ASPECT: 1.1, X: 18 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ]
}

Class.overthrower = makeGuard(frontGun, "Overthrower", { type: rear, danger: 4 })
upgrade(["incarcerator","conqueror","stall"], "overthrower")
