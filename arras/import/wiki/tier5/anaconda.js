const { combineStats } = require("../facilitators.js")

const posObject = position => Array.isArray(position)
    ? { LENGTH: position[0], WIDTH: position[1], ASPECT: position[2], X: position[3], Y: position[4], ANGLE: position[5], DELAY: position[6] }
    : position
const upgradeGun = (gun, position = {}, mods = {}, type = gun.PROPERTIES.TYPE) => ({
    POSITION: { ...posObject(gun.POSITION), ...position },
    PROPERTIES: { ...gun.PROPERTIES, SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, mods]), TYPE: type }
})

Class.anaconda = {
    PARENT: "genericTank",
    LABEL: "Anaconda",
    DANGER: 8,
    BODY: Class.sidewinder.BODY,
    GUNS: [
        upgradeGun(Class.fieldGun.GUNS[0], { LENGTH: 16, Y: -9 }, { speed: 1.3, maxSpeed: 1.2 }),
        upgradeGun(Class.fieldGun.GUNS[1], { LENGTH: 16, Y: 9 }, { speed: 1.3, maxSpeed: 1.2 }),
        ...Class.sidewinder.GUNS
    ]
}

upgrade(["fieldGun", "sidewinder"], "anaconda")
