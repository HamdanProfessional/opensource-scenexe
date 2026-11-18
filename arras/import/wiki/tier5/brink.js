const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base, statnames } = require("../constants.js")

Class.brink = {
    PARENT: "genericTank",
    LABEL: "Brink",
    DANGER: 8,
    STAT_NAMES: statnames.mixed,
    BODY: {
        FOV: base.FOV * 1.1
    },
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 12, WIDTH: 7, Y: 5, DELAY: 0.25 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2, size: 2 / 3 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: { LENGTH: 16, WIDTH: 3, X: 2, Y: -2.5 }
            },
            {
                POSITION: { LENGTH: 2, WIDTH: 3, ASPECT: 1.77, X: 18, Y: -2.5 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ], { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 12, WIDTH: 10, X: 2 }
        }
    ]
}

upgrade(["rimfire", "equalizer"], "brink")
