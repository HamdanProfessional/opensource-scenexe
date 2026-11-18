const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.bismarck = {
    PARENT: "genericTank",
    LABEL: "Bismarck",
    DANGER: 8,
    FACING_TYPE: "locksFacing",
    STAT_NAMES: Class.battleship.STAT_NAMES,
    BODY: Class.battleship.BODY,
    GUNS: [
        ...weaponMirror([
            { POSITION: { LENGTH: 14.5, WIDTH: 6, Y: 5.2, ANGLE: 90 } },
            { POSITION: { LENGTH: 11, WIDTH: 8, Y: 5.2, ASPECT: -1.2, ANGLE: 90 } },
            {
                POSITION: { LENGTH: 1, WIDTH: 8, Y: 5.2, X: 14.5, ANGLE: 90 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.minion, g.productionist]),
                    TYPE: "tinyMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true
                }
            }
        ], { delayIncrement: 0.5 }),
        ...weaponMirror([
            { POSITION: { LENGTH: 14.5, WIDTH: 6, Y: 5.2, ANGLE: 270 } },
            { POSITION: { LENGTH: 11, WIDTH: 8, Y: 5.2, ASPECT: -1.2, ANGLE: 270 } },
            {
                POSITION: { LENGTH: 1, WIDTH: 8, Y: 5.2, X: 14.5, ANGLE: 270 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.minion, g.productionist]),
                    TYPE: "tinyMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true
                }
            }
        ], { delayIncrement: 0.5 })
    ]
}

upgrade(["battleship", "productionist"], "bismarck")
