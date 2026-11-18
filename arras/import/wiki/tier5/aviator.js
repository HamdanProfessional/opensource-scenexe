const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const pelletShot = combineStats([g.basic, g.pelleter, g.artillery])
const outerPellets = weaponMirror({
    POSITION: { LENGTH: 13, WIDTH: 3, Y: -9, ANGLE: -3.5, DELAY: 0.6 },
    PROPERTIES: { SHOOT_SETTINGS: pelletShot, TYPE: "bullet" }
}, { delayIncrement: 0.2 })

Class.aviator = {
    PARENT: "genericTank",
    LABEL: "Aviator",
    DANGER: 8,
    BODY: Class.rocketeer.BODY,
    GUNS: [
        Class.fieldGun.GUNS[0],
        Class.fieldGun.GUNS[1],
        ...Class.rocketeer.GUNS,
        ...outerPellets
    ]
}

upgrade(["fieldGun", "rocketeer"], "aviator")
