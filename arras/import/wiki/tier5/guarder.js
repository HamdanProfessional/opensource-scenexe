const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const posObject = position => Array.isArray(position)
    ? { LENGTH: position[0], WIDTH: position[1], ASPECT: position[2], X: position[3], Y: position[4], ANGLE: position[5], DELAY: position[6] }
    : position
const upgradeGun = (gun, position = {}, mods = {}, type = gun.PROPERTIES.TYPE) => ({
    POSITION: { ...posObject(gun.POSITION), ...position },
    PROPERTIES: { ...gun.PROPERTIES, SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, mods]), TYPE: type }
})
const missileTrap = (angle, x = 12) => ({
    POSITION: { LENGTH: 3, WIDTH: 7, ASPECT: 1.7, X: x, ANGLE: angle, DELAY: 0.5 },
    PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([g.trap, { size: 0.6, range: 0.6 }]),
        TYPE: "trap",
        STAT_CALCULATOR: "trap"
    }
})
const launcherGuns = (type, mods = {}, width = 13) => [
    Class.launcher.GUNS[0],
    upgradeGun(Class.launcher.GUNS[1], { WIDTH: width }, mods, type)
]

Class.guarderMissile = {
    PARENT: "launcherMissile",
    GUNS: [...Class.launcherMissile.GUNS, missileTrap(0, 10)]
}

Class.guarder = {
    PARENT: "genericTank",
    LABEL: "Guarder",
    DANGER: 8,
    BODY: Class.launcher.BODY,
    GUNS: launcherGuns("guarderMissile")
}

upgrade(["projector"], "guarder")
