const { combineStats, weaponArray } = require("../facilitators.js")

const posObject = position => Array.isArray(position)
    ? { LENGTH: position[0], WIDTH: position[1], ASPECT: position[2], X: position[3], Y: position[4], ANGLE: position[5], DELAY: position[6] }
    : position
const upgradeGun = (gun, position = {}, mods = {}, type = gun.PROPERTIES.TYPE) => ({
    POSITION: { ...posObject(gun.POSITION), ...position },
    PROPERTIES: { ...gun.PROPERTIES, SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, mods]), TYPE: type }
})
const launcherGuns = (type, mods = {}, width = 13) => [
    Class.launcher.GUNS[0],
    upgradeGun(Class.launcher.GUNS[1], { WIDTH: width }, mods, type)
]
const beeSpawner = (angle, mods = {}) => upgradeGun(Class.hive.GUNS[0], { ANGLE: angle }, mods)

Class.molotovMissile = {
    PARENT: "launcherMissile",
    FACING_TYPE: ["spin", { speed: -0.15 }],
    GUNS: [...Class.launcherMissile.GUNS, ...weaponArray(beeSpawner(0), 5, { delayIncrement: 0.2 })]
}

Class.molotov = {
    PARENT: "genericTank",
    LABEL: "Molotov",
    DANGER: 8,
    BODY: Class.launcher.BODY,
    GUNS: launcherGuns("molotovMissile")
}

upgrade(["cluster"], "molotov")
