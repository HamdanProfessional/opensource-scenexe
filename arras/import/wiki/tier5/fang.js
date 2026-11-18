const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const nail = combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, { size: 2 / 3 }])

Class.fang = {
    PARENT: "genericTank",
    LABEL: "Fang",
    DANGER: 8,
    BODY: Class.buttbuttin.BODY,
    GUNS: [
        Class.buttbuttin.GUNS[0],
        Class.buttbuttin.GUNS[1],
        {
            POSITION: { LENGTH: 19, WIDTH: 3, Y: -2, ANGLE: 180, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: nail, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 19, WIDTH: 3, Y: 2, ANGLE: 180, DELAY: 0.75 },
            PROPERTIES: { SHOOT_SETTINGS: nail, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 20, WIDTH: 2, ANGLE: 180 },
            PROPERTIES: { SHOOT_SETTINGS: nail, TYPE: "bullet" }
        },
        Class.buttbuttin.GUNS[4]
    ]
}
upgrade(["buttbuttin", "nailgun"], "fang")
