const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.epoch = {
    PARENT: "genericTank",
    LABEL: "Epoch",
    DANGER: 8,
    FACING_TYPE: "locksFacing",
    STAT_NAMES: Class.carrier.STAT_NAMES,
    BODY: Class.carrier.BODY,
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 10, WIDTH: 10, ASPECT: 0.75, X: 4, Y: 2, ANGLE: 30, DELAY: 0.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier, g.honcho]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm"
            }
        }),
        {
            POSITION: { LENGTH: 10, WIDTH: 10, ASPECT: 0.75, X: 4 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier, g.honcho]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm"
            }
        }
    ]
}

upgrade(["carrier", "baltimore"], "epoch")
