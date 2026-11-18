const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.stainer = {
    PARENT: "genericTank",
    LABEL: "Stainer",
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 15, WIDTH: 8, ASPECT: 1.4, Y: 5.5, ANGLE: 5 }
            },
            {
                POSITION: { LENGTH: 3.25, WIDTH: 11, ASPECT: 1.3, X: 14, Y: 5.5, ANGLE: 5 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trapSpray, g.machineGun, { reload: 0.75, size: 2 / 3, spray: 5 }]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ], { delayIncrement: 0.5 })
    ]
}

upgrade(["dieselTrapper", "expeller"], "stainer")
