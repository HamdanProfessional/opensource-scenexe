const { combineStats, weaponMirror, weaponStack } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base, statnames } = require("../constants.js")

Class.pipeline = {
    PARENT: "genericTank",
    LABEL: "Pipeline",
    DANGER: 8,
    STAT_NAMES: statnames.mixed,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5, Y: 3.5, ANGLE: 22.5, DELAY: 0.25 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm"
            }
        }, { delayIncrement: 0.5 }),
        ...weaponStack({
            POSITION: { LENGTH: 21, WIDTH: 8, ASPECT: 1.4 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, { reload: 0.75, spray: 2.5 }]),
                TYPE: "bullet"
            }
        }, 3, { lengthOffset: 2, delayIncrement: 1 / 3 })
    ]
}

upgrade(["zipper", "widget"], "pipeline")
