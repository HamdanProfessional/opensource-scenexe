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

Class.catridgeMissile = {
    PARENT: "rocketeerMissile",
    GUNS: [...Class.rocketeerMissile.GUNS, ...weaponArray(beeSpawner(45), 4)]
}

Class.catridge = {
    PARENT: "genericTank",
    LABEL: "Catridge",
    DANGER: 8,
    BODY: Class.rocketeer.BODY,
    GUNS: retype(Class.rocketeer.GUNS, "rocketeerMissile", "catridgeMissile")
}

upgrade(["rocketeer"], "catridge")
