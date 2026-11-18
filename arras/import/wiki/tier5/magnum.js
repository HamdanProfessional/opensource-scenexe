const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const pelletShot = combineStats([g.basic, g.pelleter, g.artillery])
const retype = (guns, from, to) => guns.map(gun => {
    const type = gun.PROPERTIES && gun.PROPERTIES.TYPE
    if ([].concat(type)[0] !== from) return gun
    return { ...gun, PROPERTIES: { ...gun.PROPERTIES, TYPE: Array.isArray(type) ? [to, type[1]] : to } }
})
const outerPellets = weaponMirror({
    POSITION: { LENGTH: 13, WIDTH: 3, Y: -9, ANGLE: -3.5, DELAY: 0.6 },
    PROPERTIES: { SHOOT_SETTINGS: pelletShot, TYPE: "bullet" }
}, { delayIncrement: 0.2 })
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

Class.magnumMissile = {
    PARENT: "launcherMissile",
    GUNS: [...Class.launcherMissile.GUNS, thruster(155, -3), thruster(205, 3)]
}

Class.magnum = {
    PARENT: "genericTank",
    LABEL: "Magnum",
    DANGER: 8,
    BODY: Class.fieldGun.BODY,
    GUNS: [
        ...retype(Class.fieldGun.GUNS, "launcherMissile", "magnumMissile"),
        ...outerPellets
    ]
}

upgrade(["fieldGun", "pitcher"], "magnum")
