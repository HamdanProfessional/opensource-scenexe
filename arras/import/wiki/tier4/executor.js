const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.executorAR = {
    PARENT: "genericTank",
    LABEL: "Executor",
    DANGER: 7,
    BODY: { ...Class.assassin.BODY, FOV: Class.assassin.BODY.FOV * 1.05 },
    GUNS: [
        {
            POSITION: { LENGTH: 27, WIDTH: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, { speed: 1.15, maxSpeed: 1.15 }]),
                TYPE: "bullet"
            }
        },
        Class.assassin.GUNS[1],
        Class.bushwhacker.GUNS[1],
        Class.bushwhacker.GUNS[2]
    ]
}
upgrade(["assassin", "bushwhacker"], "executorAR")
