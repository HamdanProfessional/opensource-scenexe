const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

const retype = (guns, from, to) => guns.map(gun => {
    const type = gun.PROPERTIES && gun.PROPERTIES.TYPE
    if ([].concat(type)[0] !== from) return gun
    return { ...gun, PROPERTIES: { ...gun.PROPERTIES, TYPE: Array.isArray(type) ? [to, type[1]] : to } }
})
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

Class.hyperskimmerMissile = {
    PARENT: "missile",
    GUNS: [...Class.missile.GUNS, thruster(155, -3), thruster(205, 3)]
}

Class.hyperskimmer = {
    PARENT: "genericTank",
    LABEL: "Hyperskimmer",
    DANGER: 8,
    BODY: Class.skimmer.BODY,
    GUNS: retype(Class.skimmer.GUNS, "missile", "hyperskimmerMissile")
}

upgrade(["skimmer"], "hyperskimmer")
