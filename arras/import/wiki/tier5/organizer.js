const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.organizer = {
    PARENT: "genericTank",
    LABEL: "Organizer",
    DANGER: 8,
    BODY: { FOV: base.FOV * 1.15, SPEED: base.SPEED * 14 / 15 },
    GUNS: [
        {
            POSITION: { LENGTH: 18, WIDTH: 18 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 18, ASPECT: 1.2, X: 18 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.construct]),
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

upgrade(["assembler"], "organizer")
