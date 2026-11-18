const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.autoHutchAR = {
    PARENT: "genericTank",
    LABEL: "Auto-Hutch",
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 20.25, WIDTH: 8, Y: 5.5, ANGLE: 5 },
                PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pen]), TYPE: "bullet" }
            },
            {
                POSITION: { LENGTH: 3.25, WIDTH: 8, ASPECT: 1.7, X: 14, Y: 5.5, ANGLE: 5 },
                PROPERTIES: { SHOOT_SETTINGS: combineStats([g.trap, g.twin]), TYPE: "trap", STAT_CALCULATOR: "trap" }
            }
        ], { delayIncrement: 0.5 })
    ],
    TURRETS: [
        {
            POSITION: { X: 0, Y: 0, ANGLE: 180, SIZE: 10, ARC: 360, LAYER: 1 },
            TYPE: [
                "autoTurret",
                {
                    CONTROLLERS: ["nearestDifferentMaster"],
                    INDEPENDENT: true,
                    COLOR: "grey"
                }
            ]
        }
    ]
}

upgrade(["hutch", "autoPen", "autoWark"], "autoHutchAR")
