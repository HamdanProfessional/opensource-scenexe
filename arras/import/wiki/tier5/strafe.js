const { combineStats, weaponMirror, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

const pelletShot = combineStats([g.basic, g.pelleter, g.artillery])
const retype = (guns, from, to) => guns.map(gun => {
    const type = gun.PROPERTIES && gun.PROPERTIES.TYPE
    if ([].concat(type)[0] !== from) return gun
    return { ...gun, PROPERTIES: { ...gun.PROPERTIES, TYPE: Array.isArray(type) ? [to, type[1]] : to } }
})
const burst = (count, mods = {}) => weaponArray({
    POSITION: { LENGTH: 8, WIDTH: 8 },
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, { size: 1.6, range: 0.3 }, mods]),
        TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
        SHOOT_ON_DEATH: true
    }
}, count)

Class.strafeMissile = {
    PARENT: "launcherMissile",
    GUNS: [...Class.launcherMissile.GUNS, ...burst(6)]
}

Class.strafe = {
    PARENT: "genericTank",
    LABEL: "Strafe",
    DANGER: 8,
    BODY: Class.fieldGun.BODY,
    GUNS: [
        ...retype(Class.fieldGun.GUNS, "launcherMissile", "strafeMissile"),
        ...weaponMirror({
            POSITION: { LENGTH: 15, WIDTH: 3, Y: -10, ANGLE: 0, DELAY: 0.5 },
            PROPERTIES: { SHOOT_SETTINGS: pelletShot, TYPE: "bullet" }
        }, { delayIncrement: 0.3 })
    ]
}

upgrade(["fieldGun", "cluster"], "strafe")
