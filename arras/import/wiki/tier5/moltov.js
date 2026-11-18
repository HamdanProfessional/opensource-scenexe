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

Class.moltovHive = {
    PARENT: "hive",
    GUNS: [...Class.hive.GUNS, ...burst(6)]
}

Class.moltov = {
    PARENT: "genericTank",
    LABEL: "Moltov",
    DANGER: 8,
    BODY: Class.swarmer.BODY,
    GUNS: retype(Class.swarmer.GUNS, "hive", "moltovHive")
}

upgrade(["swarmer"], "moltov")
