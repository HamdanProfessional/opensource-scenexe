const { combineStats } = require("../facilitators.js")

const posObject = position => Array.isArray(position)
    ? { LENGTH: position[0], WIDTH: position[1], ASPECT: position[2], X: position[3], Y: position[4], ANGLE: position[5], DELAY: position[6] }
    : position
const upgradeGun = (gun, position = {}, mods = {}, type = gun.PROPERTIES.TYPE) => ({
    POSITION: { ...posObject(gun.POSITION), ...position },
    PROPERTIES: { ...gun.PROPERTIES, SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, mods]), TYPE: type }
})

Class.beemaster = {
    PARENT: "genericTank",
    LABEL: "Beemaster",
    DANGER: 8,
    GUNS: [
        upgradeGun(Class.beekeeper.GUNS[0], { LENGTH: 11, Y: -8.5, ANGLE: -3.5, DELAY: 0.6 }),
        upgradeGun(Class.beekeeper.GUNS[1], { LENGTH: 11, Y: 8.5, ANGLE: 3.5, DELAY: 0.8 }),
        ...Class.beekeeper.GUNS
    ]
}

upgrade(["mortar", "beekeeper"], "beemaster")
