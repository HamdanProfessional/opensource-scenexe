const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.septaMech = {
    PARENT: "genericTank",
    LABEL: "Septa-Mech",
    DANGER: 8,
    HAS_NO_RECOIL: true,
    GUNS: [
        ...weaponArray([
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
        ], 7, { delayIncrement: 1 / 7 })
    ]
}

upgrade(["septaTrapper", "triMech"], "septaMech")
