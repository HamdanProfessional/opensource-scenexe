const { combineStats, weaponMirror } = require("../facilitators.js")
const { base } = require("../constants.js")
const g = require("../gunvals.js")

const shot = combineStats([g.basic, g.sniper, g.rifle, g.twin, g.tripleShot])

Class.flintlock = {
    PARENT: "genericTank",
    LABEL: "Flintlock",
    DANGER: 7,
    BODY: {
        ...Class.rifle.BODY,
        FOV: base.FOV * 1.2
    },
    GUNS: [
        ...weaponMirror([
            {
                POSITION: { LENGTH: 17, WIDTH: 7, Y: 3.5, ANGLE: 16, DELAY: 0.5 }
            },
            {
                POSITION: { LENGTH: 19, WIDTH: 7, Y: 3.5, ANGLE: 16 },
                PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
            }
        ]),
        ...weaponMirror([
            {
                POSITION: { LENGTH: 15.5, WIDTH: 7, Y: 6.15 }
            },
            {
                POSITION: { LENGTH: 18, WIDTH: 7, Y: 4.15 },
                PROPERTIES: { SHOOT_SETTINGS: shot, TYPE: "bullet" }
            }
        ], { delayIncrement: 0.5 })
    ]
}

upgrade(["tripleShot", "musket"], "flintlock")
