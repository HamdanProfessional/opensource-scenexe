const { combineStats, makeBird, weaponStack } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

const front = {
    PARENT: "genericTank",
    LABEL: "Magnet",
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: weaponStack({
        POSITION: { LENGTH: 21, WIDTH: 8, ASPECT: 1.4 },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.minigun, { reload: 0.7, spray: 2.5 }]),
            TYPE: "bullet"
        }
    }, 3, { lengthOffset: 2, delayIncrement: 1 / 3 })
}

Class.magnet = makeBird(front, "Magnet")

upgrade(["taser", "widget"], "magnet")
