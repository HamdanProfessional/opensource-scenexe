const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.coral = {
    PARENT: "genericTank",
    LABEL: "Coral",
    DANGER: 8,
    BODY: { FOV: base.FOV * 1.2 },
    GUNS: [
        ...weaponArray({
            POSITION: { LENGTH: 9, WIDTH: 8.2, ASPECT: 0.6, X: 5, ANGLE: 60 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.swarm]), TYPE: "swarm", STAT_CALCULATOR: "swarm" }
        }, 3, { delayIncrement: 1 / 3 }),
        ...weaponArray([
            {
                POSITION: { LENGTH: 20, WIDTH: 8 },
                PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pen]), TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 4, WIDTH: 8, ASPECT: 1.7, X: 13 },
                PROPERTIES: { SHOOT_SETTINGS: combineStats([g.trap]), TYPE: "trap", STAT_CALCULATOR: "trap" }
            }
        ], 3)
    ]
}

upgrade(["triPen"], "coral")
