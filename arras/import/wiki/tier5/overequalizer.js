const { combineStats, makeOver, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const front = {
    PARENT: "genericTank",
    LABEL: "Overequalizer",
    DANGER: 7,
    BODY: Class.overseer.BODY,
    GUNS: weaponMirror([
        {
            POSITION: { LENGTH: 12, WIDTH: 3.5, Y: 7.25 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 3.5, ASPECT: 1.77, X: 12, Y: 7.25, DELAY: 0.5 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        },
        {
            POSITION: { LENGTH: 16, WIDTH: 3.5, Y: 3.75 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 3.5, ASPECT: 1.77, X: 16, Y: 3.75 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ], { delayIncrement: 0.25 })
}

Class.overequalizer = {
    ...makeOver(front, "Overequalizer", { maxDrones: 3 }),
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false,
    DANGER: 8
}

upgrade(["overgunner", "equalizer"], "overequalizer")
