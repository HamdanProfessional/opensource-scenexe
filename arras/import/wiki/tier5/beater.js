const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const shot = combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }])

Class.beater = {
    PARENT: "genericTank",
    LABEL: "Beater",
    DANGER: 8,
    GUNS: weaponMirror([
        {
            POSITION: { LENGTH: 11, WIDTH: 3.5, Y: 10.75, DELAY: 0.8 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 12, WIDTH: 3.5, Y: 7.25, DELAY: 0.6 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 16, WIDTH: 3.5, Y: 3.75, DELAY: 0.2 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 20, WIDTH: 3, Y: -2 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        }
    ], { delayIncrement: 0.2 })
}

upgrade(["battery", "rimfire"], "beater")
