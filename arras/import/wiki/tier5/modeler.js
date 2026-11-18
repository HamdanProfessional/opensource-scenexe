const { combineStats, weaponArray, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.modelerTrap = {
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

Class.modeler = {
    PARENT: "genericTank",
    LABEL: "Modeler",
    DANGER: 8,
    BODY: { FOV: base.FOV * 1.15, SPEED: base.SPEED * 14 / 15 },
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 17, WIDTH: 5, Y: -5, ANGLE: -7, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]), TYPE: "bullet" }
        }, { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 17, WIDTH: 12 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 12, ASPECT: 1.1, X: 17 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: "modelerTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ]
}

upgrade(["forger", "charger"], "modeler")
