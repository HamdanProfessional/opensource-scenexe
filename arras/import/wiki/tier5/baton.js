const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.baton = {
    PARENT: "genericTank",
    LABEL: "Baton",
    DANGER: 8,
    BODY: Class.buttbuttin.BODY,
    GUNS: [
        Class.buttbuttin.GUNS[0],
        Class.buttbuttin.GUNS[1],
        ...weaponMirror([
            {
                POSITION: { LENGTH: 16, WIDTH: 3.5, Y: 3.75, ANGLE: 180 }
            },
            {
                POSITION: { LENGTH: 2, WIDTH: 3.5, ASPECT: 1.77, X: 16, Y: 3.75, ANGLE: 180 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ], { delayIncrement: 0.5 }),
        Class.buttbuttin.GUNS[4]
    ]
}
upgrade(["buttbuttin", "equalizer"], "baton")
