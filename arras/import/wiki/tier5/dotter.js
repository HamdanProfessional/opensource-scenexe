const { combineStats, makeGuard } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.dotter = makeGuard({
    PARENT: "genericTank",
    DANGER: 4,
    GUNS: [
        {
            POSITION: { LENGTH: 20, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic]), TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 8, WIDTH: 11, ASPECT: 0.6, X: 7, DELAY: 0.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, { size: 1.6, health: 1.3, damage: 1.2, reload: 1.2 }]),
                TYPE: ["swarm", { AI: { FARMER: true }, INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm"
            }
        }
    ]
}, "Dotter", { danger: 4 })
upgrade(["peashooter"], "dotter")
