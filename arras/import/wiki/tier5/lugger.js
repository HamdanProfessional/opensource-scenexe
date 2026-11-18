const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.lugger = {
    PARENT: "genericTank",
    LABEL: "Lugger",
    DANGER: 8,
    FACING_TYPE: "locksFacing",
    STAT_NAMES: Class.carrier.STAT_NAMES,
    BODY: Class.carrier.BODY,
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5, ANGLE: 30, Y: 2, DELAY: 0.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier, g.doper]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm"
            }
        }),
        {
            POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier, g.doper]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm"
            }
        }
    ]
}

upgrade(["carrier", "mosey"], "lugger")
