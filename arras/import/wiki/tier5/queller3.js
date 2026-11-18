const { combineStats, makeRadialAuto, makeTurret, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.quellerTankGun = makeTurret({
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 17, WIDTH: 5, Y: -6, ANGLE: -7, DELAY: 0.25 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, { size: 0.5 }]),
                TYPE: "bullet"
            }
        }, { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 22, WIDTH: 14 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pounder]), TYPE: "bullet" }
        }
    ]
}, { canRepel: true, limitFov: true })

Class.queller3 = makeRadialAuto("quellerTankGun", {
    isTurret: true,
    danger: 8,
    size: 14,
    label: "Queller-3",
    body: { SPEED: Class.mega3.BODY.SPEED }
})
upgrade(["mega3"], "queller3")
