const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.biggerCheese = {
    PARENT: "genericTank",
    LABEL: "Bigger Cheese",
    DANGER: 8,
    STAT_NAMES: Class.bigCheese.STAT_NAMES,
    BODY: Class.bigCheese.BODY,
    GUNS: [
        {
            POSITION: { LENGTH: 15, WIDTH: 20, ASPECT: 1.3, X: 2 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.honcho, g.bigCheese, { damage: 2, health: 1.3 }]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 1
            }
        }
    ]
}

upgrade(["bigCheese"], "biggerCheese")
