const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.triOperator = {
    PARENT: "genericTank",
    LABEL: "Tri-Operator",
    DANGER: 8,
    GUNS: [
        ...weaponArray([
            {
                POSITION: { LENGTH: 21, WIDTH: 8 },
                PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pen]), TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 15, WIDTH: 8 }
            },
            {
                POSITION: { LENGTH: 12, WIDTH: 11 }
            },
            {
                POSITION: { LENGTH: 3, WIDTH: 7, ASPECT: 1.7, X: 15 },
                PROPERTIES: { SHOOT_SETTINGS: combineStats([g.trap]), TYPE: "autoTrap", STAT_CALCULATOR: "trap" }
            }
        ], 3)
    ]
}

upgrade(["triPen", "triMech", "operator"], "triOperator")
