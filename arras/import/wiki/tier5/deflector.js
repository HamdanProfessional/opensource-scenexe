const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.deflector = {
    PARENT: "genericTank",
    LABEL: "Deflector",
    DANGER: 8,
    FACING_TYPE: "locksFacing",
    BODY: { FOV: base.FOV * 1.15, SPEED: base.SPEED * 14 / 15 },
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 15, WIDTH: 7, Y: 6, ANGLE: 14 }
            },
            {
                POSITION: { LENGTH: 2, WIDTH: 7, ASPECT: 1.1, X: 15, Y: 6, ANGLE: 14 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.boomerang]),
                    TYPE: "boomerang",
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
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.boomerang]),
                TYPE: "boomerang",
                STAT_CALCULATOR: "block"
            }
        }
    ]
}

upgrade(["fashioner"], "deflector")
