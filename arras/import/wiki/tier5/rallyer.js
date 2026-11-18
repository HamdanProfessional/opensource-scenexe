const { combineStats, weaponArray, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.rallyerTrap = {
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

Class.rallyer = {
    PARENT: "genericTank",
    LABEL: "Rallyer",
    DANGER: 8,
    BODY: { FOV: base.FOV * 1.15, SPEED: base.SPEED * 14 / 15 },
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 15, WIDTH: 7, Y: 6, ANGLE: 14 }
            },
            {
                POSITION: { LENGTH: 2, WIDTH: 7, ASPECT: 1.1, X: 15, Y: 6, ANGLE: 14 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                    TYPE: "rallyerTrap",
                    STAT_CALCULATOR: "block"
                }
            }
        ], { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 18, WIDTH: 12 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 12, ASPECT: 1.1, X: 18 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: "rallyerTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ]
}

upgrade(["fashioner", "charger"], "rallyer")
