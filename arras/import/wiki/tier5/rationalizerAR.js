const { combineStats, weaponStack } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.rationalizerAR = {
    PARENT: "genericTank",
    LABEL: "Rationalizer",
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.3
    },
    GUNS: weaponStack({
        POSITION: { LENGTH: 31, WIDTH: 8 },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.streamliner, { reload: 1.3 }]),
            TYPE: "bullet"
        }
    }, 7, { lengthOffset: 2, delayIncrement: 1 / 7 })
}

upgrade(["streamliner"], "rationalizerAR")
