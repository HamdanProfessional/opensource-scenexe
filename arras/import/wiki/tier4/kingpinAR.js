const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.kingpinAR = {
    PARENT: "genericTank",
    LABEL: "Kingpin",
    DANGER: 7,
    STAT_NAMES: Class.overlord.STAT_NAMES,
    BODY: Class.overlord.BODY,
    MAX_CHILDREN: 7,
    GUNS: [
        { POSITION: { LENGTH: 14, WIDTH: 8 } },
        {
            POSITION: { LENGTH: 4, WIDTH: 8, ASPECT: 1.5, X: 14 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        },
        ...weaponMirror({
            POSITION: { LENGTH: 6, WIDTH: 12, ASPECT: 1.2, X: 8, ANGLE: 72 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true
            }
        }),
        ...weaponMirror({
            POSITION: { LENGTH: 6, WIDTH: 12, ASPECT: 1.2, X: 8, ANGLE: 144 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true
            }
        })
    ]
}

upgrade(["overlord", "overtrapper"], "kingpinAR")
