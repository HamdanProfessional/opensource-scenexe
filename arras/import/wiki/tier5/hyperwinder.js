const { combineStats, weaponMirror } = require("../facilitators.js")

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
const modAll = (guns, mods) => guns.map(gun => gun.PROPERTIES && gun.PROPERTIES.SHOOT_SETTINGS
    ? { ...gun, PROPERTIES: { ...gun.PROPERTIES, SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, mods]) } }
    : gun)

Class.hyperwinderSnake = {
    PARENT: "snake",
    GUNS: [
        ...Class.snake.GUNS,
        ...weaponMirror(upgradeGun(Class.snake.GUNS[0], { Y: -4 }))
    ]
}

Class.hyperwinder = {
    PARENT: "genericTank",
    LABEL: "Hyperwinder",
    DANGER: 8,
    BODY: Class.sidewinder.BODY,
    GUNS: modAll(retype(Class.sidewinder.GUNS, "snake", "hyperwinderSnake"), { speed: 1.25, maxSpeed: 1.25 })
}

upgrade(["sidewinder"], "hyperwinder")
