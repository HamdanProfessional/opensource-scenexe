const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const pelletShot = combineStats([g.basic, g.pelleter, g.artillery])

Class.sheller = {
    PARENT: "genericTank",
    LABEL: "Sheller",
    DANGER: 8,
    GUNS: [
        ...weaponMirror({
            POSITION: { LENGTH: 11, WIDTH: 3, Y: -11.5, ANGLE: -3.5, DELAY: 0.3 },
            PROPERTIES: { SHOOT_SETTINGS: pelletShot, TYPE: "bullet" }
        }, { delayIncrement: 0.2 }),
        ...Class.mortar.GUNS
    ]
}

upgrade(["mortar"], "sheller")
