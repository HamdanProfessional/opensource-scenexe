const { combineStats, weaponMirror, weaponStack } = require("../facilitators.js")
const g = require("../gunvals.js")

const shot = combineStats([g.basic, g.minigun, g.triplet])

Class.minilet = {
    PARENT: "genericTank",
    LABEL: "Minilet",
    DANGER: 8,
    BODY: Class.minigun.BODY,
    GUNS: [
        ...weaponMirror(weaponStack({
            POSITION: { LENGTH: 18, WIDTH: 7, Y: 6, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        }, 3, { lengthOffset: 2, delayIncrement: 1 / 3 })),
        ...weaponStack({
            POSITION: { LENGTH: 21, WIDTH: 7 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        }, 3, { lengthOffset: 2, delayIncrement: 1 / 3 })
    ]
}

upgrade(["triplet", "bentMinigun"], "minilet")
