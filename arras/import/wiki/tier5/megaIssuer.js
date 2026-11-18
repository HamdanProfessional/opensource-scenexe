const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.megaIssuer = {
    PARENT: "genericTank",
    LABEL: "Mega Issuer",
    DANGER: 8,
    STAT_NAMES: Class.issuer.STAT_NAMES,
    BODY: Class.issuer.BODY,
    GUNS: [
        { POSITION: { LENGTH: 4.5, WIDTH: 12, X: 10.5 } },
        {
            POSITION: { LENGTH: 1, WIDTH: 14, X: 15 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.minion, g.spawner, g.doper, { size: 0.8 }]),
                TYPE: "megaMinion",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 4
            }
        },
        { POSITION: { LENGTH: 11.5, WIDTH: 14 } },
        { POSITION: { LENGTH: 6, WIDTH: 1, ASPECT: -5, X: 8 } }
    ]
}

upgrade(["megaSpawner", "issuer"], "megaIssuer")
