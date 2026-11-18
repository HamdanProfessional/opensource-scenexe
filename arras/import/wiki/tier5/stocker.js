const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.stocker = {
    PARENT: "genericTank",
    LABEL: "Stocker",
    DANGER: 8,
    STAT_NAMES: Class.foundry.STAT_NAMES,
    BODY: Class.foundry.BODY,
    GUNS: [
        ...weaponMirror([
            { POSITION: { LENGTH: 15, WIDTH: 15, ANGLE: 90 } },
            {
                POSITION: { LENGTH: 1, WIDTH: 17, X: 15, ANGLE: 90 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.minion, g.spawner, g.honcho]),
                    TYPE: "minion",
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                    MAX_CHILDREN: 3
                }
            },
            { POSITION: { LENGTH: 11.5, WIDTH: 17, ANGLE: 90 } }
        ])
    ]
}

upgrade(["foreman", "captain", "foundry"], "stocker")
