const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.nonaTrapper = {
    PARENT: "genericTank",
    LABEL: "Nona-Trapper",
    DANGER: 8,
    HAS_NO_RECOIL: true,
    GUNS: [
        ...weaponArray([
            {
                POSITION: { LENGTH: 15, WIDTH: 7 }
            },
            {
                POSITION: { LENGTH: 3, WIDTH: 7, ASPECT: 1.7, X: 15 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.hexaTrapper]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ], 9, { delayIncrement: 1 / 9 })
    ]
}

upgrade(["septaTrapper"], "nonaTrapper")
