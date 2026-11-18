const { combineStats } = require("../facilitators.js")

const posObject = position => Array.isArray(position)
    ? { LENGTH: position[0], WIDTH: position[1], ASPECT: position[2], X: position[3], Y: position[4], ANGLE: position[5], DELAY: position[6] }
    : position
const upgradeGun = (gun, position = {}, mods = {}, type = gun.PROPERTIES.TYPE) => ({
    POSITION: { ...posObject(gun.POSITION), ...position },
    PROPERTIES: { ...gun.PROPERTIES, SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, mods]), TYPE: type }
})

Class.rogue = {
    PARENT: "genericTank",
    LABEL: "Rogue",
    DANGER: 8,
    BODY: Class.slinker.BODY,
    INVISIBLE: [0.1, 0.005],
    TOOLTIP: "Always nearly invisible. One shot, one kill.",
    GUNS: [upgradeGun(Class.slinker.GUNS[0], {}, { damage: 1.5, reload: 1.3, pen: 1.2 })]
}

upgrade(["slinker"], "rogue")
