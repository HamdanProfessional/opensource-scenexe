const { combineStats, weaponArray, makeAuto } = require("../facilitators.js")
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
const launcherGuns = (type, mods = {}, width = 13) => [
    Class.launcher.GUNS[0],
    upgradeGun(Class.launcher.GUNS[1], { WIDTH: width }, mods, type)
]

Class.autoClusterMissile = {
    PARENT: "launcherMissile",
    GUNS: [...Class.launcherMissile.GUNS, ...burst(6)]
}
Class.autoCluster = makeAuto({
    PARENT: "genericTank",
    LABEL: "Cluster",
    BODY: Class.launcher.BODY,
    GUNS: launcherGuns("autoClusterMissile")
}, "Auto-Cluster")

upgrade(["cluster", "autoLauncher"], "autoCluster")
