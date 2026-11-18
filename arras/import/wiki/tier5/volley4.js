const { combineStats, makeRadialAuto, makeTurret } = require("../facilitators.js")
const g = require("../gunvals.js")

const shot = combineStats([g.basic, g.pounder, g.twin, g.gunner, { speed: 1.2 }])

Class.volley4Gun = makeTurret({
    GUNS: [
        {
            POSITION: { LENGTH: 14, WIDTH: 5.5, Y: -4.5 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 14, WIDTH: 5.5, Y: 4.5, DELAY: 0.5 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        }
    ]
}, { canRepel: true, limitFov: true })

Class.volley4 = makeRadialAuto("volley4Gun", { isTurret: true, danger: 8, size: 12, x: 6.5, angle: 0, label: "Volley-4", count: 5 })

upgrade(["volley", "mega3", "auto4"], "volley4")
