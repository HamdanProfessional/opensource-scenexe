const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const posObject = position => Array.isArray(position)
    ? { LENGTH: position[0], WIDTH: position[1], ASPECT: position[2], X: position[3], Y: position[4], ANGLE: position[5], DELAY: position[6] }
    : position
const upgradeGun = (gun, position = {}, mods = {}, type = gun.PROPERTIES.TYPE) => ({
    POSITION: { ...posObject(gun.POSITION), ...position },
    PROPERTIES: { ...gun.PROPERTIES, SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, mods]), TYPE: type }
})
const missileGun = (angle, y, x, mods = {}) => ({
    POSITION: { LENGTH: 10, WIDTH: 5, ASPECT: 1, X: x, Y: y, ANGLE: angle, DELAY: 0 },
    PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([g.basic, { size: 0.8, damage: 0.7, range: 0.6 }, mods]),
        TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }]
    }
})
const hurlerGuns = (type, mods = {}, width = 16) => [
    Class.hurler.GUNS[0],
    upgradeGun(Class.hurler.GUNS[1], { WIDTH: width }, mods, type)
]

Class.bungerMissile = {
    PARENT: "minimissile",
    GUNS: [...Class.minimissile.GUNS, missileGun(0, 0, 4, { reload: 1.2 })]
}

Class.bunger = {
    PARENT: "genericTank",
    LABEL: "Bunger",
    DANGER: 8,
    BODY: Class.hurler.BODY,
    GUNS: hurlerGuns("bungerMissile", { size: 1.2, damage: 1.2, health: 1.2, reload: 1.15 }, 19)
}

upgrade(["hurler", "inception"], "bunger")
