const { combineStats, weaponStack } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.tumble = {
    PARENT: "genericTank",
    LABEL: "Tumble",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: weaponStack({
        POSITION: { LENGTH: 21, WIDTH: 14, ASPECT: 1.4 },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.minigun, { reload: 0.75, spray: 2.5 }]),
            TYPE: "bullet"
        }
    }, 3, { lengthOffset: 2, delayIncrement: 1 / 3 })
}

upgrade(["widget", "subverter"], "tumble")
