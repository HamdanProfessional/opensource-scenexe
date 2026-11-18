const { combineStats, weaponStack } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.gizmo = {
    PARENT: "genericTank",
    LABEL: "Gizmo",
    DANGER: 7,
    GUNS: weaponStack({
        POSITION: { LENGTH: 14, WIDTH: 10, ASPECT: 1.6, X: 8 },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.diesel, { reload: 0.65, spray: 1.5 }]),
            TYPE: "bullet"
        }
    }, 3, { lengthOffset: 2, delayIncrement: 1 / 3 })
}

upgrade(["widget", "diesel"], "gizmo")
