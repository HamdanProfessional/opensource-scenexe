const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.repairmanAR = {
    PARENT: "genericTank",
    LABEL: "Repairman",
    DANGER: 8,
    GUNS: [
        {
            POSITION: { LENGTH: 15, WIDTH: 9, ASPECT: 1.4 }
        },
        {
            POSITION: { LENGTH: 12, WIDTH: 11 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 11, ASPECT: 1.3, X: 15 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trapSpray, g.machineGun, { size: 2 / 3, spray: 5 }]),
                TYPE: "autoTrap",
                STAT_CALCULATOR: "trap"
            }
        },
        {
            POSITION: { LENGTH: 6, WIDTH: 11, ASPECT: 1.2, X: 8, ANGLE: 180 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
                TYPE: [
                    "drone",
                    { INDEPENDENT: true }
                ],
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 3
            }
        }
    ]
}

upgrade(["machineMech", "cobbler", "deviation"], "repairmanAR")
