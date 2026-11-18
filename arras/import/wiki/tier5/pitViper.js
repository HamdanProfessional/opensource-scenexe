const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const retype = (guns, from, to) => guns.map(gun => {
    const type = gun.PROPERTIES && gun.PROPERTIES.TYPE
    if ([].concat(type)[0] !== from) return gun
    return { ...gun, PROPERTIES: { ...gun.PROPERTIES, TYPE: Array.isArray(type) ? [to, type[1]] : to } }
})
const modAll = (guns, mods) => guns.map(gun => gun.PROPERTIES && gun.PROPERTIES.SHOOT_SETTINGS
    ? { ...gun, PROPERTIES: { ...gun.PROPERTIES, SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, mods]) } }
    : gun)
const missileGun = (angle, y, x, mods = {}) => ({
    POSITION: { LENGTH: 10, WIDTH: 5, ASPECT: 1, X: x, Y: y, ANGLE: angle, DELAY: 0 },
    PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([g.basic, { size: 0.8, damage: 0.7, range: 0.6 }, mods]),
        TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }]
    }
})

Class.pitViperSnake = {
    PARENT: "snake",
    GUNS: [
        ...Class.snake.GUNS,
        missileGun(0, 0, 6, { size: 1.8, damage: 1.5 }),
        missileGun(180, -4, 4),
        missileGun(180, 4, 4)
    ]
}

Class.pitViper = {
    PARENT: "genericTank",
    LABEL: "Pit Viper",
    DANGER: 8,
    BODY: Class.skimmer.BODY,
    GUNS: modAll(retype(Class.skimmer.GUNS, "missile", "pitViperSnake"), { speed: 1.2, maxSpeed: 1.2 })
}

upgrade(["skimmer", "sidewinder"], "pitViper")
