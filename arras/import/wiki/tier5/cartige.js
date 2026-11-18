const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const retype = (guns, from, to) => guns.map(gun => {
    const type = gun.PROPERTIES && gun.PROPERTIES.TYPE
    if ([].concat(type)[0] !== from) return gun
    return { ...gun, PROPERTIES: { ...gun.PROPERTIES, TYPE: Array.isArray(type) ? [to, type[1]] : to } }
})
const missileGun = (angle, y, x, mods = {}) => ({
    POSITION: { LENGTH: 10, WIDTH: 5, ASPECT: 1, X: x, Y: y, ANGLE: angle, DELAY: 0 },
    PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([g.basic, { size: 0.8, damage: 0.7, range: 0.6 }, mods]),
        TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }]
    }
})

Class.cartigeHive = {
    PARENT: "hive",
    GUNS: [...Class.hive.GUNS, missileGun(0, 0, 6, { reload: 0.6, spray: 2 })]
}

Class.cartige = {
    PARENT: "genericTank",
    LABEL: "Cartige",
    DANGER: 8,
    BODY: Class.swarmer.BODY,
    GUNS: retype(Class.swarmer.GUNS, "hive", "cartigeHive")
}

upgrade(["swarmer"], "cartige")
