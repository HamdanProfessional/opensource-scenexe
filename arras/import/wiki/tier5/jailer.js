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
            POSITION: { LENGTH: 20, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pen]), TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 12, WIDTH: 11 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 8, ASPECT: 1.7, X: 15 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.trap]), TYPE: "autoTrap", STAT_CALCULATOR: "trap" }
        }
    ]
}

Class.jailer = makeGuard(frontGun, "Jailer", { type: rear, danger: 4 })
upgrade(["incarcerator","mechGuard","operator"], "jailer")
