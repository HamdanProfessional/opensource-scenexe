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

Class.flockMissile = {
    PARENT: "launcherMissile",
    GUNS: [
        ...Class.launcherMissile.GUNS,
        ...weaponArray(upgradeGun(Class.hive.GUNS[0], { LENGTH: 8, WIDTH: 8, ANGLE: 0 }, { shudder: 4, speed: 1.3 }, ["bee", { PERSISTS_AFTER_DEATH: true }]), 8)
            .map(gun => ({ ...gun, PROPERTIES: { ...gun.PROPERTIES, AUTOFIRE: false, SHOOT_ON_DEATH: true } }))
    ]
}

Class.flock = {
    PARENT: "genericTank",
    LABEL: "Flock",
    DANGER: 8,
    BODY: Class.launcher.BODY,
    GUNS: launcherGuns("flockMissile")
}

upgrade(["cluster"], "flock")
