const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { statnames } = require("../constants.js")

Class.clasp = {
    ...Class.barricade,
    LABEL: "Clasp",
    DANGER: 8,
    STAT_NAMES: statnames.mixed,
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false,
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5, Y: 3, ANGLE: 22.5, DELAY: 0.25 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm"
            }
        }, { delayIncrement: 0.5 }),
        ...Class.barricade.GUNS
    ]
}

upgrade(["zipper", "barricade"], "clasp")
