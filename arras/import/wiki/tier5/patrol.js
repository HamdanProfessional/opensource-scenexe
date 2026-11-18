const { combineStats, makeGuard } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.patrol = makeGuard({
    PARENT: "genericTank",
    DANGER: 4,
    GUNS: [
        {
            POSITION: { LENGTH: 20, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic]), TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 7, WIDTH: 6.5, ASPECT: 0.6, X: 7, Y: 4, DELAY: 0.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: ["swarm", { AI: { FARMER: true }, INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm"
            }
        },
        {
            POSITION: { LENGTH: 7, WIDTH: 6.5, ASPECT: 0.6, X: 7, Y: -4 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: ["swarm", { AI: { FARMER: true }, INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm"
            }
        }
    ]
}, "Patrol", { type: "mech", danger: 4 })
upgrade(["peashooter", "mechGuard"], "patrol")
