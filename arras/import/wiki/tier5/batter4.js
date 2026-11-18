const { combineStats, makeRadialAuto, makeTurret } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.batter4Gun = makeTurret({
    GUNS: [
        {
            POSITION: { LENGTH: 16, WIDTH: 3, Y: -4 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.power, { speed: 0.7, maxSpeed: 0.7 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: { LENGTH: 18, WIDTH: 3, DELAY: 0.33 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.power, { speed: 0.7, maxSpeed: 0.7 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: { LENGTH: 16, WIDTH: 3, Y: 4, DELAY: 0.67 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.power, { speed: 0.7, maxSpeed: 0.7 }]),
                TYPE: "bullet"
            }
        }
    ]
}, { canRepel: true, limitFov: true })

Class.batter4 = makeRadialAuto("batter4Gun", { isTurret: true, danger: 8, size: 13, x: 6, angle: 45, label: "Batter-4", count: 4 })

upgrade(["battery", "auto4"], "batter4")
