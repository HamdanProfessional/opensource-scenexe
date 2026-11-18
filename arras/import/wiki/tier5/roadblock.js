const { combineStats, weaponStack } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base, statnames } = require("../constants.js")

Class.roadblock = {
    PARENT: "genericTank",
    LABEL: "Roadblock",
    DANGER: 8,
    STAT_NAMES: statnames.trap,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: [
        {
            POSITION: { LENGTH: 24, WIDTH: 8, ASPECT: 1.4 }
        },
        ...weaponStack({
            POSITION: { LENGTH: 4, WIDTH: 8, ASPECT: 1.3, X: 22 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.minigun, g.barricade, { reload: 0.8, spray: 2.5 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }, 3, { xPosOffset: 4, delayIncrement: 1 / 3 })
    ]
}

upgrade(["widget", "barricade"], "roadblock")
