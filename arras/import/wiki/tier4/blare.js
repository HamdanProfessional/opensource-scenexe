const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const pelletShot = combineStats([g.basic, g.pelleter, g.artillery])
const sidePellets = (y, angle, length = 17, width = 5, shot = pelletShot) => weaponMirror({
    POSITION: { LENGTH: length, WIDTH: width, Y: y, ANGLE: angle, DELAY: 0.25 },
    PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
}, { delayIncrement: 0.5 })

Class.blare = {
    PARENT: "genericTank",
    LABEL: "Blare",
    DANGER: 7,
    BODY: Class.shotgun.BODY,
    GUNS: [
        ...sidePellets(-8, -7),
        ...Class.shotgun.GUNS
    ]
}

upgrade(["artillery", "shotgun"], "blare")
