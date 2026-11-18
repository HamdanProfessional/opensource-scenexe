const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

const posObject = position => Array.isArray(position)
    ? { LENGTH: position[0], WIDTH: position[1], ASPECT: position[2], X: position[3], Y: position[4], ANGLE: position[5], DELAY: position[6] }
    : position
const upgradeGun = (gun, position = {}, mods = {}, type = gun.PROPERTIES.TYPE) => ({
    POSITION: { ...posObject(gun.POSITION), ...position },
    PROPERTIES: { ...gun.PROPERTIES, SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, mods]), TYPE: type }
})
const burst = (count, mods = {}) => weaponArray({
    POSITION: { LENGTH: 8, WIDTH: 8 },
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, { size: 1.6, range: 0.3 }, mods]),
        TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
        SHOOT_ON_DEATH: true
    }
}, count)
const hurlerGuns = (type, mods = {}, width = 16) => [
    Class.hurler.GUNS[0],
    upgradeGun(Class.hurler.GUNS[1], { WIDTH: width }, mods, type)
]

Class.bombardMissile = {
    PARENT: "minimissile",
    GUNS: [...Class.minimissile.GUNS, ...burst(8, { size: 1.3, health: 1.4 })]
}

Class.bombard = {
    PARENT: "genericTank",
    LABEL: "Bombard",
    DANGER: 8,
    BODY: Class.hurler.BODY,
    GUNS: hurlerGuns("bombardMissile", { size: 1.15, health: 1.2 })
}

upgrade(["hurler", "cluster"], "bombard")
