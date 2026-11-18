const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const droneShot = combineStats([g.drone, g.overseer])
const rearDrone = {
    POSITION: { LENGTH: 6, WIDTH: 12, ASPECT: 1.2, X: 8, ANGLE: 180 },
    PROPERTIES: {
        SHOOT_SETTINGS: droneShot,
        TYPE: ["drone", { INDEPENDENT: true }],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "drone",
        WAIT_TO_CYCLE: false,
        MAX_CHILDREN: 3
    }
}
const posObject = position => Array.isArray(position)
    ? { LENGTH: position[0], WIDTH: position[1], ASPECT: position[2], X: position[3], Y: position[4], ANGLE: position[5], DELAY: position[6] }
    : position
const upgradeGun = (gun, position = {}, mods = {}, type = gun.PROPERTIES.TYPE) => ({
    POSITION: { ...posObject(gun.POSITION), ...position },
    PROPERTIES: { ...gun.PROPERTIES, SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, mods]), TYPE: type }
})
const missileGun = (angle, y, x, mods = {}) => ({
    POSITION: { LENGTH: 10, WIDTH: 5, ASPECT: 1, X: x, Y: y, ANGLE: angle, DELAY: 0 },
    PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([g.basic, { size: 0.8, damage: 0.7, range: 0.6 }, mods]),
        TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }]
    }
})
const launcherGuns = (type, mods = {}, width = 13) => [
    Class.launcher.GUNS[0],
    upgradeGun(Class.launcher.GUNS[1], { WIDTH: width }, mods, type)
]

Class.jutterMissile = {
    PARENT: "launcherMissile",
    GUNS: [...Class.launcherMissile.GUNS, missileGun(0, 0, 6)]
}

Class.jutter = {
    PARENT: "genericTank",
    LABEL: "Jutter",
    DANGER: 8,
    BODY: Class.launcher.BODY,
    GUNS: [...launcherGuns("jutterMissile"), rearDrone]
}

upgrade(["projector", "heaver"], "jutter")
