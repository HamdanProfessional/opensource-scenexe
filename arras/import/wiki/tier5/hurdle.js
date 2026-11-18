const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.hurdle = {
    PARENT: "genericTank",
    LABEL: "Hurdle",
    DANGER: 8,
    BODY: { FOV: base.FOV * 1.15, SPEED: base.SPEED * 14 / 15 },
    GUNS: [
        {
            POSITION: { LENGTH: 23, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pen]), TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 18, WIDTH: 18 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 18, ASPECT: 1.2, X: 18 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.construct]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ]
}

upgrade(["construct", "stall"], "hurdle")
