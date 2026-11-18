const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const artilleryShot = combineStats([g.basic, g.pounder, g.destroyer, g.artillery])
const heavyCannon = (width = 12, shot = artilleryShot) => ({
    POSITION: { LENGTH: 19, WIDTH: width },
    PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
})

Class.represser = {
    PARENT: "genericTank",
    LABEL: "Represser",
    DANGER: 8,
    GUNS: [
        Class.beekeeper.GUNS[0],
        Class.beekeeper.GUNS[1],
        heavyCannon(14)
    ]
}

upgrade(["queller", "beekeeper"], "represser")
