const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.overmachAR = {
    PARENT: "genericTank",
    LABEL: "Overmach",
    DANGER: 7,
    BODY: { FOV: base.FOV * 1.2 },
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
        ...weaponMirror({
            POSITION: { LENGTH: 6, WIDTH: 11, ASPECT: 1.2, X: 8, ANGLE: 152.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
                TYPE: "drone",
                STAT_CALCULATOR: "drone",
                SYNCS_SKILLS: true,
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 3
            }
        })
    ]
}

upgrade(["deviation", "overtrapper"], "overmachAR")
