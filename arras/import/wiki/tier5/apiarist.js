const { combineStats } = require("../facilitators.js")

const posObject = position => Array.isArray(position)
    ? { LENGTH: position[0], WIDTH: position[1], ASPECT: position[2], X: position[3], Y: position[4], ANGLE: position[5], DELAY: position[6] }
    : position
const upgradeGun = (gun, position = {}, mods = {}, type = gun.PROPERTIES.TYPE) => ({
    POSITION: { ...posObject(gun.POSITION), ...position },
    PROPERTIES: { ...gun.PROPERTIES, SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, mods]), TYPE: type }
})

Class.apiarist = {
    PARENT: "genericTank",
    LABEL: "Apiarist",
    DANGER: 8,
    GUNS: [
        upgradeGun(Class.beekeeper.GUNS[0], { WIDTH: 7 }, { size: 1.6, health: 1.3, damage: 1.2, reload: 1.15 }),
        upgradeGun(Class.beekeeper.GUNS[1], { WIDTH: 7 }, { size: 1.6, health: 1.3, damage: 1.2, reload: 1.15 }),
        Class.beekeeper.GUNS[2]
    ]
}

upgrade(["beekeeper"], "apiarist")
