const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.bigSwiss = {
    PARENT: "genericTank",
    LABEL: "Big Swiss",
    DANGER: 8,
    STAT_NAMES: Class.baltimore.STAT_NAMES,
    BODY: Class.baltimore.BODY,
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 12, WIDTH: 10.5, ASPECT: 0.75, X: 3, Y: 4.6 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.honcho, g.bigCheese]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
                SYNCS_SKILLS: true
            }
        }, { delayIncrement: 0.5 })
    ]
}

upgrade(["baltimore", "bigCheese"], "bigSwiss")
