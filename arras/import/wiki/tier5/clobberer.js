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

Class.clobberer = {
    PARENT: "genericTank",
    LABEL: "Clobberer",
    DANGER: 8,
    GUNS: [
        ...sidePellets(-6, 0),
        heavyCannon(14)
    ]
}

upgrade(["foctillery"], "clobberer")
