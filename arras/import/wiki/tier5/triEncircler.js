const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.triEncircler = {
    PARENT: "genericTank",
    LABEL: "Tri-Encircler",
    DANGER: 8,
    GUNS: [
        ...weaponArray([
            {
                POSITION: { LENGTH: 20, WIDTH: 8 },
                PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pen]), TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 4, WIDTH: 8, ASPECT: 1.7, X: 13 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trapSpray, g.machineGun, { size: 2 / 3, spray: 5 }]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ], 3)
    ]
}

upgrade(["triPen", "triMachine", "encircler"], "triEncircler")
