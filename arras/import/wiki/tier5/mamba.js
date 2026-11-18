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

Class.mambaSnake = {
    PARENT: "snake",
    GUNS: [...Class.snake.GUNS, thruster(150, -3), thruster(210, 3)]
}

Class.mamba = {
    PARENT: "genericTank",
    LABEL: "Mamba",
    DANGER: 8,
    BODY: Class.sidewinder.BODY,
    GUNS: modAll(retype(Class.sidewinder.GUNS, "snake", "mambaSnake"), { speed: 1.15, maxSpeed: 1.15 })
}

upgrade(["sidewinder", "rocketeer"], "mamba")
