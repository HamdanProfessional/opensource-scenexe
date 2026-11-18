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
const missileGun = (angle, y, x, mods = {}) => ({
    POSITION: { LENGTH: 10, WIDTH: 5, ASPECT: 1, X: x, Y: y, ANGLE: angle, DELAY: 0 },
    PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([g.basic, { size: 0.8, damage: 0.7, range: 0.6 }, mods]),
        TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }]
    }
})

Class.embargoMissile = {
    PARENT: "launcherMissile",
    GUNS: [...Class.launcherMissile.GUNS, missileGun(0, 0, 6)]
}

Class.embargo = {
    PARENT: "genericTank",
    LABEL: "Embargo",
    DANGER: 8,
    BODY: Class.fieldGun.BODY,
    GUNS: [
        ...retype(Class.fieldGun.GUNS, "launcherMissile", "embargoMissile"),
        ...outerPellets
    ]
}

upgrade(["fieldGun", "projector"], "embargo")
