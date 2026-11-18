const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const retype = (guns, from, to) => guns.map(gun => {
    const type = gun.PROPERTIES && gun.PROPERTIES.TYPE
    if ([].concat(type)[0] !== from) return gun
    return { ...gun, PROPERTIES: { ...gun.PROPERTIES, TYPE: Array.isArray(type) ? [to, type[1]] : to } }
})
const modAll = (guns, mods) => guns.map(gun => gun.PROPERTIES && gun.PROPERTIES.SHOOT_SETTINGS
    ? { ...gun, PROPERTIES: { ...gun.PROPERTIES, SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, mods]) } }
    : gun)
const missileGun = (angle, y, x, mods = {}) => ({
    POSITION: { LENGTH: 10, WIDTH: 5, ASPECT: 1, X: x, Y: y, ANGLE: angle, DELAY: 0 },
    PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([g.basic, { size: 0.8, damage: 0.7, range: 0.6 }, mods]),
        TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }]
    }
})

Class.scorcherMissile = {
    PARENT: "rocketeerMissile",
    GUNS: [
        ...Class.rocketeerMissile.GUNS,
        missileGun(40, -5, 4),
        missileGun(-40, 5, 4),
        missileGun(180, 0, 4, { size: 0.6 })
    ]
}

Class.scorcher = {
    PARENT: "genericTank",
    LABEL: "Scorcher",
    DANGER: 8,
    BODY: Class.skimmer.BODY,
    GUNS: modAll(retype(Class.skimmer.GUNS, "missile", "scorcherMissile"), { speed: 1.15, maxSpeed: 1.15 })
}

upgrade(["skimmer", "rocketeer"], "scorcher")
