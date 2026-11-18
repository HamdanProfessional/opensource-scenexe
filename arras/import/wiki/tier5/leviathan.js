const { combineStats } = require("../facilitators.js")

const posObject = position => Array.isArray(position)
    ? { LENGTH: position[0], WIDTH: position[1], ASPECT: position[2], X: position[3], Y: position[4], ANGLE: position[5], DELAY: position[6] }
    : position
const upgradeGun = (gun, position = {}, mods = {}, type = gun.PROPERTIES.TYPE) => ({
    POSITION: { ...posObject(gun.POSITION), ...position },
    PROPERTIES: { ...gun.PROPERTIES, SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, mods]), TYPE: type }
})

Class.leviathan = {
    PARENT: "genericTank",
    LABEL: "Leviathan",
    DANGER: 8,
    BODY: Class.rocketeer.BODY,
    GUNS: [
        upgradeGun(Class.rocketeer.GUNS[0], { WIDTH: 10.5 }, { size: 1.25, damage: 1.4, health: 1.3, reload: 1.3 }),
        { ...Class.rocketeer.GUNS[1], POSITION: { ...posObject(Class.rocketeer.GUNS[1].POSITION), WIDTH: 15 } }
    ]
}

upgrade(["hurler", "rocketeer"], "leviathan")
