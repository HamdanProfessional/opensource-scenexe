const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.sireAR = {
    PARENT: "genericTank",
    LABEL: "Sire",
    DANGER: 8,
    GUNS: [
        {
            POSITION: { LENGTH: 15, WIDTH: 9, ASPECT: 1.4 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 13, ASPECT: 1.3, X: 15 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trapSpray, g.machineGun, { size: 2 / 3, spray: 5 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        },
        {
            POSITION: { LENGTH: 6, WIDTH: 12, ASPECT: 1.2, X: 8, ANGLE: 180 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.minion]),
                TYPE: "minion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 2
            }
        }
    ]
}

upgrade(["deviation"], "sireAR")
