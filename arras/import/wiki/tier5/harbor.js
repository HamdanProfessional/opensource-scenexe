const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.harbor = {
    PARENT: "genericTank",
    LABEL: "Harbor",
    DANGER: 8,
    STAT_NAMES: Class.baltimore.STAT_NAMES,
    BODY: Class.baltimore.BODY,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 12, WIDTH: 8.7, ASPECT: 0.75, X: 3, Y: 4.6 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.honcho, g.doper]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                    SYNCS_SKILLS: true
                }
            },
            { POSITION: { LENGTH: 7, WIDTH: 1, ASPECT: -2.5, X: 8, Y: 4.6 } }
        ], { delayIncrement: 0.5 })
    ]
}

upgrade(["baltimore", "mosey", "junkie"], "harbor")
