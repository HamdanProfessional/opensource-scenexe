const { combineStats, makeOver, weaponStack } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")
const preset = require("../presets.js")

const body = {
    PARENT: "genericTank",
    LABEL: "Sandstorm",
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: weaponStack({
        POSITION: { LENGTH: 21, WIDTH: 8, ASPECT: 1.4 },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.minigun, { reload: 0.65, spray: 3 }]),
            TYPE: "bullet"
        }
    }, 3, { lengthOffset: 2, delayIncrement: 1 / 3 })
}

Class.sandstorm = makeOver(body, "Sandstorm", preset.hybrid)

upgrade(["cropDuster", "widget"], "sandstorm")
