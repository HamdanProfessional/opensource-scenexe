const { combineStats, weaponMirror } = require("../facilitators.js")
const { base } = require("../constants.js")
const g = require("../gunvals.js")

const shot = combineStats([g.basic, g.sniper, g.assassin, g.twin, g.dual, { reload: 1.2 }])

Class.dyadic = {
    PARENT: "genericTank",
    LABEL: "Dyadic",
    DANGER: 7,
    BODY: {
        ...Class.assassin.BODY,
        FOV: base.FOV * 1.35
    },
    CONTROLLERS: Class.hunter.CONTROLLERS,
    TOOLTIP: "Hold right click to zoom.",
    GUNS: weaponMirror([
        {
            POSITION: { LENGTH: 27, WIDTH: 6, Y: 3.5 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 24, WIDTH: 6, Y: 8.5, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
        }
    ], { delayIncrement: 0.5 })
}

upgrade(["dual", "courser"], "dyadic")
