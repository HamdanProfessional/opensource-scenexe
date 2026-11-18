const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.bentBoomer = {
    PARENT: "genericTank",
    LABEL: "Bent Boomer",
    DANGER: 8,
    FACING_TYPE: "locksFacing",
    BODY: { FOV: base.FOV * 1.15, SPEED: base.SPEED * 14 / 15 },
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 18, WIDTH: 10, ANGLE: 45 }
            },
            {
                POSITION: { LENGTH: 13, WIDTH: 10, ASPECT: -1.9, ANGLE: 45 }
            },
            {
                POSITION: { LENGTH: 2, WIDTH: 10, ASPECT: 1.3, X: 18, ANGLE: 45 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.boomerang]),
                    TYPE: "boomerang",
                    STAT_CALCULATOR: "block"
                }
            }
        ], { delayIncrement: 0.5 })
    ]
}

upgrade(["boomer"], "bentBoomer")
