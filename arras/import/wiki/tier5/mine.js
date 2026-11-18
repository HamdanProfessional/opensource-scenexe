const { combineStats, weaponMirror, weaponArray } = require("../facilitators.js")
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
const missileGun = (angle, y, x, mods = {}) => ({
    POSITION: { LENGTH: 10, WIDTH: 5, ASPECT: 1, X: x, Y: y, ANGLE: angle, DELAY: 0 },
    PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([g.basic, { size: 0.8, damage: 0.7, range: 0.6 }, mods]),
        TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }]
    }
})
const burst = (count, mods = {}) => weaponArray({
    POSITION: { LENGTH: 8, WIDTH: 8 },
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, { size: 1.6, range: 0.3 }, mods]),
        TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
        SHOOT_ON_DEATH: true
    }
}, count)
const launcherGuns = (type, mods = {}, width = 13) => [
    Class.launcher.GUNS[0],
    upgradeGun(Class.launcher.GUNS[1], { WIDTH: width }, mods, type)
]
const pitcherGuns = (type, mods = {}) => [...launcherGuns(type, mods), ...pitcherSides]

Class.mineMissile = {
    PARENT: "launcherMissile",
    GUNS: [...Class.launcherMissile.GUNS, missileGun(180, 0, 6), ...burst(6)]
}

Class.mine = {
    PARENT: "genericTank",
    LABEL: "Mine",
    DANGER: 8,
    BODY: Class.launcher.BODY,
    GUNS: pitcherGuns("mineMissile", { speed: 1.2 })
}

upgrade(["pitcher", "cluster"], "mine")
