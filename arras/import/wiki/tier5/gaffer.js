const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.gaffer = {
    PARENT: "genericTank",
    LABEL: "Gaffer",
    DANGER: 8,
    STAT_NAMES: Class.commander.STAT_NAMES,
    BODY: Class.commander.BODY,
    GUNS: [
        ...weaponArray({
            POSITION: { LENGTH: 6, WIDTH: 12, ASPECT: 1.2, X: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 2
            }
        }, 3),
        ...weaponArray([
            { POSITION: { LENGTH: 14.5, WIDTH: 6, ANGLE: 180 } },
            { POSITION: { LENGTH: 11, WIDTH: 8, ASPECT: -1.2, ANGLE: 180 } },
            {
                POSITION: { LENGTH: 1, WIDTH: 8, X: 14.5, ANGLE: 180 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.minion, g.productionist]),
                    TYPE: "tinyMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true
                }
            }
        ], 3, { delayIncrement: 1 / 3 })
    ]
}

upgrade(["commander", "productionist"], "gaffer")
