const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.initiator = {
    PARENT: "genericTank",
    LABEL: "Initiator",
    DANGER: 8,
    FACING_TYPE: "locksFacing",
    STAT_NAMES: Class.productionist.STAT_NAMES,
    BODY: Class.productionist.BODY,
    GUNS: [
        ...weaponMirror([
            { POSITION: { LENGTH: 14.5, WIDTH: 6, ANGLE: 30 } },
            { POSITION: { LENGTH: 11, WIDTH: 8, ASPECT: -1.2, ANGLE: 30 } },
            {
                POSITION: { LENGTH: 1, WIDTH: 8, X: 14.5, ANGLE: 30 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.minion, g.productionist]),
                    TYPE: "tinyMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true
                }
            }
        ], { delayIncrement: 0.5 }),
        { POSITION: { LENGTH: 14.5, WIDTH: 6 } },
        { POSITION: { LENGTH: 11, WIDTH: 8, ASPECT: -1.2 } },
        {
            POSITION: { LENGTH: 1, WIDTH: 8, X: 14.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.minion, g.productionist]),
                TYPE: "tinyMinion",
                STAT_CALCULATOR: "drone",
                SYNCS_SKILLS: true
            }
        }
    ]
}

upgrade(["carrier", "productionist"], "initiator")
