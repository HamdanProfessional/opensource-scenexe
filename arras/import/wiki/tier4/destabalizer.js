const { combineStats } = require("../facilitators.js")

const posObject = position => Array.isArray(position)
    ? { LENGTH: position[0], WIDTH: position[1], ASPECT: position[2], X: position[3], Y: position[4], ANGLE: position[5], DELAY: position[6] }
    : position
const upgradeGun = (gun, position = {}, mods = {}, type = gun.PROPERTIES.TYPE) => ({
    POSITION: { ...posObject(gun.POSITION), ...position },
    PROPERTIES: { ...gun.PROPERTIES, SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, mods]), TYPE: type }
})

Class.destabalizer = {
    PARENT: "genericTank",
    LABEL: "Destabalizer",
    DANGER: 7,
    BODY: Class.subverter.BODY,
    GUNS: [
        upgradeGun(Class.subverter.GUNS[0], { LENGTH: 25, WIDTH: 12, DELAY: 0 }, { reload: 1.1 }),
        upgradeGun(Class.subverter.GUNS[0], { LENGTH: 23, WIDTH: 12, DELAY: 0.2 }, { reload: 1.1 }),
        upgradeGun(Class.subverter.GUNS[0], { LENGTH: 21, WIDTH: 12, DELAY: 0.4 }, { reload: 1.1 }),
        upgradeGun(Class.subverter.GUNS[0], { LENGTH: 19, WIDTH: 12, DELAY: 0.6 }, { reload: 1.1 }),
        upgradeGun(Class.subverter.GUNS[0], { LENGTH: 17, WIDTH: 12, DELAY: 0.8 }, { reload: 1.1 })
    ]
}

upgrade(["subverter"], "destabalizer")
