const { combineStats, weaponMirror, weaponStack } = require("../facilitators.js")
const { base } = require("../constants.js")
const g = require("../gunvals.js")

const shot = combineStats([g.basic, g.minigun, g.streamliner, g.tripleShot])

Class.bentStreamliner = {
    PARENT: "genericTank",
    LABEL: "Bent Streamliner",
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.3
    },
    GUNS: [
        ...weaponMirror(weaponStack({
            POSITION: { LENGTH: 22, WIDTH: 8, X: -2, Y: 2, ANGLE: 16, DELAY: 0.2 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        }, 3, { lengthOffset: 2, delayIncrement: 1 / 3 })),
        ...weaponStack({
            POSITION: { LENGTH: 25, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        }, 5, { lengthOffset: 2, delayIncrement: 0.2 })
    ]
}

upgrade(["bentMinigun", "streamliner"], "bentStreamliner")
