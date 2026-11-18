const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.landau = {
    PARENT: "genericTank",
    LABEL: "Landau",
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 13, WIDTH: 6, ANGLE: 30 }
            },
            {
                POSITION: { LENGTH: 3, WIDTH: 6, ASPECT: 1.7, X: 13, ANGLE: 30 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trapSpray, g.machineGun, { reload: 0.75, size: 2 / 3, spray: 5 }]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ], { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 20, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pen]), TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 4, WIDTH: 8, ASPECT: 1.7, X: 13 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trapSpray, g.machineGun, { reload: 0.75, size: 2 / 3, spray: 5 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}

upgrade(["encircler", "dieselTrapper"], "landau")
