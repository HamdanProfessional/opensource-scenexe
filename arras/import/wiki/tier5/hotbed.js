const { combineStats, weaponMirror, weaponStack } = require("../facilitators.js")
const g = require("../gunvals.js")
const { statnames } = require("../constants.js")

Class.hotbed = {
    ...Class.zipper,
    LABEL: "Hotbed",
    DANGER: 8,
    STAT_NAMES: statnames.mixed,
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false,
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5, Y: 3, ANGLE: 22.5, DELAY: 0.25 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.minion, g.productionist]),
                TYPE: "tinyMinion",
                STAT_CALCULATOR: "drone",
                SYNCS_SKILLS: true,
                MAX_CHILDREN: 3
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

upgrade(["zipper"], "hotbed")
