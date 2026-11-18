const { combineStats, weaponMirror, makeOver } = require("../facilitators.js")
const g = require("../gunvals.js")
const preset = require("../presets.js")

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
const launcherGuns = (type, mods = {}, width = 13) => [
    Class.launcher.GUNS[0],
    upgradeGun(Class.launcher.GUNS[1], { WIDTH: width }, mods, type)
]
const pitcherGuns = (type, mods = {}) => [...launcherGuns(type, mods), ...pitcherSides]

Class.spieler = makeOver({
    PARENT: "genericTank",
    LABEL: "Pitcher",
    BODY: Class.launcher.BODY,
    GUNS: pitcherGuns("launcherMissile")
}, "Spieler", preset.hybrid)

upgrade(["pitcher", "heaver"], "spieler")
