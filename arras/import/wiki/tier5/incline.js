const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const posObject = position => Array.isArray(position)
    ? { LENGTH: position[0], WIDTH: position[1], ASPECT: position[2], X: position[3], Y: position[4], ANGLE: position[5], DELAY: position[6] }
    : position
const upgradeGun = (gun, position = {}, mods = {}, type = gun.PROPERTIES.TYPE) => ({
    POSITION: { ...posObject(gun.POSITION), ...position },
    PROPERTIES: { ...gun.PROPERTIES, SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, mods]), TYPE: type }
})
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
const hurlerGuns = (type, mods = {}, width = 16) => [
    Class.hurler.GUNS[0],
    upgradeGun(Class.hurler.GUNS[1], { WIDTH: width }, mods, type)
]

Class.inclineMissile = {
    PARENT: "minimissile",
    GUNS: [...Class.minimissile.GUNS, thruster(155, -3), thruster(205, 3)]
}

Class.incline = {
    PARENT: "genericTank",
    LABEL: "Incline",
    DANGER: 8,
    BODY: Class.hurler.BODY,
    GUNS: hurlerGuns("inclineMissile", { size: 1.2, damage: 1.2, health: 1.2, reload: 1.15 }, 19)
}

upgrade(["hurler", "pitcher"], "incline")
