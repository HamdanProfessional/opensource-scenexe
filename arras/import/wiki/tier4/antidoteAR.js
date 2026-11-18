const { combineStats, weaponMirror } = require("../facilitators.js")
const { base, statnames } = require("../constants.js")
const g = require("../gunvals.js")

Class.antidoteAR = {
    PARENT: "genericHealer",
    LABEL: "Antidote",
    FACING_TYPE: "locksFacing",
    STAT_NAMES: statnames.swarm,
    BODY: {
        FOV: 1.2 * base.FOV
    },
    GUNS: weaponMirror({
        POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5, Y: 4 },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.healer, { speed: 2, maxSpeed: 2 }]),
            TYPE: ["swarm", { HEALER: true }],
            STAT_CALCULATOR: "swarm"
        }
    }, { delayIncrement: 0.5 })
}

upgrade(["sootherAR"], "antidoteAR")
