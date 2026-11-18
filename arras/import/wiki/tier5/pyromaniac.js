const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const pelletShot = combineStats([g.basic, g.pelleter, g.artillery])
const retype = (guns, from, to) => guns.map(gun => {
    const type = gun.PROPERTIES && gun.PROPERTIES.TYPE
    if ([].concat(type)[0] !== from) return gun
    return { ...gun, PROPERTIES: { ...gun.PROPERTIES, TYPE: Array.isArray(type) ? [to, type[1]] : to } }
})
const pitcherSides = weaponMirror({
    POSITION: { LENGTH: 13, WIDTH: 5, Y: 4 },
    PROPERTIES: { SHOOT_SETTINGS: pelletShot, TYPE: "bullet" }
}, { delayIncrement: 0.5 })
const thruster = (angle, y = 0, length = 14, width = 6) => ({
    POSITION: { LENGTH: length, WIDTH: width, ASPECT: 1, X: 0, Y: y, ANGLE: angle, DELAY: 0 },
    PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, { speed: 1.3, maxSpeed: 1.3 }]),
        TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
        STAT_CALCULATOR: "thruster",
        WAIT_TO_CYCLE: true
    }
})

Class.pyromaniacMissile = {
    PARENT: "rocketeerMissile",
    GUNS: [...Class.rocketeerMissile.GUNS, thruster(155, -3), thruster(205, 3)]
}

Class.pyromaniac = {
    PARENT: "genericTank",
    LABEL: "Pyromaniac",
    DANGER: 8,
    BODY: Class.rocketeer.BODY,
    GUNS: [
        ...retype(Class.rocketeer.GUNS, "rocketeerMissile", "pyromaniacMissile"),
        ...pitcherSides
    ]
}

upgrade(["rocketeer", "pitcher"], "pyromaniac")
