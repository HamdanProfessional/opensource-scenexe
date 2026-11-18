const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.rigger = {
    PARENT: "genericTank",
    LABEL: "Rigger",
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 15, WIDTH: 9, ASPECT: 1.4, Y: 5.5, ANGLE: 5 }
            },
            {
                POSITION: { LENGTH: 12, WIDTH: 11, Y: 5.5, ANGLE: 5 }
            },
            {
                POSITION: { LENGTH: 3, WIDTH: 11, ASPECT: 1.3, X: 15, Y: 5.5, ANGLE: 5 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trapSpray, g.machineGun, { reload: 0.75, size: 2 / 3, spray: 5 }]),
                    TYPE: "autoTrap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ], { delayIncrement: 0.5 })
    ]
}

upgrade(["machineMech", "cog", "expeller"], "rigger")
