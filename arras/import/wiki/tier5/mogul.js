const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.mogul = {
    PARENT: "genericTank",
    LABEL: "Mogul",
    DANGER: 8,
    STAT_NAMES: Class.captain.STAT_NAMES,
    BODY: Class.captain.BODY,
    GUNS: [
        ...weaponMirror([
            { POSITION: { LENGTH: 4.5, WIDTH: 10, X: 10.5, ANGLE: 90 } },
            {
                POSITION: { LENGTH: 1, WIDTH: 12, X: 15, ANGLE: 90 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.minion, g.spawner, g.doper]),
                    TYPE: "minion",
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                    MAX_CHILDREN: 4
                }
            },
            { POSITION: { LENGTH: 11.5, WIDTH: 12, ANGLE: 90 } },
            { POSITION: { LENGTH: 6, WIDTH: 1, ASPECT: -5, X: 8, ANGLE: 90 } }
        ])
    ]
}

upgrade(["dopeseer", "captain", "issuer"], "mogul")
