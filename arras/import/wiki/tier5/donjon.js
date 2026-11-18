const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.donjon = {
    PARENT: "genericTank",
    LABEL: "Donjon",
    DANGER: 8,
    BODY: { FOV: base.FOV * 1.2 },
    GUNS: [
        ...weaponArray({
            POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5, ANGLE: 180 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.swarm]), TYPE: "swarm", STAT_CALCULATOR: "swarm" }
        }, 3, { delayIncrement: 1 / 3 }),
        ...weaponArray([
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
            }
        ], 3)
    ]
}

upgrade(["fortress", "triMachine"], "donjon")
