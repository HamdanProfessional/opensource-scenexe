const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.manOWar = {
    PARENT: "genericTank",
    LABEL: "Man o' War",
    DANGER: 8,
    FACING_TYPE: "locksFacing",
    STAT_NAMES: Class.battleship.STAT_NAMES,
    BODY: Class.battleship.BODY,
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5, Y: 4, ANGLE: 90 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.doper]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
                LABEL: "Guided"
            }
        }, { delayIncrement: 0.5 }),
        ...weaponMirror({
            POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5, Y: 4, ANGLE: 270 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.doper]),
                TYPE: ["swarm", { AI: { FARMER: true }, INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
                LABEL: "Autonomous"
            }
        }, { delayIncrement: 0.5 })
    ]
}

upgrade(["battleship", "mosey"], "manOWar")
