const { combineStats, weaponMirror } = require("../facilitators.js")
const g = require("../gunvals.js")

const pelletShot = combineStats([g.basic, g.pelleter, g.artillery])
const posObject = position => Array.isArray(position)
    ? { LENGTH: position[0], WIDTH: position[1], ASPECT: position[2], X: position[3], Y: position[4], ANGLE: position[5], DELAY: position[6] }
    : position
const upgradeGun = (gun, position = {}, mods = {}, type = gun.PROPERTIES.TYPE) => ({
    POSITION: { ...posObject(gun.POSITION), ...position },
    PROPERTIES: { ...gun.PROPERTIES, SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, mods]), TYPE: type }
})
const pitcherSides = weaponMirror({
    POSITION: { LENGTH: 13, WIDTH: 5, Y: 4 },
    PROPERTIES: { SHOOT_SETTINGS: pelletShot, TYPE: "bullet" }
}, { delayIncrement: 0.5 })
const thruster = (angle, y = 0, length = 14, width = 6) => ({
    POSITION: { LENGTH: length, WIDTH: width, ASPECT: 1, X: 0, Y: y, ANGLE: angle, DELAY: 0 },
    PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, { speed: 1.3, maxSpeed: 1.3 }]),
        TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
        STAT_CALCULATOR: "thruster",
        WAIT_TO_CYCLE: true
    }
})
const launcherGuns = (type, mods = {}, width = 13) => [
    Class.launcher.GUNS[0],
    upgradeGun(Class.launcher.GUNS[1], { WIDTH: width }, mods, type)
]
const pitcherGuns = (type, mods = {}) => [...launcherGuns(type, mods), ...pitcherSides]

Class.dispatcherMissile = {
    PARENT: "launcherMissile",
    GUNS: [thruster(180, -1.5, 10, 3), thruster(180, 1.5, 10, 3), thruster(180, -4.5, 10, 3), thruster(180, 4.5, 10, 3)]
}

Class.dispatcher = {
    PARENT: "genericTank",
    LABEL: "Dispatcher",
    DANGER: 8,
    BODY: Class.launcher.BODY,
    GUNS: pitcherGuns("dispatcherMissile")
}

upgrade(["pitcher"], "dispatcher")
