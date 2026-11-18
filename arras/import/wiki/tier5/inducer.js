const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.inducer = {
    PARENT: "genericTank",
    LABEL: "Inducer",
    DANGER: 8,
    STAT_NAMES: Class.productionist.STAT_NAMES,
    BODY: Class.productionist.BODY,
    GUNS: [
        ...weaponMirror([
            { POSITION: { LENGTH: 14.5, WIDTH: 6, Y: 5.2 } },
            { POSITION: { LENGTH: 11, WIDTH: 8, Y: 5.2, ASPECT: -1.2 } },
            {
                POSITION: { LENGTH: 1, WIDTH: 8, Y: 5.2, X: 14.5 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.minion, g.productionist, g.doper]),
                    TYPE: "tinyMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true
                }
            },
            { POSITION: { LENGTH: 6, WIDTH: 1, Y: 5.2, ASPECT: -5, X: 8 } }
        ], { delayIncrement: 0.5 })
    ]
}

upgrade(["productionist", "mosey", "issuer"], "inducer")
