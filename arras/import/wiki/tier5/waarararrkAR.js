const { dereference, combineStats, weaponMirror } = require("../facilitators.js")
const { statnames } = require("../constants.js")
const g = require("../gunvals.js")

Class.waarararrkAR = {
    PARENT: "genericTank",
    LABEL: "Waarararrk",
    STAT_NAMES: statnames.trap,
    DANGER: 8,
    GUNS: [
        ...dereference(Class.waarrk).GUNS,
        ...weaponMirror([
            {
                POSITION: { LENGTH: 13, WIDTH: 8, Y: 3, ANGLE: 36 }
            },
            {
                POSITION: { LENGTH: 3.25, WIDTH: 8, ASPECT: 1.7, X: 12, Y: 3, ANGLE: 36, DELAY: 0.75 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.tripleShot]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ])
    ]
}

upgrade(["pentaShot", "waarrk"], "waarararrkAR")
