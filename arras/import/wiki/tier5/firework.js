const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

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

Class.fireworkMissile = {
    PARENT: "rocketeerMissile",
    GUNS: [...Class.rocketeerMissile.GUNS, ...burst(12)]
}

Class.firework = {
    PARENT: "genericTank",
    LABEL: "Firework",
    DANGER: 8,
    BODY: Class.rocketeer.BODY,
    GUNS: retype(Class.rocketeer.GUNS, "rocketeerMissile", "fireworkMissile")
}

upgrade(["rocketeer", "cluster"], "firework")
