const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.connector = {
    PARENT: "genericTank",
    LABEL: "Connector",
    DANGER: 8,
    BODY: { FOV: base.FOV * 1.15, SPEED: base.SPEED * 14 / 15 },
    GUNS: [
        {
            POSITION: { LENGTH: 20.5, WIDTH: 14, ANGLE: 180 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]), TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 18, WIDTH: 12 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 12, ASPECT: 1.1, X: 18 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: "assemblent",
                STAT_CALCULATOR: "block",
                NO_LIMITATIONS: true,
                MAX_CHILDREN: 8
            }
        }
    ],
    TURRETS: [
        {
            TYPE: [
                "squareHatCurved",
                { COLOR: "darkGrey" }
            ],
            POSITION: { X: 14, SIZE: 2, LAYER: 1 }
        }
    ]
}

upgrade(["assembler"], "connector")
