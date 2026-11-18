const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.assailerShard = {
    PARENT: "trap",
    LABEL: "Shard",
    GUNS: [
        ...weaponArray({
            POSITION: { LENGTH: 1, WIDTH: 6 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { size: 0.3, damage: 0.7, range: 0.5 }]),
                TYPE: "trap",
                SHOOT_ON_DEATH: true,
                STAT_CALCULATOR: "trap"
            }
        }, 3)
    ]
}

Class.assailerTrap = {
    PARENT: "setTrap",
    LABEL: "Charged Trap",
    DIE_AT_RANGE: true,
    GUNS: [
        ...weaponArray({
            POSITION: { LENGTH: 1, WIDTH: 6 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { size: 0.45, damage: 0.8, range: 0.6 }]),
                TYPE: "assailerShard",
                SHOOT_ON_DEATH: true,
                STAT_CALCULATOR: "trap"
            }
        }, 5)
    ]
}

Class.assailer = {
    PARENT: "genericTank",
    LABEL: "Assailer",
    DANGER: 8,
    BODY: { FOV: base.FOV * 1.15, SPEED: base.SPEED * 14 / 15 },
    GUNS: [
        {
            POSITION: { LENGTH: 18, WIDTH: 12 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 12, ASPECT: 1.1, X: 18 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: "assailerTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ]
}

upgrade(["charger"], "assailer")
