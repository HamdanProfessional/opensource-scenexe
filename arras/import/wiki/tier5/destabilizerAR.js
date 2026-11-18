const { combineStats, weaponStack } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.destabilizerAR = {
    PARENT: "genericTank",
    LABEL: "Destabilizer",
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.3
    },
    GUNS: weaponStack({
        POSITION: { LENGTH: 25, WIDTH: 13 },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.minigun, g.streamliner]),
            TYPE: "bullet"
        }
    }, 5, { lengthOffset: 2, delayIncrement: 0.2 })
}

upgrade(["streamliner"], "destabilizerAR")
