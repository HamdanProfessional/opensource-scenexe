const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.machete = {
    PARENT: "genericTank",
    LABEL: "Machete",
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 12, WIDTH: 3.5, Y: 7.25, DELAY: 0.5 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: { LENGTH: 16, WIDTH: 3.5, Y: 7.25 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: { LENGTH: 14, WIDTH: 3.5, Y: 3.75 }
            },
            {
                POSITION: { LENGTH: 2, WIDTH: 3.5, ASPECT: 1.77, X: 14, Y: 3.75 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap"
                }
            },
            {
                POSITION: { LENGTH: 18, WIDTH: 3.5, Y: 3.75, DELAY: 0.5 }
            },
            {
                POSITION: { LENGTH: 2, WIDTH: 3.5, ASPECT: 1.77, X: 18, Y: 3.75, DELAY: 0.5 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ], { delayIncrement: 0.25 })
    ]
}

upgrade(["encircler", "hutch", "equalizer"], "machete")
