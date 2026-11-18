const { combineStats, weaponMirror, weaponStack } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base, statnames } = require("../constants.js")

Class.gusher = {
    PARENT: "genericTank",
    LABEL: "Gusher",
    DANGER: 8,
    STAT_NAMES: statnames.mixed,
    BODY: {
        FOV: base.FOV * 1.3
    },
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5, Y: 3, ANGLE: 22.5, DELAY: 0.25 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm"
            }
        }, { delayIncrement: 0.5 }),
        ...weaponStack({
            POSITION: { LENGTH: 25, WIDTH: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.streamliner]),
                TYPE: "bullet"
            }
        }, 5, { lengthOffset: 2, delayIncrement: 0.2 })
    ]
}

upgrade(["streamliner", "zipper"], "gusher")
