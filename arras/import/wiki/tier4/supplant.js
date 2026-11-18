const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const hurlerShot = combineStats([g.basic, g.pounder, g.destroyer, g.launcher])
const posObject = position => Array.isArray(position)
    ? { LENGTH: position[0], WIDTH: position[1], ASPECT: position[2], X: position[3], Y: position[4], ANGLE: position[5], DELAY: position[6] }
    : position
const upgradeGun = (gun, position = {}, mods = {}, type = gun.PROPERTIES.TYPE) => ({
    POSITION: { ...posObject(gun.POSITION), ...position },
    PROPERTIES: { ...gun.PROPERTIES, SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, mods]), TYPE: type }
})

Class.supplant = {
    PARENT: "genericTank",
    LABEL: "Supplant",
    DANGER: 7,
    BODY: Class.subverter.BODY,
    GUNS: [
        upgradeGun(Class.subverter.GUNS[0], { LENGTH: 21, WIDTH: 14 }, { reload: 1.3 }),
        upgradeGun(Class.subverter.GUNS[1], { LENGTH: 19, WIDTH: 14 }, { reload: 1.3 }),
        {
            POSITION: { LENGTH: 17, WIDTH: 14, DELAY: 0.66 },
            PROPERTIES: { SHOOT_SETTINGS: hurlerShot, TYPE: "minimissile", STAT_CALCULATOR: "sustained" }
        }
    ]
}

upgrade(["subverter"], "supplant")
