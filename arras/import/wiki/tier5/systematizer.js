const { combineStats, weaponStack } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.systematizer = {
    PARENT: "genericTank",
    LABEL: "Systematizer",
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.3
    },
    GUNS: weaponStack({
        POSITION: { LENGTH: 25, WIDTH: 8, ASPECT: 1.4 },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.streamliner, { reload: 0.8, spray: 2.5 }]),
            TYPE: "bullet"
        }
    }, 5, { lengthOffset: 2, delayIncrement: 0.2 })
}

upgrade(["streamliner", "widget"], "systematizer")
