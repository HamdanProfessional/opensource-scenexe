const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const shot = combineStats([g.basic, g.pounder, g.twin, g.gunner, { speed: 1.2 }, { reload: 0.8, spray: 1.8 }])

Class.machineVolley = {
    PARENT: "genericTank",
    LABEL: "Machine Volley",
    DANGER: 8,
    GUNS: weaponMirror([
        {
            POSITION: { LENGTH: 12, WIDTH: 5, ASPECT: 1.3, Y: 7.25, DELAY: 0.5 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 16, WIDTH: 5, ASPECT: 1.3, Y: 3.75 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        }
    ], { delayIncrement: 0.25 })
}

upgrade(["machineGunner", "volley"], "machineVolley")
