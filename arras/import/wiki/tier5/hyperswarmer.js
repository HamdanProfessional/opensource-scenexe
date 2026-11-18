const { combineStats, weaponArray } = require("../facilitators.js")

const posObject = position => Array.isArray(position)
    ? { LENGTH: position[0], WIDTH: position[1], ASPECT: position[2], X: position[3], Y: position[4], ANGLE: position[5], DELAY: position[6] }
    : position
const upgradeGun = (gun, position = {}, mods = {}, type = gun.PROPERTIES.TYPE) => ({
    POSITION: { ...posObject(gun.POSITION), ...position },
    PROPERTIES: { ...gun.PROPERTIES, SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, mods]), TYPE: type }
})
const retype = (guns, from, to) => guns.map(gun => {
    const type = gun.PROPERTIES && gun.PROPERTIES.TYPE
    if ([].concat(type)[0] !== from) return gun
    return { ...gun, PROPERTIES: { ...gun.PROPERTIES, TYPE: Array.isArray(type) ? [to, type[1]] : to } }
})
const beeSpawner = (angle, mods = {}) => upgradeGun(Class.hive.GUNS[0], { ANGLE: angle }, mods)

Class.hyperswarmerHive = {
    PARENT: "hive",
    GUNS: weaponArray(beeSpawner(0), 8, { delayIncrement: 0.125 })
}

Class.hyperswarmer = {
    PARENT: "genericTank",
    LABEL: "Hyperswarmer",
    DANGER: 8,
    BODY: Class.swarmer.BODY,
    GUNS: retype(Class.swarmer.GUNS, "hive", "hyperswarmerHive")
}

upgrade(["swarmer"], "hyperswarmer")
