const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.sailer = {
    PARENT: "genericTank",
    LABEL: "Sailer",
    DANGER: 8,
    STAT_NAMES: Class.mosey.STAT_NAMES,
    BODY: Class.mosey.BODY,
    FACING_TYPE: "locksFacing",
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5, Y: 4 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.doper, { speed: 1.2, maxSpeed: 1.2 }]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm"
                }
            },
            { POSITION: { LENGTH: 7, WIDTH: 1, ASPECT: -2.5, X: 8, Y: 4 } }
        ], { delayIncrement: 0.5 })
    ]
}

upgrade(["mosey"], "sailer")
