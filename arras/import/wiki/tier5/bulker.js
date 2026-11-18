const { combineStats } = require("../facilitators.js")

const posObject = position => Array.isArray(position)
    ? { LENGTH: position[0], WIDTH: position[1], ASPECT: position[2], X: position[3], Y: position[4], ANGLE: position[5], DELAY: position[6] }
    : position
const upgradeGun = (gun, position = {}, mods = {}, type = gun.PROPERTIES.TYPE) => ({
    POSITION: { ...posObject(gun.POSITION), ...position },
    PROPERTIES: { ...gun.PROPERTIES, SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, mods]), TYPE: type }
})
const hurlerGuns = (type, mods = {}, width = 16) => [
    Class.hurler.GUNS[0],
    upgradeGun(Class.hurler.GUNS[1], { WIDTH: width }, mods, type)
]

Class.bulker = {
    PARENT: "genericTank",
    LABEL: "Bulker",
    DANGER: 8,
    BODY: Class.hurler.BODY,
    GUNS: [
        upgradeGun(Class.fieldGun.GUNS[0], { Y: -10.5 }),
        upgradeGun(Class.fieldGun.GUNS[1], { Y: 10.5 }),
        ...hurlerGuns("minimissile", {})
    ]
}

upgrade(["hurler", "fieldGun"], "bulker")
