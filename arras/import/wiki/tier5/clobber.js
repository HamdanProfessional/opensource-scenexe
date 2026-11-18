const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const artilleryShot = combineStats([g.basic, g.pounder, g.destroyer, g.artillery])
const pelletShot = combineStats([g.basic, g.pelleter, g.artillery])
const sidePellets = (y, angle, length = 17, width = 5, shot = pelletShot) => weaponMirror({
    POSITION: { LENGTH: length, WIDTH: width, Y: y, ANGLE: angle, DELAY: 0.25 },
    PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
}, { delayIncrement: 0.5 })
const heavyCannon = (width = 12, shot = artilleryShot) => ({
    POSITION: { LENGTH: 19, WIDTH: width },
    PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
})

Class.clobber = {
    PARENT: "genericTank",
    LABEL: "Clobber",
    DANGER: 8,
    GUNS: [
        ...sidePellets(-6, 0, 17, 5, combineStats([pelletShot, { spray: 0.4, shudder: 0.5 }])),
        heavyCannon(14)
    ]
}

upgrade(["queller"], "clobber")
