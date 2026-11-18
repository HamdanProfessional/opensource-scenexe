const { combineStats, weaponMirror } = require("../facilitators.js")
const { base } = require("../constants.js")
const g = require("../gunvals.js")

const shot = combineStats([g.basic, g.sniper, g.assassin, g.twin, { speed: 1.15, maxSpeed: 1.15, reload: 1.2 }])

Class.duelist = {
    PARENT: "genericTank",
    LABEL: "Duelist",
    DANGER: 7,
    BODY: {
        ...Class.assassin.BODY,
        FOV: base.FOV * 1.35
    },
    GUNS: weaponMirror([
        {
            POSITION: { LENGTH: 23, WIDTH: 7, Y: 3.5 }
        },
        {
            POSITION: { LENGTH: 27, WIDTH: 5, Y: 3.5 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 20, WIDTH: 7, Y: 8.5 }
        },
        {
            POSITION: { LENGTH: 24, WIDTH: 5, Y: 8.5, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        }
    ], { delayIncrement: 0.5 })
}

upgrade(["musket", "enforcer"], "duelist")
