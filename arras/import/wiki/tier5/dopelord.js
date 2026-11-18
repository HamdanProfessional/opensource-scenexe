const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.dopelord = {
    PARENT: "genericTank",
    LABEL: "Dopelord",
    DANGER: 8,
    STAT_NAMES: Class.overlord.STAT_NAMES,
    BODY: Class.overlord.BODY,
    MAX_CHILDREN: 8,
    GUNS: [
        ...weaponArray([
            {
                POSITION: { LENGTH: 6, WIDTH: 12, ASPECT: 1.2, X: 8 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.doper]),
                    TYPE: "drone",
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true
                }
            },
            { POSITION: { LENGTH: 6, WIDTH: 1, ASPECT: -5, X: 9 } }
        ], 4)
    ]
}

upgrade(["overlord", "dopeseer"], "dopelord")
