const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.compartmentTrap = {
    PARENT: "setTrap",
    LABEL: "Charged Trap",
    DIE_AT_RANGE: true,
    GUNS: [
        ...weaponArray({
            POSITION: { LENGTH: 1, WIDTH: 6 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { size: 0.45, damage: 0.8, range: 0.6 }]),
                TYPE: "trap",
                SHOOT_ON_DEATH: true,
                STAT_CALCULATOR: "trap"
            }
        }, 4)
    ]
}

Class.compartment = {
    PARENT: "genericTank",
    LABEL: "Compartment",
    DANGER: 8,
    BODY: { FOV: base.FOV * 1.15, SPEED: base.SPEED * 14 / 15 },
    GUNS: [
        {
            POSITION: { LENGTH: 23, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pen]), TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 18, WIDTH: 12 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 12, ASPECT: 1.1, X: 18 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: "compartmentTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ]
}

upgrade(["stall", "charger"], "compartment")
