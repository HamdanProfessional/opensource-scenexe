const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.lockup = {
    PARENT: "genericTank",
    LABEL: "Lockup",
    DANGER: 7,
    BODY: Class.bushwhacker.BODY,
    GUNS: [
        {
            POSITION: { LENGTH: 27, WIDTH: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper]),
                TYPE: "bullet"
            }
        },
        ...Class.incarcerator.GUNS.slice(1)
    ]
}
upgrade(["bushwhacker", "incarcerator"], "lockup")
