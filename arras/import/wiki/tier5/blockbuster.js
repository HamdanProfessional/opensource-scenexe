const { statnames } = require("../constants.js")
const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.blockbuster = {
    PARENT: "genericTank",
    LABEL: "Blockbuster",
    DANGER: 8,
    STAT_NAMES: statnames.mixed,
    BODY: Class.bomber.BODY,
    GUNS: [
        ...Class.bomber.GUNS.slice(0, 3),
        {
            POSITION: { LENGTH: 14, WIDTH: 11, ANGLE: 180 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 11, ASPECT: 1.2, X: 15, ANGLE: 180 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ]
}
upgrade(["bomber"], "blockbuster")
