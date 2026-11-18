const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")
const { statnames } = require("../constants.js")

const destroyerShot = combineStats([g.basic, g.pounder, g.destroyer])
const miniTrapShot = combineStats([g.trap, g.twin, g.gunner, { speed: 1.2 }])
const miniTrapLauncher = (length, y, angle, delay = 0, shot = miniTrapShot) => [
    { POSITION: { LENGTH: length, WIDTH: 3.5, Y: y, ANGLE: angle } },
    {
        POSITION: { LENGTH: 2, WIDTH: 3.5, ASPECT: 1.77, X: length, Y: y, ANGLE: angle, DELAY: delay },
        PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "trap", STAT_CALCULATOR: "trap" }
    }
]

Class.blackjack = {
    PARENT: "genericTank",
    LABEL: "Blackjack",
    DANGER: 8,
    STAT_NAMES: statnames.trap,
    GUNS: [
        ...weaponMirror(miniTrapLauncher(14, 4.5, 180, 0), { delayIncrement: 0.5 }),
        ...weaponMirror(miniTrapLauncher(10, 8.5, 180, 0.25), { delayIncrement: 0.5 }),
        {
            POSITION: { LENGTH: 20.5, WIDTH: 14 },
            PROPERTIES: { SHOOT_SETTINGS: destroyerShot, TYPE: "bullet" }
        }
    ]
}

upgrade(["blower", "equalizer"], "blackjack")
