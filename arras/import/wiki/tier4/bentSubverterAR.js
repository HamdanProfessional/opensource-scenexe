const { combineStats, weaponMirror, weaponStack } = require("../facilitators.js")
const g = require("../gunvals.js")

const shot = combineStats([g.basic, g.minigun, g.tripleShot, g.pounder, { reload: 1.4 }])

Class.bentSubverterAR = {
    PARENT: "genericTank",
    LABEL: "Bent Subverter",
    DANGER: 7,
    BODY: Class.minigun.BODY,
    GUNS: [
        ...weaponMirror(weaponStack({
            POSITION: { LENGTH: 19, WIDTH: 10, X: -2, Y: 4, ANGLE: 16, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        }, 2, { lengthOffset: 2, delayIncrement: 0.5 })),
        ...weaponStack({
            POSITION: { LENGTH: 21, WIDTH: 14 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        }, 3, { lengthOffset: 2, delayIncrement: 1 / 3 })
    ]
}

upgrade(["bentMinigun", "subverter"], "bentSubverterAR")
