const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

const posObject = position => Array.isArray(position)
    ? { LENGTH: position[0], WIDTH: position[1], ASPECT: position[2], X: position[3], Y: position[4], ANGLE: position[5], DELAY: position[6] }
    : position
const upgradeGun = (gun, position = {}, mods = {}, type = gun.PROPERTIES.TYPE) => ({
    POSITION: { ...posObject(gun.POSITION), ...position },
    PROPERTIES: { ...gun.PROPERTIES, SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, mods]), TYPE: type }
})
const launcherGuns = (type, mods = {}, width = 13) => [
    Class.launcher.GUNS[0],
    upgradeGun(Class.launcher.GUNS[1], { WIDTH: width }, mods, type)
]

Class.neutronMissile = {
    PARENT: "launcherMissile",
    GUNS: [
        ...Class.launcherMissile.GUNS,
        ...weaponArray({
            POSITION: { LENGTH: 8, WIDTH: 8 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { size: 1.3, range: 0.4 }]),
                TYPE: ["minimissile", { PERSISTS_AFTER_DEATH: true }],
                SHOOT_ON_DEATH: true
            }
        }, 4)
    ]
}

Class.neutron = {
    PARENT: "genericTank",
    LABEL: "Neutron",
    DANGER: 8,
    BODY: Class.launcher.BODY,
    GUNS: launcherGuns("neutronMissile")
}

upgrade(["cluster"], "neutron")
