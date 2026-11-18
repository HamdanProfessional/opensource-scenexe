const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const annihilatorShot = combineStats([g.basic, g.pounder, g.destroyer, g.annihilator])
const pelletShot = combineStats([g.basic, g.pelleter, g.artillery])
const sidePellets = (y, angle, length = 17, width = 5, shot = pelletShot) => weaponMirror({
    POSITION: { LENGTH: length, WIDTH: width, Y: y, ANGLE: angle, DELAY: 0.25 },
    PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
}, { delayIncrement: 0.5 })

Class.stomper = {
    PARENT: "genericTank",
    LABEL: "Stomper",
    DANGER: 8,
    GUNS: [
        ...sidePellets(-12.5, -7),
        {
            POSITION: { LENGTH: 20.5, WIDTH: 19.5 },
            PROPERTIES: { SHOOT_SETTINGS: annihilatorShot, TYPE: "bullet" }
        }
    ]
}

upgrade(["annihilator", "queller"], "stomper")
