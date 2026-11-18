const { combineStats, weaponStack } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.barrier = {
    PARENT: "genericTank",
    LABEL: "Barrier",
    DANGER: 8,
    BODY: { FOV: base.FOV * 1.2 },
    GUNS: [
        {
            POSITION: { LENGTH: 24, WIDTH: 8 }
        },
        ...weaponStack({
            POSITION: { LENGTH: 4, WIDTH: 8, ASPECT: 1.3, X: 22 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.minigun, g.barricade]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }, 5, { xPosOffset: 4, delayIncrement: 1 / 5 })
    ]
}

upgrade(["barricade"], "barrier")
