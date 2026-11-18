const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.manufacture = {
    PARENT: "genericTank",
    LABEL: "Manufacture",
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
                    SHOOT_SETTINGS: combineStats([g.minion, g.productionist, { reload: 0.7 }]),
                    TYPE: "tinyMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true
                }
            }
        ], { delayIncrement: 0.5 })
    ]
}

upgrade(["productionist", "factory"], "manufacture")
