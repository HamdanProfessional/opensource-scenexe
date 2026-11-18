const { combineStats, makeRadialAuto, makeTurret } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.hurlerTankGun = makeTurret({
    GUNS: [
        {
            POSITION: { LENGTH: 19.2, WIDTH: 13, ASPECT: 0.7 }
        },
        {
            POSITION: { LENGTH: 17, WIDTH: 13 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher]),
                TYPE: "launcherMissile",
                STAT_CALCULATOR: "sustained"
            }
        }
    ]
}, { independent: true, hasAI: false, extraStats: [] })

Class.hurler3 = makeRadialAuto("hurlerTankGun", {
    isTurret: true,
    danger: 8,
    size: 14,
    label: "Hurler-3",
    body: { SPEED: Class.mega3.BODY.SPEED }
})
upgrade(["mega3"], "hurler3")
