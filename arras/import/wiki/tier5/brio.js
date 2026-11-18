const { combineStats, weaponMirror, weaponStack } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base, statnames } = require("../constants.js")

Class.brio = {
    PARENT: "genericTank",
    LABEL: "Brio",
    DANGER: 8,
    STAT_NAMES: statnames.mixed,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 12, WIDTH: 8.7, ASPECT: 0.75, X: 3, Y: 4.6 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.honcho]),
                TYPE: "swarm",
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "swarm"
            }
        }, { delayIncrement: 0.5 }),
        ...weaponStack({
            POSITION: { LENGTH: 21, WIDTH: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun]),
                TYPE: "bullet"
            }
        }, 3, { lengthOffset: 2, delayIncrement: 1 / 3 })
    ]
}

upgrade(["zipper", "baltimore"], "brio")
