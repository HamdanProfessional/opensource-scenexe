const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

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
const missileDrone = (angle, y) => ({
    POSITION: { LENGTH: 6, WIDTH: 8, ASPECT: 1.2, X: 6, Y: y, ANGLE: angle, DELAY: 0 },
    PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([g.drone, g.overseer, { size: 0.6, reload: 1.5 }]),
        TYPE: ["drone", { PERSISTS_AFTER_DEATH: true }],
        STAT_CALCULATOR: "drone",
        MAX_CHILDREN: 2,
        WAIT_TO_CYCLE: true
    }
})
const beeSpawner = (angle, mods = {}) => upgradeGun(Class.hive.GUNS[0], { ANGLE: angle }, mods)

Class.voyageHive = {
    PARENT: "hive",
    GUNS: [
        ...weaponArray(beeSpawner(0), 3, { delayIncrement: 1 / 3 }),
        ...weaponArray(missileDrone(60, 0), 2, { startAngle: 0 })
    ]
}

Class.voyage = {
    PARENT: "genericTank",
    LABEL: "Voyage",
    DANGER: 8,
    BODY: Class.swarmer.BODY,
    GUNS: retype(Class.swarmer.GUNS, "hive", "voyageHive")
}

upgrade(["swarmer"], "voyage")
