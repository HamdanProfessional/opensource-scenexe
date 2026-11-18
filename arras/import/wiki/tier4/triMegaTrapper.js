const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.triMegaTrapper = {
    PARENT: "genericTank",
    LABEL: "Tri-Mega Trapper",
    DANGER: 7,
    GUNS: [
        ...weaponArray([
            {
                POSITION: { LENGTH: 14, WIDTH: 10 }
            },
            {
                POSITION: { LENGTH: 5, WIDTH: 10, ASPECT: 1.7, X: 13 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.megaTrap]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ], 3)
    ]
}

upgrade(["tripleTrapper", "megaTrapper"], "triMegaTrapper")
