const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.springerAssemblent = {
    PARENT: "assemblent",
    CONTROLLERS: ["boomerang"],
    MOTION_TYPE: "motor",
    SHAPE: -5,
    BODY: { SPEED: 1.25, RANGE: 120 }
}

Class.springer = {
    PARENT: "genericTank",
    LABEL: "Springer",
    DANGER: 8,
    FACING_TYPE: "locksFacing",
    BODY: { FOV: base.FOV * 1.15, SPEED: base.SPEED * 14 / 15 },
    GUNS: [
        {
            POSITION: { LENGTH: 18, WIDTH: 12 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 12, ASPECT: 1.1, X: 18 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: "springerAssemblent",
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

upgrade(["assembler"], "springer")
