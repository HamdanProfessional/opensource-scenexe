const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { statnames } = require("../constants.js")

const pelletShot = combineStats([g.basic, g.pelleter, g.artillery])
const megaTrapShot = combineStats([g.trap, g.megaTrap])
const sidePellets = (y, angle, length = 17, width = 5, shot = pelletShot) => weaponMirror({
    POSITION: { LENGTH: length, WIDTH: width, Y: y, ANGLE: angle, DELAY: 0.25 },
    PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
}, { delayIncrement: 0.5 })

Class.cornerer = {
    PARENT: "genericTank",
    LABEL: "Cornerer",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    GUNS: [
        ...sidePellets(-7, -7),
        { POSITION: { LENGTH: 14, WIDTH: 12 } },
        {
            POSITION: { LENGTH: 5, WIDTH: 12, ASPECT: 1.7, X: 13 },
            PROPERTIES: { SHOOT_SETTINGS: megaTrapShot, TYPE: "trap", STAT_CALCULATOR: "trap" }
        }
    ]
}

upgrade(["queller", "megaTrapper"], "cornerer")
