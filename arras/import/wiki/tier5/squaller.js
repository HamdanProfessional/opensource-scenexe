const { combineStats, weaponArray } = require("../facilitators.js")
const g = require("../gunvals.js")

const retype = (guns, from, to) => guns.map(gun => {
    const type = gun.PROPERTIES && gun.PROPERTIES.TYPE
    if ([].concat(type)[0] !== from) return gun
    return { ...gun, PROPERTIES: { ...gun.PROPERTIES, TYPE: Array.isArray(type) ? [to, type[1]] : to } }
})
const missileTrap = (angle, x = 12) => ({
    POSITION: { LENGTH: 3, WIDTH: 7, ASPECT: 1.7, X: x, ANGLE: angle, DELAY: 0.5 },
    PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([g.trap, { size: 0.6, range: 0.6 }]),
        TYPE: "trap",
        STAT_CALCULATOR: "trap"
    }
})

Class.squallerMissile = {
    PARENT: "spinmissile",
    GUNS: [...Class.spinmissile.GUNS, ...weaponArray(missileTrap(0, 8), 3)]
}

Class.squaller = {
    PARENT: "genericTank",
    LABEL: "Squaller",
    DANGER: 8,
    BODY: Class.twister.BODY,
    GUNS: retype(Class.twister.GUNS, "spinmissile", "squallerMissile")
}

upgrade(["twister"], "squaller")
