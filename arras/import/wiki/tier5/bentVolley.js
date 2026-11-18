const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const shot = combineStats([g.basic, g.pounder, g.twin, g.gunner, { speed: 1.2 }])

Class.bentVolley = {
    PARENT: "genericTank",
    LABEL: "Bent Volley",
    DANGER: 8,
    GUNS: weaponMirror([
        {
            POSITION: { LENGTH: 10, WIDTH: 5, Y: 8.25, ANGLE: 18, DELAY: 2 / 3 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 14, WIDTH: 5, Y: 4.75, ANGLE: 18, DELAY: 1 / 3 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 16, WIDTH: 5, Y: 3.75 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        }
    ], { delayIncrement: 1 / 6 })
}

upgrade(["bentGunner"], "bentVolley")
