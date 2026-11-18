const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.overcheese = {
    PARENT: "genericTank",
    LABEL: "Overcheese",
    DANGER: 8,
    STAT_NAMES: Class.bigCheese.STAT_NAMES,
    BODY: Class.foreman.BODY,
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 14, WIDTH: 17, ASPECT: 1.3, X: 2, ANGLE: 90 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.honcho, g.bigCheese, { size: 1.15 }]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 1
            }
        })
    ]
}

upgrade(["foreman", "bigCheese"], "overcheese")
