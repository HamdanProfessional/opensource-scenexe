const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.bismark = {
    PARENT: "genericTank",
    LABEL: "Bismark",
    DANGER: 8,
    STAT_NAMES: Class.productionist.STAT_NAMES,
    FACING_TYPE: "locksFacing",
    BODY: Class.productionist.BODY,
    GUNS: [
        ...weaponMirror([
            { POSITION: { LENGTH: 14.5, WIDTH: 6, Y: 5.2 } },
            { POSITION: { LENGTH: 11, WIDTH: 8, Y: 5.2, ASPECT: -1.2 } },
            {
                POSITION: { LENGTH: 1, WIDTH: 8, Y: 5.2, X: 14.5 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.minion, g.productionist]),
                    TYPE: "tinyMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true
                }
            }
        ], { delayIncrement: 0.5 }),
        ...weaponMirror({
            POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5, Y: 4, ANGLE: 90 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
                LABEL: "Guided"
            }
        }, { delayIncrement: 0.5 })
    ]
}

upgrade(["productionist"], "bismark")
