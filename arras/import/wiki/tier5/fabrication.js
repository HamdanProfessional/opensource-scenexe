const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.fabrication = {
    PARENT: "genericTank",
    LABEL: "Fabrication",
    DANGER: 8,
    STAT_NAMES: Class.productionist.STAT_NAMES,
    BODY: Class.productionist.BODY,
    GUNS: [
        ...weaponMirror([
            { POSITION: { LENGTH: 14.5, WIDTH: 8, Y: 6 } },
            { POSITION: { LENGTH: 11, WIDTH: 10, Y: 6, ASPECT: -1.2 } },
            {
                POSITION: { LENGTH: 1, WIDTH: 10, Y: 6, X: 14.5 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.minion, g.productionist, g.honcho]),
                    TYPE: "tinyMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true
                }
            }
        ], { delayIncrement: 0.5 })
    ]
}

upgrade(["productionist", "baltimore", "foundry"], "fabrication")
