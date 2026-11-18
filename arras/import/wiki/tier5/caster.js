const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const pelletShot = combineStats([g.basic, g.pelleter, g.artillery])
const outerPellets = weaponMirror({
    POSITION: { LENGTH: 13, WIDTH: 3, Y: -9, ANGLE: -3.5, DELAY: 0.6 },
    PROPERTIES: { SHOOT_SETTINGS: pelletShot, TYPE: "bullet" }
}, { delayIncrement: 0.2 })

Class.caster = {
    PARENT: "genericTank",
    LABEL: "Caster",
    DANGER: 8,
    GUNS: [
        ...outerPellets,
        ...Class.forger.GUNS
    ]
}

upgrade(["mortar", "forger"], "caster")
