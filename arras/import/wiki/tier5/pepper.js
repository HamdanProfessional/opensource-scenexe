const { combineStats, weaponMirror, weaponStack } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base, statnames } = require("../constants.js")

Class.pepper = {
    PARENT: "genericTank",
    LABEL: "Pepper",
    DANGER: 8,
    STAT_NAMES: statnames.mixed,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5, Y: 4 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.doper, { speed: 1.3, maxSpeed: 1.3 }]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm"
                }
            },
            {
                POSITION: { LENGTH: 7, WIDTH: 1, ASPECT: -2.5, X: 8, Y: 4 }
            }
        ], { delayIncrement: 0.5 }),
        ...weaponStack({
            POSITION: { LENGTH: 21, WIDTH: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun]),
                TYPE: "bullet"
            }
        }, 3, { lengthOffset: 2, delayIncrement: 1 / 3 })
    ]
}

upgrade(["zipper", "mosey"], "pepper")
