const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.sty = {
    PARENT: "genericTank",
    LABEL: "Sty",
    DANGER: 7,
    GUNS: [
        {
            POSITION: { LENGTH: 22, WIDTH: 10 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pen]), TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 14, WIDTH: 12 }
        },
        {
            POSITION: { LENGTH: 5, WIDTH: 12, ASPECT: 1.7, X: 13 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.megaTrap]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}

upgrade(["pen", "megaTrapper"], "sty")
