const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const artilleryShot = combineStats([g.basic, g.pounder, g.destroyer, g.artillery])
const heavyCannon = (width = 12, shot = artilleryShot) => ({
    POSITION: { LENGTH: 19, WIDTH: width },
    PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
})

Class.crusher = {
    PARENT: "genericTank",
    LABEL: "Crusher",
    DANGER: 8,
    GUNS: [
        ...Class.mortar.GUNS.slice(0, 4),
        heavyCannon(15)
    ]
}

upgrade(["queller", "mortar"], "crusher")
