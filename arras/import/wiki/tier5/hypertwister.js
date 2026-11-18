const { weaponArray } = require("../facilitators.js")

const retype = (guns, from, to) => guns.map(gun => {
    const type = gun.PROPERTIES && gun.PROPERTIES.TYPE
    if ([].concat(type)[0] !== from) return gun
    return { ...gun, PROPERTIES: { ...gun.PROPERTIES, TYPE: Array.isArray(type) ? [to, type[1]] : to } }
})
const spinCannon = position => ({
    POSITION: { LENGTH: 14, WIDTH: 8, ...position },
    PROPERTIES: Class.spinmissile.GUNS[0].PROPERTIES
})

Class.hypertwisterMissile = {
    PARENT: "spinmissile",
    GUNS: weaponArray(spinCannon({}), 4, { delayIncrement: 0.25 })
}

Class.hypertwister = {
    PARENT: "genericTank",
    LABEL: "Hypertwister",
    DANGER: 8,
    BODY: Class.twister.BODY,
    GUNS: retype(Class.twister.GUNS, "spinmissile", "hypertwisterMissile")
}

upgrade(["twister"], "hypertwister")
