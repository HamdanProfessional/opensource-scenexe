const { combineStats, weaponStack } = require("../facilitators.js")
const g = require("../gunvals.js")
const { base } = require("../constants.js")

Class.progenitor = {
    PARENT: "genericTank",
    LABEL: "Progenitor",
    DANGER: 8,
    BODY: { FOV: base.FOV * 1.15, SPEED: base.SPEED * 14 / 15 },
    GUNS: [
        ...weaponStack([
            {
                POSITION: { LENGTH: 18, WIDTH: 9 }
            },
            {
                POSITION: { LENGTH: 2, WIDTH: 9, ASPECT: 1.1, X: 18 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, { size: 0.6 }]),
                    TYPE: "assemblent",
                    STAT_CALCULATOR: "block",
                    NO_LIMITATIONS: true,
                    MAX_CHILDREN: 9
                }
            }
        ], 3, { delayIncrement: 1 / 3 })
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

upgrade(["assembler"], "progenitor")
