const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.battlewagon = {
    PARENT: "genericTank",
    LABEL: "Battlewagon",
    DANGER: 8,
    FACING_TYPE: "locksFacing",
    STAT_NAMES: Class.battleship.STAT_NAMES,
    BODY: { FOV: Class.battleship.BODY.FOV * 0.92 },
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 12, WIDTH: 9.5, ASPECT: 0.75, X: 3, Y: 4.6, ANGLE: 90 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.honcho]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
                LABEL: "Guided"
            }
        }, { delayIncrement: 0.5 }),
        ...weaponMirror({
            POSITION: { LENGTH: 12, WIDTH: 9.5, ASPECT: 0.75, X: 3, Y: 4.6, ANGLE: 270 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.honcho]),
                TYPE: ["swarm", { AI: { FARMER: true }, INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
                LABEL: "Autonomous"
            }
        }, { delayIncrement: 0.5 })
    ]
}

upgrade(["battleship", "baltimore"], "battlewagon")
