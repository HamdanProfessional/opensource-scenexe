const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const pellet = combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }])

Class.lasher = {
    PARENT: "genericTank",
    LABEL: "Lasher",
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 10, WIDTH: 3, Y: 8.5, DELAY: 0.75 },
                PROPERTIES: { SHOOT_SETTINGS: pellet, TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 14, WIDTH: 3, Y: 6, DELAY: 0.5 },
                PROPERTIES: { SHOOT_SETTINGS: pellet, TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 18, WIDTH: 3, Y: 3.25, DELAY: 0.25 },
                PROPERTIES: { SHOOT_SETTINGS: pellet, TYPE: "bullet" }
            }
        ], { delayIncrement: 0.125 }),
        {
            POSITION: { LENGTH: 22, WIDTH: 3 },
            PROPERTIES: { SHOOT_SETTINGS: pellet, TYPE: "bullet" }
        }
    ]
}

upgrade(["triplet", "battery"], "lasher")
