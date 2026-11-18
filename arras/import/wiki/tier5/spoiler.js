const { combineStats, makeTurret } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.spoilerGun = makeTurret({
    GUNS: [
        {
            POSITION: [22, 13, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, { damage: 1.4, health: 1.2 }]),
                TYPE: "bullet"
            }
        }
    ]
}, { canRepel: true, limitFov: true, fov: 3 })

Class.spoiler = {
    PARENT: "genericTank",
    LABEL: "Spoiler",
    DANGER: 8,
    BODY: Class.quadAngle.BODY,
    GUNS: Class.quadAngle.GUNS,
    TURRETS: Class.quadAngle.TURRETS.map(turret => ({
        POSITION: { ...turret.POSITION, SIZE: 10.5 },
        TYPE: "spoilerGun"
    }))
}
upgrade(["quadAngle"], "spoiler")
