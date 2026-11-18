const { combineStats, weaponMirror } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

Class.parapet = {
    PARENT: "genericTank",
    LABEL: "Parapet",
    STAT_NAMES: statnames.mixed,
    DANGER: 7,
    GUNS: weaponMirror([
        {
            POSITION: { LENGTH: 20, WIDTH: 8, Y: 5.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.twin]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: { LENGTH: 15, WIDTH: 8, Y: 5.5, ANGLE: 185 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 8, ASPECT: 1.5, X: 14, Y: 5.5, ANGLE: 185 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.setTrap]),
                TYPE: "setTrap",
                MAX_CHILDREN: 3,
                NO_LIMITATIONS: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "block"
            }
        }
    ], { delayIncrement: 0.5 })
}

upgrade(["bulwark"], "parapet")
