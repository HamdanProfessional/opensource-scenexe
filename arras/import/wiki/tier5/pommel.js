const { combineStats, makeGuard } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.pommel = makeGuard({
    PARENT: "genericTank",
    DANGER: 4,
    GUNS: [
        {
            POSITION: { LENGTH: 20, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic]), TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 7.5, WIDTH: 8, ASPECT: 0.6, X: 7, DELAY: 0.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.minion, g.productionist]),
                TYPE: ["tinyMinion", { INDEPENDENT: true }],
                STAT_CALCULATOR: "drone",
                SYNCS_SKILLS: true
            }
        }
    ]
}, "Pommel", { danger: 4 })
upgrade(["peashooter"], "pommel")
