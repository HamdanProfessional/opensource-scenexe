const { combineStats, makeOver } = require("../facilitators.js")
const g = require("../gunvals.js")
const { statnames } = require("../constants.js")
const preset = require("../presets.js")

const body = {
    PARENT: "genericTank",
    LABEL: "Blight",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: { LENGTH: 17, WIDTH: 11, ASPECT: 1.6 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 18, ASPECT: 1.3, X: 17 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.machineGun, g.diesel, { reload: 0.8 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}

Class.blightAR = {
    ...makeOver(body, "Blight", preset.hybrid),
    DANGER: 8
}

upgrade(["polluter", "dieselTrapper", "deviation"], "blightAR")
