const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.watchman = {
    PARENT: "genericTank",
    LABEL: "Watchman",
    DANGER: 7,
    BODY: { ...Class.bushwhacker.BODY, FOV: Class.bushwhacker.BODY.FOV * 1.08 },
    GUNS: [
        {
            POSITION: { LENGTH: 27, WIDTH: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, { speed: 1.15, maxSpeed: 1.15 }]),
                TYPE: "bullet"
            }
        },
        Class.bushwhacker.GUNS[1],
        {
            ...Class.bushwhacker.GUNS[2],
            PROPERTIES: {
                ...Class.bushwhacker.GUNS[2].PROPERTIES,
                TYPE: "autoTrap"
            }
        }
    ]
}
upgrade(["bushwhacker", "mechGuard"], "watchman")
