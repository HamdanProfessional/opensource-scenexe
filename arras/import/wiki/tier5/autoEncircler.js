const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.autoEncircler = {
    PARENT: "genericTank",
    LABEL: "Auto-Encircler",
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 13, WIDTH: 6, ANGLE: 30 }
            },
            {
                POSITION: { LENGTH: 3, WIDTH: 6, ASPECT: 1.7, X: 13, ANGLE: 30 },
                PROPERTIES: { SHOOT_SETTINGS: combineStats([g.trap]), TYPE: "trap", STAT_CALCULATOR: "trap" }
            }
        ], { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 20, WIDTH: 8 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pen]), TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 4, WIDTH: 8, ASPECT: 1.7, X: 13 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.trap]), TYPE: "trap", STAT_CALCULATOR: "trap" }
        }
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

upgrade(["encircler", "autoPen", "autoMachineTrapper"], "autoEncircler")
