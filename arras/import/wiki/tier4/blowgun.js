const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.blowgun = {
    PARENT: "genericTank",
    LABEL: "Blowgun",
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
        Class.peashooter.GUNS[1],
        Class.bushwhacker.GUNS[1],
        Class.bushwhacker.GUNS[2]
    ]
}
upgrade(["bushwhacker", "peashooter"], "blowgun")
