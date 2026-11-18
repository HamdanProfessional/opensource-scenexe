const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const shot = combineStats([g.basic, g.pounder, g.twin, g.gunner, { speed: 1.2 }, { reload: 1.25, damage: 1.2, size: 1.2, range: 0.85 }])

Class.cannonade = {
    PARENT: "genericTank",
    LABEL: "Cannonade",
    DANGER: 8,
    GUNS: weaponMirror([
        {
            POSITION: { LENGTH: 12, WIDTH: 7, Y: 7.25, DELAY: 0.5 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 16, WIDTH: 7, Y: 3.75 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        }
    ], { delayIncrement: 0.25 })
}

upgrade(["volley"], "cannonade")
